import _package from "./package.json";
import type { AppMeta } from "@sln/types/App";


export const metadata = {
  name: "Giphy",
  description: _package.description,
  installed: true,
  categories: ["other"],
  logo: "icon.svg",
  publisher: "Cal.com",
  slug: "giphy",
  title: "Giphy",
  type: "giphy_other",
  url: "https://oskarhulter.com/apps/giphy",
  variant: "other",
  extendsFeature: "EventType",
  email: "help@oskarhulter.com",
  dirName: "giphy",
  isOAuth: false,
} as AppMeta;

export default metadata;
