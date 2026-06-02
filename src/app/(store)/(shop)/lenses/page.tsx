import type { Metadata } from "next";
import { LensConfigurator } from "./lens-configurator";

export const metadata: Metadata = {
  title: "Configure My Lenses",
  description:
    "Explore and choose from premium lens add-ons — prescription, photochromic, and blue-cut lenses — tailored to your lifestyle.",
};

export default async function ConfigureLensesPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const redirect = (await searchParams).redirect || "/products";
  return (
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <LensConfigurator redirect={redirect} />
      </div>
    </div>
  );
}
