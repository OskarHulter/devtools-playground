import _package from "./package.json";
import type { AppMeta } from "@sln/types/App";

export const metadata = {
  name: "Vital",
  description: _package.description,
  installed: true,
  category: "automation",
  categories: ["automation"],
  logo: "icon-dark.svg",
  label: "Vital",
  publisher: "Vital",
  slug: "vital-automation",
  title: "Vital",
  type: "vital_other",
  url: "https://tryvital.io",
  variant: "other",
  email: "support@tryvital.io",
  dirName: "vital",
  isOAuth: true,
} as AppMeta;

export default metadata;
