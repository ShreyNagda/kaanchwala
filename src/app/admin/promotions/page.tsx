/* eslint-disable react-hooks/immutability */
"use client";

import { useState, useEffect } from "react";
import {
  getPromotionUsers,
  sendPromotionalCampaign,
  getPromotionHistory,
  PromotionUser,
} from "@/lib/actions/promotions";
import { type AdminLog } from "@/lib/logging";
import { toast } from "sonner";
import {
  Megaphone,
  Mail,
  MessageSquare,
  Users,
  UserCheck,
  Search,
  Loader2,
  History,
  Send,
  Calendar,
} from "lucide-react";
import { format } from "date-fns";

interface CampaignDetails {
  channel: "email" | "whatsapp";
  targetGroup: "all" | "customers" | "custom";
  targetCount: number;
  sentCount: number;
  heading: string;
  subject?: string;
  errors?: string[];
}

export default function PromotionsPage() {
  const [users, setUsers] = useState<PromotionUser[]>([]);
  const [history, setHistory] = useState<AdminLog[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [sending, setSending] = useState(false);

  // Search/Filters
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | "customers" | "guests">(
    "all",
  );
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  // Form State
  const [channel, setChannel] = useState<"email" | "whatsapp">("email");
  const [targetGroup, setTargetGroup] = useState<
    "all" | "customers" | "custom"
  >("all");
  const [subject, setSubject] = useState("");
  const [heading, setHeading] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoadingUsers(true);
      const fetchedUsers = await getPromotionUsers();
      setUsers(fetchedUsers);
    } catch (_) {
      console.log(_);
      toast.error("Failed to load user list");
    } finally {
      setLoadingUsers(false);
    }

    try {
      setLoadingHistory(true);
      const fetchedHistory = await getPromotionHistory();
      setHistory(fetchedHistory);
    } catch (_) {
      console.log(_);
      toast.error("Failed to load campaign history");
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const handleSelectAll = (filteredUsers: PromotionUser[]) => {
    if (selectedUserIds.length === filteredUsers.length) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(filteredUsers.map((u) => u.id));
    }
  };

  const handleSendCampaign = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!heading.trim() || !content.trim()) {
      toast.error("Please fill in heading and content fields.");
      return;
    }

    if (channel === "email" && !subject.trim()) {
      toast.error("Please enter an email subject line.");
      return;
    }

    if (targetGroup === "custom" && selectedUserIds.length === 0) {
      toast.error(
        "Please select at least one user from the list for custom target.",
      );
      return;
    }

    setSending(true);
    const toastId = toast.loading("Dispatching campaign promotions...");

    try {
      const res = await sendPromotionalCampaign({
        channel,
        targetGroup,
        selectedUserIds: targetGroup === "custom" ? selectedUserIds : undefined,
        subject: channel === "email" ? subject : undefined,
        heading,
        content,
      });

      if (res.success) {
        toast.success(
          `Campaign sent successfully to ${res.sentCount} user(s)!`,
          {
            id: toastId,
          },
        );
        // Reset Form
        setHeading("");
        setContent("");
        setSubject("");
        setSelectedUserIds([]);
        // Reload History
        const fetchedHistory = await getPromotionHistory();
        setHistory(fetchedHistory);
      } else {
        toast.error(res.error || "Failed to dispatch campaign", {
          id: toastId,
        });
      }
    } catch (_) {
      console.log(_);
      toast.error("An unexpected error occurred", { id: toastId });
    } finally {
      setSending(false);
    }
  };

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.phone.includes(search);

    if (filterType === "customers")
      return matchesSearch && u.isCustomer && !u.id.startsWith("guest_");
    if (filterType === "guests")
      return matchesSearch && u.id.startsWith("guest_");
    return matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Megaphone className="h-6 w-6 text-accent" />
            Promotions &amp; Marketing
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Send premium marketing updates, discounts, and announcements to your
            customer base.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Campaign Composer */}
        <div className="lg:col-span-7 space-y-6">
          <div className="card p-6">
            <h2 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-accent" />
              Campaign Composer
            </h2>

            <form onSubmit={handleSendCampaign} className="space-y-5">
              {/* Channel Select */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
                  Delivery Channel
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setChannel("email")}
                    className={`flex items-center justify-center gap-2.5 p-3 rounded-lg border text-sm font-medium transition-all ${
                      channel === "email"
                        ? "bg-primary/5 border-primary text-primary"
                        : "border-border bg-surface hover:bg-muted text-muted-foreground"
                    }`}
                  >
                    <Mail className="h-4 w-4" />
                    Email (Resend)
                  </button>
                  <button
                    type="button"
                    onClick={() => setChannel("whatsapp")}
                    className={`flex items-center justify-center gap-2.5 p-3 rounded-lg border text-sm font-medium transition-all ${
                      channel === "whatsapp"
                        ? "bg-primary/5 border-primary text-primary"
                        : "border-border bg-surface hover:bg-muted text-muted-foreground"
                    }`}
                  >
                    <MessageSquare className="h-4 w-4" />
                    WhatsApp (Simulated)
                  </button>
                </div>
              </div>

              {/* Target Audience Select */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
                  Target Audience
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setTargetGroup("all")}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-lg border text-center transition-all ${
                      targetGroup === "all"
                        ? "bg-primary/5 border-primary text-primary"
                        : "border-border bg-surface hover:bg-muted text-muted-foreground"
                    }`}
                  >
                    <Users className="h-4 w-4 mb-1" />
                    <span className="text-xs font-medium">All Users</span>
                    <span className="text-[10px] opacity-70">
                      ({users.length})
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTargetGroup("customers")}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-lg border text-center transition-all ${
                      targetGroup === "customers"
                        ? "bg-primary/5 border-primary text-primary"
                        : "border-border bg-surface hover:bg-muted text-muted-foreground"
                    }`}
                  >
                    <UserCheck className="h-4 w-4 mb-1" />
                    <span className="text-xs font-medium">Customers</span>
                    <span className="text-[10px] opacity-70">
                      ({users.filter((u) => u.isCustomer).length})
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTargetGroup("custom")}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-lg border text-center transition-all ${
                      targetGroup === "custom"
                        ? "bg-primary/5 border-primary text-primary"
                        : "border-border bg-surface hover:bg-muted text-muted-foreground"
                    }`}
                  >
                    <Users className="h-4 w-4 mb-1" />
                    <span className="text-xs font-medium">
                      Custom ({selectedUserIds.length})
                    </span>
                    <span className="text-[10px] opacity-70">Selected</span>
                  </button>
                </div>
              </div>

              {/* Subject (only for email) */}
              {channel === "email" && (
                <div>
                  <label
                    htmlFor="promo-subject"
                    className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5"
                  >
                    Email Subject Line
                  </label>
                  <input
                    id="promo-subject"
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Exclusive Weekend Sale — 20% Off!"
                    className="input-field"
                    required
                  />
                </div>
              )}

              {/* Heading */}
              <div>
                <label
                  htmlFor="promo-heading"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5"
                >
                  Campaign Title / Heading
                </label>
                <input
                  id="promo-heading"
                  type="text"
                  value={heading}
                  onChange={(e) => setHeading(e.target.value)}
                  placeholder="e.g. Introducing The Summer Curation"
                  className="input-field"
                  required
                />
              </div>

              {/* Content */}
              <div>
                <label
                  htmlFor="promo-content"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5"
                >
                  Message Content (Markdown &amp; Linebreaks supported)
                </label>
                <textarea
                  id="promo-content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Draft your promotional message here..."
                  className="input-field min-h-36 resize-y"
                  required
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={sending}
                className="btn-primary w-full gap-2"
              >
                {sending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {sending ? "Sending Campaign..." : "Send Promotional Campaign"}
              </button>
            </form>
          </div>
        </div>

        {/* Audience Explorer */}
        <div className="lg:col-span-5 space-y-6">
          <div className="card p-6 flex flex-col h-150">
            <h2 className="text-lg font-semibold mb-3 text-foreground">
              Audience List
            </h2>

            {/* Search and Filters */}
            <div className="space-y-3 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by name, email, phone..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input-field pl-9 py-1.5 text-sm"
                />
              </div>

              <div className="flex gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setFilterType("all")}
                  className={`px-3 py-1 rounded-full border transition-all ${
                    filterType === "all"
                      ? "bg-accent/10 text-accent border-accent/20"
                      : "bg-surface border-border text-muted-foreground hover:bg-muted"
                  }`}
                >
                  All ({users.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterType("customers")}
                  className={`px-3 py-1 rounded-full border transition-all ${
                    filterType === "customers"
                      ? "bg-accent/10 text-accent border-accent/20"
                      : "bg-surface border-border text-muted-foreground hover:bg-muted"
                  }`}
                >
                  Members (
                  {users.filter((u) => !u.id.startsWith("guest_")).length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterType("guests")}
                  className={`px-3 py-1 rounded-full border transition-all ${
                    filterType === "guests"
                      ? "bg-accent/10 text-accent border-accent/20"
                      : "bg-surface border-border text-muted-foreground hover:bg-muted"
                  }`}
                >
                  Guests (
                  {users.filter((u) => u.id.startsWith("guest_")).length})
                </button>
              </div>
            </div>

            {/* User List */}
            <div className="flex-1 overflow-y-auto border border-border/60 rounded-lg bg-muted/20">
              {loadingUsers ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <Loader2 className="h-6 w-6 animate-spin mb-2" />
                  <span className="text-xs">Loading audience list...</span>
                </div>
              ) : filteredUsers.length > 0 ? (
                <table className="w-full text-left text-xs">
                  <thead className="sticky top-0 bg-surface border-b border-border z-10">
                    <tr>
                      <th className="p-3 w-8">
                        {targetGroup === "custom" && (
                          <input
                            type="checkbox"
                            checked={
                              selectedUserIds.length === filteredUsers.length &&
                              filteredUsers.length > 0
                            }
                            onChange={() => handleSelectAll(filteredUsers)}
                            className="rounded border-border text-accent focus:ring-accent"
                          />
                        )}
                      </th>
                      <th className="p-3 font-semibold text-muted-foreground uppercase">
                        User / Contact
                      </th>
                      <th className="p-3 font-semibold text-muted-foreground uppercase text-right">
                        Segment
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {filteredUsers.map((user) => {
                      const isSelected = selectedUserIds.includes(user.id);
                      return (
                        <tr
                          key={user.id}
                          onClick={() =>
                            targetGroup === "custom" &&
                            handleSelectUser(user.id)
                          }
                          className={`hover:bg-muted/30 transition-all ${
                            targetGroup === "custom" ? "cursor-pointer" : ""
                          } ${isSelected ? "bg-accent/5" : ""}`}
                        >
                          <td className="p-3 text-center">
                            {targetGroup === "custom" ? (
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => {}} // Handled by tr click
                                className="rounded border-border text-accent focus:ring-accent"
                              />
                            ) : (
                              <span className="w-2 h-2 rounded-full bg-border inline-block" />
                            )}
                          </td>
                          <td className="p-3">
                            <div className="font-semibold text-foreground truncate max-w-44">
                              {user.fullName}
                            </div>
                            <div className="text-[10px] text-muted-foreground">
                              {user.email || "No Email"}
                            </div>
                            {user.phone && (
                              <div className="text-[9px] text-accent font-mono mt-0.5">
                                {user.phone}
                              </div>
                            )}
                          </td>
                          <td className="p-3 text-right">
                            <span
                              className={`badge ${
                                user.id.startsWith("guest_")
                                  ? "badge-muted"
                                  : user.role === "admin"
                                    ? "badge-success"
                                    : "badge"
                              }`}
                            >
                              {user.id.startsWith("guest_")
                                ? "Guest"
                                : user.role === "admin"
                                  ? "Admin"
                                  : "Member"}
                            </span>
                            {user.isCustomer && (
                              <div className="text-[9px] text-success font-medium mt-1">
                                Buyer
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground py-10">
                  No target users match your filters.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Campaigns Dispatch History */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
          <History className="h-5 w-5 text-accent" />
          Campaign Dispatch History
        </h2>

        {loadingHistory ? (
          <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin mb-2" />
            <span className="text-xs">Loading campaign logs...</span>
          </div>
        ) : history.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border/80 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="pb-3 px-2">Campaign Title</th>
                  <th className="pb-3 px-2">Channel</th>
                  <th className="pb-3 px-2">Target Group</th>
                  <th className="pb-3 px-2 text-center">Dispatched</th>
                  <th className="pb-3 px-2 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {history.map((log, idx) => {
                  const details = (log.details ||
                    {}) as unknown as CampaignDetails;
                  return (
                    <tr key={idx} className="hover:bg-muted/20 transition-all">
                      <td className="py-3 px-2 font-medium">
                        {/* {details.heading || "Promotional Broadcast"} */}
                        {/* {details.subject && (
                          <div className="text-[10px] text-muted-foreground font-light mt-0.5">
                            Sub: {details.subject}
                          </div>
                        )} */}
                      </td>
                      <td className="py-3 px-2">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                            details.channel === "email"
                              ? "bg-blue-500/10 text-blue-500"
                              : "bg-green-500/10 text-green-500"
                          }`}
                        >
                          {details.channel === "email" ? (
                            <Mail className="h-3 w-3" />
                          ) : (
                            <MessageSquare className="h-3 w-3" />
                          )}
                          {details.channel === "email" ? "Email" : "WhatsApp"}
                        </span>
                      </td>
                      <td className="py-3 px-2 capitalize">
                        {details.targetGroup || "All"}
                      </td>
                      <td className="py-3 px-2 text-center font-semibold">
                        {details.sentCount || details.targetCount || 0} /{" "}
                        {details.targetCount || 0}
                      </td>
                      <td className="py-3 px-2 text-right text-xs text-muted-foreground whitespace-nowrap">
                        <span className="flex items-center justify-end gap-1.5">
                          <Calendar className="h-3 w-3 text-muted-foreground/80" />
                          {format(
                            new Date(log.created_at),
                            "MMM d, yyyy h:mm a",
                          )}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10 text-muted-foreground text-sm">
            No promotional campaigns have been dispatched yet.
          </div>
        )}
      </div>
    </div>
  );
}
