import _package from "./package.json";
import type { AppMeta } from "@sln/types/App";


export const metadata = {
  name: _package.name,
  description: _package.description,
  installed: true,
  category: "automation",
  categories: ["automation"],
  // If using static next public folder, can then be referenced from the base URL (/).
  logo: "icon-dark.svg",
  publisher: "Cal.com",
  slug: "wipe-my-cal",
  title: "Wipe my cal",
  type: "wipemycal_other",
  url: "https://oskarhulter.com/apps/wipe-my-cal",
  variant: "other",
  email: "help@oskarhulter.com",
  dirName: "wipemycalother",
  isOAuth: false,
} as AppMeta;

export default metadata;
