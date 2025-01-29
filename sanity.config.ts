import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import schemas from "@/sanity/schemas";

export const config = defineConfig({
  projectId: "ti0ok6ge",
  dataset: "production",
  title: "Kaanchwala & Sons",
  apiVersion: "2024-12-19",
  basePath: "/admin",
  plugins: [structureTool()],
  schema: { types: schemas },
});
