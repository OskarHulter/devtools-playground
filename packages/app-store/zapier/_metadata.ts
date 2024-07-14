import _package from "./package.json";
import type { AppMeta } from "@sln/types/App";


export const metadata = {
  name: "Zapier",
  description: _package.description,
  installed: true,
  category: "automation",
  categories: ["automation"],
  logo: "icon.svg",
  publisher: "Cal.com",
  slug: "zapier",
  title: "Zapier",
  type: "zapier_automation",
  url: "https://oskarhulter.com/apps/zapier",
  variant: "automation",
  email: "help@oskarhulter.com",
  dirName: "zapier",
  isOAuth: false,
} as AppMeta;

export default metadata;
