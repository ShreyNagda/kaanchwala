"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LENS_ADD_ONS } from "@/lib/types";
import { Check, ChevronRight, ArrowLeft } from "lucide-react";
import { formatPrice } from "@/lib/utils";

// ─── Extended add-on data with visuals and details ───────────────────────────

interface LensAddOnDetail {
  id: string;
  name: string;
  price: number;
  tagline: string;
  description: string;
  benefits: string[];
  imageSrc: string;
  imageAlt: string;
  badgeLabel: string;
  idealFor: string[];
}

const PRESCRIPTION_OPTION: LensAddOnDetail = {
  id: "prescription",
  name: "Prescription Lenses",
  price: 0,
  tagline: "See the world with perfect clarity",
  description:
    "Get lenses crafted precisely to your prescription. Our opticians use your power values to grind lenses that correct your vision — whether you're near-sighted, far-sighted, or have astigmatism.",
  benefits: [
    "Custom ground to your exact eye power",
    "Eliminates blur and eye strain",
    "Works for near-sight, far-sight & astigmatism",
    "Submit prescription during checkout",
  ],
  imageSrc: "/images/prescription-lens.png",
  imageAlt: "Prescription lens correction diagram",
  badgeLabel: "Most Popular",
  idealFor: ["Students", "Office Workers", "Readers", "Drivers"],
};

const LENS_DETAIL_MAP: Record<string, LensAddOnDetail> = {
  "Blue-Cut Lens": {
    id: "blue-cut",
    name: "Blue-Cut Lenses",
    price: LENS_ADD_ONS.find((a) => a.name === "Blue-Cut Lens")!.price,
    tagline: "Shield your eyes from digital strain",
    description:
      "Blue-cut lenses filter out the high-energy blue light emitted by screens — phones, laptops, tablets. By blocking this wavelength, they significantly reduce digital eye strain, improve sleep quality, and protect long-term retinal health.",
    benefits: [
      "Filters up to 40% of harmful blue light",
      "Reduces eye fatigue after screen time",
      "Helps maintain healthier sleep cycles",
      "Anti-reflective coating included",
    ],
    imageSrc: "/images/bluecut-lens.png",
    imageAlt: "Blue-cut lens blocking blue light diagram",
    badgeLabel: "For Screen Users",
    idealFor: ["Developers", "Designers", "Gamers", "Remote Workers"],
  },
  "Photochromic Lens": {
    id: "photochromic",
    name: "Photochromic Lenses",
    price: LENS_ADD_ONS.find((a) => a.name === "Photochromic Lens")!.price,
    tagline: "One pair. Every light. Always perfect.",
    description:
      "Photochromic lenses automatically darken when exposed to UV rays outdoors and return to clear inside — all within seconds. You get a single pair of glasses that seamlessly adapts to any environment, eliminating the need to switch between glasses and sunglasses.",
    benefits: [
      "Transitions in seconds outdoors and indoors",
      "Blocks 100% of UVA & UVB rays",
      "No need for a separate pair of sunglasses",
      "Available in all prescription strengths",
    ],
    imageSrc: "/images/photochromic-lens.png",
    imageAlt: "Photochromic lens transition indoor to outdoor diagram",
    badgeLabel: "Best Value",
    idealFor: ["Commuters", "Travellers", "Outdoor Enthusiasts", "Cyclists"],
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

export function LensConfigurator({ redirect }: { redirect: string }) {
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [wantsPrescription, setWantsPrescription] = useState(false);
  const [activeCard, setActiveCard] = useState<string | null>(null);

  const toggleAddOn = (name: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name],
    );
  };

  const selectedTotal = LENS_ADD_ONS.filter((a) =>
    selectedAddOns.includes(a.name),
  ).reduce((sum, a) => sum + a.price, 0);

  return (
    <div>
      {/* Back link */}
      <Link
        href={redirect}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Link>

      {/* Header */}
      <div className="mb-12 max-w-2xl">
        <p className="text-sm font-semibold text-accent uppercase tracking-widest mb-3">
          Lens Options
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 leading-tight">
          Configure Your Lenses
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Every pair of eyes is different. Choose the lens add-ons that match
          your lifestyle — we&apos;ll build them into your frames with
          precision.
        </p>
      </div>

      {/* Option Cards */}
      <div className="space-y-4 mb-12">
        {/* Prescription Option */}
        <LensOptionCard
          option={PRESCRIPTION_OPTION}
          isSelected={wantsPrescription}
          isActive={activeCard === "prescription"}
          onToggle={() => setWantsPrescription((v) => !v)}
          onExpand={() =>
            setActiveCard(activeCard === "prescription" ? null : "prescription")
          }
          isFree
        />

        {/* Add-on Options */}
        {LENS_ADD_ONS.map((addOn) => {
          const detail = LENS_DETAIL_MAP[addOn.name];
          if (!detail) return null;
          return (
            <LensOptionCard
              key={addOn.name}
              option={detail}
              isSelected={selectedAddOns.includes(addOn.name)}
              isActive={activeCard === detail.id}
              onToggle={() => toggleAddOn(addOn.name)}
              onExpand={() =>
                setActiveCard(activeCard === detail.id ? null : detail.id)
              }
            />
          );
        })}
      </div>

      {/* Summary strip */}
      <div
        className="sticky bottom-6 rounded-xl border border-border bg-surface p-5"
        style={{ boxShadow: "var(--shadow-elevated)" }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Selected summary */}
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground mb-1.5">
              Your Lens Selection
            </p>
            <div className="flex flex-wrap gap-2">
              {wantsPrescription && (
                <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md border border-border text-foreground">
                  <Check className="h-3 w-3" />
                  Prescription
                </span>
              )}
              {selectedAddOns.map((name) => (
                <span
                  key={name}
                  className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md border border-border text-foreground"
                >
                  <Check className="h-3 w-3" />
                  {name}
                </span>
              ))}
              {!wantsPrescription && selectedAddOns.length === 0 && (
                <span className="text-sm text-muted-foreground">
                  No options selected yet
                </span>
              )}
            </div>
          </div>

          {/* Total + CTA */}
          <div className="flex items-center gap-4 shrink-0">
            {selectedTotal > 0 && (
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Add-ons total</p>
                <p className="text-xl font-bold text-foreground">
                  + {formatPrice(selectedTotal)}
                </p>
              </div>
            )}
            <Link
              href="/products"
              className="btn-primary gap-2"
              id="shop-with-lenses-cta"
            >
              Shop Frames
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Card Component ───────────────────────────────────────────────────────────

interface LensOptionCardProps {
  option: LensAddOnDetail;
  isSelected: boolean;
  isActive: boolean;
  onToggle: () => void;
  onExpand: () => void;
  isFree?: boolean;
}

function LensOptionCard({
  option,
  isSelected,
  isActive,
  onToggle,
  onExpand,
  isFree = false,
}: LensOptionCardProps) {
  return (
    <div
      className="rounded-xl border overflow-hidden transition-all duration-200"
      style={{
        borderColor: isSelected
          ? "var(--color-foreground)"
          : "var(--color-border)",
        background: "var(--color-surface)",
        boxShadow: isSelected ? "var(--shadow-elevated)" : "var(--shadow-card)",
      }}
    >
      {/* Card header — always visible */}
      <div className="p-5 sm:p-6">
        <div className="flex items-start gap-4">
          {/* Text */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h2 className="text-base font-semibold text-foreground">
                {option.name}
              </h2>
              <span className="badge badge-muted text-xs">
                {option.badgeLabel}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{option.tagline}</p>
          </div>

          {/* Price + Checkbox */}
          <div className="flex flex-col items-end gap-3 shrink-0">
            <p className="text-sm font-medium text-foreground">
              {isFree || option.price === 0 ? (
                <span className="text-muted-foreground">Included</span>
              ) : (
                `+ ${formatPrice(option.price)}`
              )}
            </p>
            <button
              onClick={onToggle}
              aria-label={`${isSelected ? "Remove" : "Add"} ${option.name}`}
              className="h-5 w-5 rounded border-2 flex items-center justify-center transition-all"
              style={{
                borderColor: isSelected
                  ? "var(--color-foreground)"
                  : "var(--color-border)",
                background: isSelected
                  ? "var(--color-foreground)"
                  : "transparent",
              }}
            >
              {isSelected && <Check className="h-3 w-3 text-background" />}
            </button>
          </div>
        </div>

        {/* Expand button */}
        <button
          onClick={onExpand}
          className="mt-3.5 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          id={`expand-${option.id}`}
        >
          {isActive ? "Hide details" : "Learn more"}
          <ChevronRight
            className="h-3.5 w-3.5 transition-transform duration-200"
            style={{ transform: isActive ? "rotate(90deg)" : "rotate(0deg)" }}
          />
        </button>
      </div>

      {/* Expanded panel */}
      {isActive && (
        <div className="border-t border-border px-5 sm:px-6 pt-6 pb-7 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Visual */}
          <div className="relative rounded-lg overflow-hidden bg-muted flex items-center justify-center min-h-50">
            <Image
              src={option.imageSrc}
              alt={option.imageAlt}
              width={480}
              height={280}
              className="object-contain w-full"
              style={{ maxHeight: "260px" }}
            />
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center gap-5">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {option.description}
            </p>

            {/* Benefits */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Key Benefits
              </p>
              <ul className="space-y-2">
                {option.benefits.map((b) => (
                  <li key={b} className="flex items-start gap-2.5">
                    <Check className="h-3.5 w-3.5 mt-0.5 shrink-0 text-foreground" />
                    <span className="text-sm text-foreground">{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Ideal For */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Ideal For
              </p>
              <div className="flex flex-wrap gap-2">
                {option.idealFor.map((tag) => (
                  <span key={tag} className="badge badge-muted text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={onToggle}
              className={
                isSelected ? "btn-ghost self-start" : "btn-primary self-start"
              }
              id={`select-${option.id}-cta`}
            >
              {isSelected ? (
                <>
                  <Check className="h-4 w-4 mr-1.5" /> Added
                </>
              ) : option.price === 0 ? (
                "Enable This Option"
              ) : (
                `Add for + ${formatPrice(option.price)}`
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
