"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Edit2, Save, X, FileText } from "lucide-react";
import { updatePrescriptionData } from "@/lib/actions/admin";
import { useRouter } from "next/navigation";

interface PrescriptionDataEditorProps {
  prescription: {
    id: string;
    sph_r: number | null;
    cyl_r: number | null;
    axis_r: number | null;
    add_r: number | null;
    sph_l: number | null;
    cyl_l: number | null;
    axis_l: number | null;
    add_l: number | null;
    pd: number | null;
    notes: string | null;
  };
}

export function PrescriptionDataEditor({
  prescription,
}: PrescriptionDataEditorProps) {
  const router = useRouter();

  // Determine if we should start in edit mode (if all optical values are empty)
  const isAllEmpty =
    prescription.sph_r === null &&
    prescription.cyl_r === null &&
    prescription.axis_r === null &&
    prescription.add_r === null &&
    prescription.sph_l === null &&
    prescription.cyl_l === null &&
    prescription.axis_l === null &&
    prescription.add_l === null &&
    prescription.pd === null;

  const [isEditing, setIsEditing] = useState(isAllEmpty);
  const [isSaving, setIsSaving] = useState(false);

  // Form states
  const [sphR, setSphR] = useState(
    prescription.sph_r !== null ? prescription.sph_r.toString() : "",
  );
  const [cylR, setCylR] = useState(
    prescription.cyl_r !== null ? prescription.cyl_r.toString() : "",
  );
  const [axisR, setAxisR] = useState(
    prescription.axis_r !== null ? prescription.axis_r.toString() : "",
  );
  const [addR, setAddR] = useState(
    prescription.add_r !== null ? prescription.add_r.toString() : "",
  );

  const [sphL, setSphL] = useState(
    prescription.sph_l !== null ? prescription.sph_l.toString() : "",
  );
  const [cylL, setCylL] = useState(
    prescription.cyl_l !== null ? prescription.cyl_l.toString() : "",
  );
  const [axisL, setAxisL] = useState(
    prescription.axis_l !== null ? prescription.axis_l.toString() : "",
  );
  const [addL, setAddL] = useState(
    prescription.add_l !== null ? prescription.add_l.toString() : "",
  );

  const [pd, setPd] = useState(
    prescription.pd !== null ? prescription.pd.toString() : "",
  );
  const [notes, setNotes] = useState(prescription.notes || "");

  const handleCancel = () => {
    setSphR(prescription.sph_r !== null ? prescription.sph_r.toString() : "");
    setCylR(prescription.cyl_r !== null ? prescription.cyl_r.toString() : "");
    setAxisR(
      prescription.axis_r !== null ? prescription.axis_r.toString() : "",
    );
    setAddR(prescription.add_r !== null ? prescription.add_r.toString() : "");

    setSphL(prescription.sph_l !== null ? prescription.sph_l.toString() : "");
    setCylL(prescription.cyl_l !== null ? prescription.cyl_l.toString() : "");
    setAxisL(
      prescription.axis_l !== null ? prescription.axis_l.toString() : "",
    );
    setAddL(prescription.add_l !== null ? prescription.add_l.toString() : "");

    setPd(prescription.pd !== null ? prescription.pd.toString() : "");
    setNotes(prescription.notes || "");
    setIsEditing(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const data = {
      sph_r: sphR ? parseFloat(sphR) : null,
      cyl_r: cylR ? parseFloat(cylR) : null,
      axis_r: axisR ? parseInt(axisR) : null,
      add_r: addR ? parseFloat(addR) : null,
      sph_l: sphL ? parseFloat(sphL) : null,
      cyl_l: cylL ? parseFloat(cylL) : null,
      axis_l: axisL ? parseInt(axisL) : null,
      add_l: addL ? parseFloat(addL) : null,
      pd: pd ? parseFloat(pd) : null,
      notes: notes || null,
    };

    const res = await updatePrescriptionData(prescription.id, data);
    setIsSaving(false);

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Optical configuration updated successfully!");
      setIsEditing(false);
      router.refresh();
    }
  };

  if (isEditing) {
    return (
      <form onSubmit={handleSave} className="space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <span className="text-xs font-semibold text-accent uppercase tracking-wider">
            Edit Parameters
          </span>
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSaving}
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5"
          >
            <X className="h-3 w-3" />
            Cancel
          </button>
        </div>

        {/* Editing Grid/Table */}
        <div className="overflow-x-auto border border-border rounded-xl bg-surface">
          <table className="min-w-full divide-y divide-border text-center text-sm">
            <thead>
              <tr className="bg-muted/40">
                <th className="px-4 py-2 font-medium text-muted-foreground text-xs">
                  Eye
                </th>
                <th className="px-4 py-2 font-medium text-muted-foreground text-xs">
                  SPH
                </th>
                <th className="px-4 py-2 font-medium text-muted-foreground text-xs">
                  CYL
                </th>
                <th className="px-4 py-2 font-medium text-muted-foreground text-xs">
                  Axis
                </th>
                <th className="px-4 py-2 font-medium text-muted-foreground text-xs">
                  ADD
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {/* Right Eye */}
              <tr>
                <td className="px-4 py-3 font-semibold text-foreground text-xs">
                  Right (OD)
                </td>
                <td className="px-2 py-2">
                  <input
                    type="number"
                    step="0.25"
                    placeholder="-0.00"
                    value={sphR}
                    onChange={(e) => setSphR(e.target.value)}
                    className="w-20 text-center border border-border rounded p-1 bg-background outline-none focus:border-accent text-xs"
                  />
                </td>
                <td className="px-2 py-2">
                  <input
                    type="number"
                    step="0.25"
                    placeholder="-0.00"
                    value={cylR}
                    onChange={(e) => setCylR(e.target.value)}
                    className="w-20 text-center border border-border rounded p-1 bg-background outline-none focus:border-accent text-xs"
                  />
                </td>
                <td className="px-2 py-2">
                  <input
                    type="number"
                    placeholder="0"
                    value={axisR}
                    onChange={(e) => setAxisR(e.target.value)}
                    className="w-20 text-center border border-border rounded p-1 bg-background outline-none focus:border-accent text-xs"
                  />
                </td>
                <td className="px-2 py-2">
                  <input
                    type="number"
                    step="0.25"
                    placeholder="+0.00"
                    value={addR}
                    onChange={(e) => setAddR(e.target.value)}
                    className="w-20 text-center border border-border rounded p-1 bg-background outline-none focus:border-accent text-xs"
                  />
                </td>
              </tr>
              {/* Left Eye */}
              <tr>
                <td className="px-4 py-3 font-semibold text-foreground text-xs">
                  Left (OS)
                </td>
                <td className="px-2 py-2">
                  <input
                    type="number"
                    step="0.25"
                    placeholder="-0.00"
                    value={sphL}
                    onChange={(e) => setSphL(e.target.value)}
                    className="w-20 text-center border border-border rounded p-1 bg-background outline-none focus:border-accent text-xs"
                  />
                </td>
                <td className="px-2 py-2">
                  <input
                    type="number"
                    step="0.25"
                    placeholder="-0.00"
                    value={cylL}
                    onChange={(e) => setCylL(e.target.value)}
                    className="w-20 text-center border border-border rounded p-1 bg-background outline-none focus:border-accent text-xs"
                  />
                </td>
                <td className="px-2 py-2">
                  <input
                    type="number"
                    placeholder="0"
                    value={axisL}
                    onChange={(e) => setAxisL(e.target.value)}
                    className="w-20 text-center border border-border rounded p-1 bg-background outline-none focus:border-accent text-xs"
                  />
                </td>
                <td className="px-2 py-2">
                  <input
                    type="number"
                    step="0.25"
                    placeholder="+0.00"
                    value={addL}
                    onChange={(e) => setAddL(e.target.value)}
                    className="w-20 text-center border border-border rounded p-1 bg-background outline-none focus:border-accent text-xs"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex justify-start">
          <button
            type="button"
            onClick={() => {
              setSphL(sphR);
              setCylL(cylR);
              setAxisL(axisR);
              setAddL(addR);
            }}
            className="text-xs text-accent hover:underline flex items-center gap-1.5 font-semibold bg-accent/5 px-3 py-1.5 rounded-lg border border-accent/15 transition-all hover:bg-accent/10"
          >
            Copy Right Eye (OD) values to Left Eye (OS)
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-muted/20 border border-border rounded-xl">
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Pupillary Distance (PD) mm
            </label>
            <input
              type="number"
              step="0.5"
              placeholder="e.g. 63"
              value={pd}
              onChange={(e) => setPd(e.target.value)}
              className="w-full max-w-xs border border-border rounded p-2 bg-background outline-none focus:border-accent text-xs"
            />
          </div>
          <div className="p-4 bg-muted/20 border border-border rounded-xl">
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Prescription Notes / Remarks
            </label>
            <textarea
              placeholder="Add doctor details, special instructions, etc."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full border border-border rounded p-2 bg-background outline-none focus:border-accent text-xs resize-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSaving}
            className="btn-outline px-4 py-2 text-xs font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="btn-accent px-4 py-2 text-xs font-semibold flex items-center gap-1.5"
          >
            <Save className="h-4 w-4" />
            {isSaving ? "Saving..." : "Save Parameters"}
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Optical Values
        </span>
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="text-xs text-accent hover:underline flex items-center gap-1.5 font-semibold"
        >
          <Edit2 className="h-3.5 w-3.5" />
          Enter / Edit Parameters
        </button>
      </div>

      {isAllEmpty ? (
        <div className="text-center py-8 bg-muted/10 border border-dashed border-border rounded-xl">
          <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
          <p className="text-sm text-muted-foreground font-light">
            No optical configuration entered yet. Click the button above to
            enter values.
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto border border-border rounded-xl">
            <table className="min-w-full divide-y divide-border text-center text-sm">
              <thead>
                <tr className="bg-muted/40">
                  <th className="px-4 py-2.5 font-medium text-muted-foreground">
                    Eye
                  </th>
                  <th className="px-4 py-2.5 font-medium text-muted-foreground">
                    SPH
                  </th>
                  <th className="px-4 py-2.5 font-medium text-muted-foreground">
                    CYL
                  </th>
                  <th className="px-4 py-2.5 font-medium text-muted-foreground">
                    Axis
                  </th>
                  <th className="px-4 py-2.5 font-medium text-muted-foreground">
                    ADD
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr className="hover:bg-muted/10 transition-colors">
                  <td className="px-4 py-3 font-semibold text-foreground">
                    Right (OD)
                  </td>
                  <td className="px-4 py-3">
                    {prescription.sph_r !== null
                      ? prescription.sph_r > 0
                        ? `+${prescription.sph_r}`
                        : prescription.sph_r
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    {prescription.cyl_r !== null ? prescription.cyl_r : "—"}
                  </td>
                  <td className="px-4 py-3">
                    {prescription.axis_r !== null
                      ? `${prescription.axis_r}°`
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    {prescription.add_r !== null
                      ? `+${prescription.add_r}`
                      : "—"}
                  </td>
                </tr>
                <tr className="hover:bg-muted/10 transition-colors">
                  <td className="px-4 py-3 font-semibold text-foreground">
                    Left (OS)
                  </td>
                  <td className="px-4 py-3">
                    {prescription.sph_l !== null
                      ? prescription.sph_l > 0
                        ? `+${prescription.sph_l}`
                        : prescription.sph_l
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    {prescription.cyl_l !== null ? prescription.cyl_l : "—"}
                  </td>
                  <td className="px-4 py-3">
                    {prescription.axis_l !== null
                      ? `${prescription.axis_l}°`
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    {prescription.add_l !== null
                      ? `+${prescription.add_l}`
                      : "—"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-muted/20 border border-border rounded-xl">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1">
                Pupillary Distance (PD)
              </span>
              <span className="text-base font-semibold">
                {prescription.pd !== null
                  ? `${prescription.pd} mm`
                  : "Not provided"}
              </span>
            </div>
            {prescription.notes && (
              <div className="p-4 bg-muted/20 border border-border rounded-xl space-y-1 col-span-1 md:col-span-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider block">
                  Prescription Notes / Remarks
                </span>
                <p className="text-sm italic text-foreground leading-normal">
                  {prescription.notes}
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
