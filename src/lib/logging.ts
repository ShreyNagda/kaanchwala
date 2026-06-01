import { createAdminClient } from "./supabase/admin";
import fs from "fs";
import path from "path";

export interface AdminLog {
  action: string;
  details: Record<string, unknown>;
  created_at: string;
}

/**
 * Audit log admin actions.
 * Writes to DB table `admin_logs` with a fallback to local JSON Lines file if DB table is not ready.
 */
export async function logAdminAction(
  action: string,
  details: Record<string, unknown> = {},
) {
  const timestamp = new Date().toISOString();
  const logEntry: AdminLog = {
    action,
    details,
    created_at: timestamp,
  };

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("admin_logs").insert({
      action,
      details,
      created_at: timestamp,
    });

    if (error) {
      // If table doesn't exist (PGRST205), we log locally. Otherwise throw to catch block.
      if (error.code === "PGRST205") {
        writeLocalLog(logEntry);
      } else {
        console.error("DB logging error:", error.message);
        writeLocalLog(logEntry);
      }
    } else {
      console.log(`[AUDIT] logged to DB: ${action}`);
    }
  } catch (err) {
    console.error("Unexpected error in DB logging, falling back:", err);
    writeLocalLog(logEntry);
  }
}

/**
 * Read audit logs from both DB and local file, merging and sorting them.
 */
export async function getAdminLogs(): Promise<AdminLog[]> {
  const logs: AdminLog[] = [];

  // 1. Try to read from DB
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("admin_logs")
      .select("action, details, created_at")
      .order("created_at", { ascending: false });

    if (data && !error) {
      logs.push(...data);
    }
  } catch (err) {
    console.warn("Could not read admin logs from database:", err);
  }

  // 2. Read from local file
  const localLogs = readLocalLogs();
  logs.push(...localLogs);

  // 3. Remove duplicates (by timestamp + action) and sort newest first
  const seen = new Set<string>();
  const uniqueLogs = logs.filter((log) => {
    const key = `${log.created_at}_${log.action}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return uniqueLogs.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
}

// Helpers for local filesystem fallback
const LOCAL_LOG_DIR = path.join(process.cwd(), "src", "lib", "logs");
const LOCAL_LOG_FILE = path.join(LOCAL_LOG_DIR, "admin_actions.jsonl");

function writeLocalLog(entry: AdminLog) {
  try {
    if (!fs.existsSync(LOCAL_LOG_DIR)) {
      fs.mkdirSync(LOCAL_LOG_DIR, { recursive: true });
    }
    fs.appendFileSync(LOCAL_LOG_FILE, JSON.stringify(entry) + "\n", "utf-8");
    console.log(`[AUDIT] logged locally: ${entry.action}`);
  } catch (err) {
    console.error("Failed to write local log:", err);
  }
}

function readLocalLogs(): AdminLog[] {
  try {
    if (fs.existsSync(LOCAL_LOG_FILE)) {
      const content = fs.readFileSync(LOCAL_LOG_FILE, "utf-8");
      return content
        .split("\n")
        .filter((line) => line.trim() !== "")
        .map((line) => JSON.parse(line) as AdminLog);
    }
  } catch (err) {
    console.error("Failed to read local logs:", err);
  }
  return [];
}
