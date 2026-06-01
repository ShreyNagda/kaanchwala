"use client";

import { useState } from "react";
import { FileText, UploadCloud, Eye, Plus, Calendar } from "lucide-react";
import { toast } from "sonner";
import {
  uploadPrescriptionFile,
  saveAccountPrescription,
} from "@/lib/actions/checkout";
import { format } from "date-fns";
import { Prescription } from "@/lib/types";
import Image from "next/image";

interface PrescriptionManagerProps {
  initialPrescriptions: Prescription[];
}

export function PrescriptionManager({
  initialPrescriptions,
}: PrescriptionManagerProps) {
  const prescriptions = initialPrescriptions || [];
  const [showAddForm, setShowAddForm] = useState(false);
  const [entryMode, setEntryMode] = useState<"upload" | "manual">("upload");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dpdpConsent, setDpdpConsent] = useState(false);

  // Manual Form States
  const [sphR, setSphR] = useState("");
  const [cylR, setCylR] = useState("");
  const [axisR, setAxisR] = useState("");
  const [addR, setAddR] = useState("");
  const [sphL, setSphL] = useState("");
  const [cylL, setCylL] = useState("");
  const [axisL, setAxisL] = useState("");
  const [addL, setAddL] = useState("");
  const [pd, setPd] = useState("");
  const [notes, setNotes] = useState("");

  // File Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const resetForm = () => {
    setSphR("");
    setCylR("");
    setAxisR("");
    setAddR("");
    setSphL("");
    setCylL("");
    setAxisL("");
    setAddL("");
    setPd("");
    setNotes("");
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setDpdpConsent(false);
    setShowAddForm(false);
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dpdpConsent) {
      toast.error("Please provide DPDP Act consent.");
      return;
    }

    setIsSubmitting(true);
    const parsedData = {
      sph_r: sphR ? parseFloat(sphR) : null,
      cyl_r: cylR ? parseFloat(cylR) : null,
      axis_r: axisR ? parseInt(axisR) : null,
      add_r: addR ? parseFloat(addR) : null,
      sph_l: sphL ? parseFloat(sphL) : null,
      cyl_l: cylL ? parseFloat(cylL) : null,
      axis_l: axisL ? parseInt(axisL) : null,
      add_l: addL ? parseFloat(addL) : null,
      pd: pd ? parseFloat(pd) : null,
      dpdpConsent: true,
      notes: notes || null,
    };

    const res = await saveAccountPrescription(parsedData);
    setIsSubmitting(false);

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Prescription details saved successfully!");
      // reload prescriptions from standard reload or optimistically add it
      window.location.reload();
    }
  };

  const handleFileUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error("Please select a file to upload.");
      return;
    }
    if (!dpdpConsent) {
      toast.error("Please provide DPDP Act consent.");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("file", selectedFile);

    const uploadRes = await uploadPrescriptionFile(formData);
    if (uploadRes.error) {
      toast.error(`Upload failed: ${uploadRes.error}`);
      setIsSubmitting(false);
      return;
    }

    const saveRes = await saveAccountPrescription({
      prescriptionUrl: uploadRes.url,
      dpdpConsent: true,
      notes: notes || null,
    });
    setIsSubmitting(false);

    if (saveRes.error) {
      toast.error(saveRes.error);
    } else {
      toast.success("Prescription file uploaded and saved!");
      window.location.reload();
    }
  };

  return (
    <div className="card-static p-6 mt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5 text-accent" />
            My Prescriptions
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage your saved prescriptions for quick checkout
          </p>
        </div>
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-accent gap-2 text-sm self-start sm:self-auto py-2 px-4 whitespace-nowrap"
          >
            <Plus className="h-4 w-4 shrink-0" />
            Add Prescription
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="border border-border rounded-xl p-4 bg-muted/30 mb-6 animate-fade-in">
          <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
            <h3 className="text-sm font-medium">New Prescription</h3>
            <button
              onClick={resetForm}
              className="text-xs text-muted-foreground hover:text-foreground underline whitespace-nowrap"
            >
              Cancel
            </button>
          </div>

          {/* Toggle Tabs */}
          <div className="flex bg-muted/60 p-1 rounded-lg mb-4 max-w-xs">
            <button
              type="button"
              onClick={() => setEntryMode("upload")}
              className={`flex-1 text-xs py-1.5 px-3 rounded-md transition-all whitespace-nowrap ${
                entryMode === "upload"
                  ? "bg-surface shadow-sm font-medium text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Upload Document
            </button>
            <button
              type="button"
              onClick={() => setEntryMode("manual")}
              className={`flex-1 text-xs py-1.5 px-3 rounded-md transition-all whitespace-nowrap ${
                entryMode === "manual"
                  ? "bg-surface shadow-sm font-medium text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Enter Manually
            </button>
          </div>

          {entryMode === "upload" ? (
            <form onSubmit={handleFileUploadSubmit} className="space-y-4">
              <div className="border border-dashed border-border rounded-xl p-6 text-center hover:bg-muted/10 transition-colors">
                <input
                  type="file"
                  id="prescription-file-upload"
                  accept="image/*,application/pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setSelectedFile(file);
                      if (file.type.startsWith("image/")) {
                        setPreviewUrl(URL.createObjectURL(file));
                      } else {
                        setPreviewUrl(null);
                      }
                    }
                  }}
                  className="hidden"
                />
                <label
                  htmlFor="prescription-file-upload"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  {selectedFile ? (
                    <div className="flex flex-col items-center gap-2">
                      {previewUrl ? (
                        <Image
                          width={50}
                          height={50}
                          src={previewUrl}
                          alt="Prescription Preview"
                          className="max-h-40 max-w-full object-contain rounded-lg border border-border"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-1 p-3 bg-surface border border-border rounded-lg">
                          <FileText className="h-10 w-10 text-accent" />
                          <span className="text-xs font-medium truncate max-w-45">
                            {selectedFile.name}
                          </span>
                        </div>
                      )}
                      <span className="text-xs text-muted-foreground underline cursor-pointer mt-1">
                        Change File
                      </span>
                    </div>
                  ) : (
                    <>
                      <UploadCloud className="h-8 w-8 text-muted-foreground" />
                      <span className="text-xs font-medium text-foreground underline whitespace-nowrap">
                        Choose prescription image or PDF
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        Max size: 5MB (PDF, PNG, JPG)
                      </span>
                    </>
                  )}
                </label>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Optional Notes
                </label>
                <input
                  type="text"
                  placeholder="Doctor's name, prescription date, etc."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="input-field py-1"
                />
              </div>

              {/* DPDP Consent */}
              <div className="flex items-start gap-2 bg-muted/40 p-3 rounded-lg border border-border">
                <input
                  type="checkbox"
                  id="dpdp-consent-file"
                  checked={dpdpConsent}
                  onChange={(e) => setDpdpConsent(e.target.checked)}
                  className="mt-0.5 rounded border-border text-accent focus:ring-accent"
                />
                <label
                  htmlFor="dpdp-consent-file"
                  className="text-[10px] sm:text-xs text-muted-foreground leading-normal font-light"
                >
                  I explicitly consent to Kaanchwala securely processing and
                  storing my medical/prescription data in compliance with the
                  Digital Personal Data Protection (DPDP) Act.
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !selectedFile || !dpdpConsent}
                className="btn-accent w-full py-2 whitespace-nowrap text-sm disabled:opacity-50"
              >
                {isSubmitting ? "Uploading..." : "Save Prescription"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleManualSubmit} className="space-y-4">
              {/* Manual Entry Table Grid */}
              <div className="overflow-x-auto border border-border rounded-xl bg-surface">
                <table className="min-w-full divide-y divide-border text-center text-xs">
                  <thead>
                    <tr className="bg-muted/40">
                      <th className="px-2 py-1.5 font-medium text-muted-foreground">
                        Eye
                      </th>
                      <th className="px-2 py-1.5 font-medium text-muted-foreground">
                        SPH
                      </th>
                      <th className="px-2 py-1.5 font-medium text-muted-foreground">
                        CYL
                      </th>
                      <th className="px-2 py-1.5 font-medium text-muted-foreground">
                        Axis
                      </th>
                      <th className="px-2 py-1.5 font-medium text-muted-foreground">
                        ADD
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="px-2 py-1.5 font-medium text-foreground">
                        Right (OD)
                      </td>
                      <td className="px-1.5 py-1">
                        <input
                          type="number"
                          step="0.25"
                          placeholder="-0.00"
                          value={sphR}
                          onChange={(e) => setSphR(e.target.value)}
                          className="w-16 text-center border border-border rounded p-1 bg-background outline-none focus:border-accent text-xs"
                        />
                      </td>
                      <td className="px-1.5 py-1">
                        <input
                          type="number"
                          step="0.25"
                          placeholder="-0.00"
                          value={cylR}
                          onChange={(e) => setCylR(e.target.value)}
                          className="w-16 text-center border border-border rounded p-1 bg-background outline-none focus:border-accent text-xs"
                        />
                      </td>
                      <td className="px-1.5 py-1">
                        <input
                          type="number"
                          placeholder="0"
                          value={axisR}
                          onChange={(e) => setAxisR(e.target.value)}
                          className="w-16 text-center border border-border rounded p-1 bg-background outline-none focus:border-accent text-xs"
                        />
                      </td>
                      <td className="px-1.5 py-1">
                        <input
                          type="number"
                          step="0.25"
                          placeholder="+0.00"
                          value={addR}
                          onChange={(e) => setAddR(e.target.value)}
                          className="w-16 text-center border border-border rounded p-1 bg-background outline-none focus:border-accent text-xs"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="px-2 py-1.5 font-medium text-foreground">
                        Left (OS)
                      </td>
                      <td className="px-1.5 py-1">
                        <input
                          type="number"
                          step="0.25"
                          placeholder="-0.00"
                          value={sphL}
                          onChange={(e) => setSphL(e.target.value)}
                          className="w-16 text-center border border-border rounded p-1 bg-background outline-none focus:border-accent text-xs"
                        />
                      </td>
                      <td className="px-1.5 py-1">
                        <input
                          type="number"
                          step="0.25"
                          placeholder="-0.00"
                          value={cylL}
                          onChange={(e) => setCylL(e.target.value)}
                          className="w-16 text-center border border-border rounded p-1 bg-background outline-none focus:border-accent text-xs"
                        />
                      </td>
                      <td className="px-1.5 py-1">
                        <input
                          type="number"
                          placeholder="0"
                          value={axisL}
                          onChange={(e) => setAxisL(e.target.value)}
                          className="w-16 text-center border border-border rounded p-1 bg-background outline-none focus:border-accent text-xs"
                        />
                      </td>
                      <td className="px-1.5 py-1">
                        <input
                          type="number"
                          step="0.25"
                          placeholder="+0.00"
                          value={addL}
                          onChange={(e) => setAddL(e.target.value)}
                          className="w-16 text-center border border-border rounded p-1 bg-background outline-none focus:border-accent text-xs"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex justify-start mb-4">
                <button
                  type="button"
                  onClick={() => {
                    setSphL(sphR);
                    setCylL(cylR);
                    setAxisL(axisR);
                    setAddL(addR);
                  }}
                  className="text-xs text-accent hover:underline flex items-center gap-1.5 font-medium bg-accent/5 px-3 py-1.5 rounded-lg border border-accent/15 transition-all hover:bg-accent/10"
                >
                  Copy Right Eye (OD) values to Left Eye (OS)
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Pupillary Distance (PD) mm
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="e.g. 63"
                    value={pd}
                    onChange={(e) => setPd(e.target.value)}
                    className="input-field py-1"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Optional Notes
                  </label>
                  <input
                    type="text"
                    placeholder="Doctor, date details, etc."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="input-field py-1"
                  />
                </div>
              </div>

              {/* DPDP Consent */}
              <div className="flex items-start gap-2 bg-muted/40 p-3 rounded-lg border border-border">
                <input
                  type="checkbox"
                  id="dpdp-consent-manual"
                  checked={dpdpConsent}
                  onChange={(e) => setDpdpConsent(e.target.checked)}
                  className="mt-0.5 rounded border-border text-accent focus:ring-accent"
                />
                <label
                  htmlFor="dpdp-consent-manual"
                  className="text-[10px] sm:text-xs text-muted-foreground leading-normal font-light"
                >
                  I explicitly consent to Kaanchwala securely processing and
                  storing my medical/prescription data in compliance with the
                  Digital Personal Data Protection (DPDP) Act.
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !dpdpConsent}
                className="btn-accent w-full py-2 whitespace-nowrap text-sm disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : "Save Prescription"}
              </button>
            </form>
          )}
        </div>
      )}

      {/* Prescription List */}
      {!prescriptions || prescriptions.length === 0 ? (
        <div className="text-center py-8 bg-muted/20 border border-border rounded-xl">
          <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
          <p className="text-sm text-muted-foreground font-light">
            No saved prescriptions found
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {prescriptions.map((rx) => (
            <div
              key={rx.id}
              className="border border-border rounded-xl p-4 bg-muted/10 hover:border-accent/40 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 border-b border-border pb-2 mb-3">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-light">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>
                      {format(new Date(rx.created_at), "dd MMM yyyy")}
                    </span>
                  </div>
                  <span
                    className={`badge text-[10px] uppercase font-semibold ${
                      rx.status === "approved"
                        ? "badge-success"
                        : rx.status === "rejected"
                          ? "badge-destructive"
                          : "badge-muted font-normal text-muted-foreground bg-muted"
                    }`}
                  >
                    {rx.status}
                  </span>
                </div>

                {rx.prescription_url ? (
                  <div className="flex items-center justify-between py-2 px-3 bg-surface border border-border rounded-lg mb-2">
                    <span className="text-xs font-medium text-foreground truncate max-w-45">
                      Uploaded Document
                    </span>
                    <a
                      href={rx.prescription_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline min-h-7.5 h-8 py-1 px-3 text-xs gap-1.5 hover:bg-muted whitespace-nowrap"
                    >
                      <Eye className="h-3 w-3" />
                      View File
                    </a>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-surface p-2 border border-border rounded-lg mb-2">
                    <div>
                      <p className="font-semibold border-b border-border pb-0.5 text-muted-foreground text-[10px] uppercase tracking-wide">
                        Right Eye (OD)
                      </p>
                      <p className="mt-1 font-light">
                        SPH:{" "}
                        <span className="font-medium">
                          {rx.sph_r !== null
                            ? rx.sph_r > 0
                              ? `+${rx.sph_r}`
                              : rx.sph_r
                            : "--"}
                        </span>
                      </p>
                      <p className="font-light">
                        CYL:{" "}
                        <span className="font-medium">
                          {rx.cyl_r !== null ? rx.cyl_r : "--"}
                        </span>
                      </p>
                      <p className="font-light">
                        Axis:{" "}
                        <span className="font-medium">
                          {rx.axis_r !== null ? `${rx.axis_r}°` : "--"}
                        </span>
                      </p>
                      <p className="font-light">
                        ADD:{" "}
                        <span className="font-medium">
                          {rx.add_r !== null ? `+${rx.add_r}` : "--"}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold border-b border-border pb-0.5 text-muted-foreground text-[10px] uppercase tracking-wide">
                        Left Eye (OS)
                      </p>
                      <p className="mt-1 font-light">
                        SPH:{" "}
                        <span className="font-medium">
                          {rx.sph_l !== null
                            ? rx.sph_l > 0
                              ? `+${rx.sph_l}`
                              : rx.sph_l
                            : "--"}
                        </span>
                      </p>
                      <p className="font-light">
                        CYL:{" "}
                        <span className="font-medium">
                          {rx.cyl_l !== null ? rx.cyl_l : "--"}
                        </span>
                      </p>
                      <p className="font-light">
                        Axis:{" "}
                        <span className="font-medium">
                          {rx.axis_l !== null ? `${rx.axis_l}°` : "--"}
                        </span>
                      </p>
                      <p className="font-light">
                        ADD:{" "}
                        <span className="font-medium">
                          {rx.add_l !== null ? `+${rx.add_l}` : "--"}
                        </span>
                      </p>
                    </div>
                    {rx.pd !== null && (
                      <div className="col-span-2 border-t border-border pt-1 mt-1 font-light text-[10px]">
                        Pupillary Distance (PD):{" "}
                        <span className="font-medium">{rx.pd} mm</span>
                      </div>
                    )}
                  </div>
                )}

                {rx.notes && (
                  <p className="text-[11px] text-muted-foreground font-light bg-muted/30 p-2 rounded border border-border/50 mb-2">
                    <span className="font-medium text-foreground block text-[10px] uppercase tracking-wider mb-0.5">
                      Notes:
                    </span>
                    {rx.notes}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
