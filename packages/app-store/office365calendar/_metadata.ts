import _package from "./package.json";
import type { AppMeta } from "@sln/types/App";


export const metadata = {
  name: "Outlook Calendar",
  description: _package.description,
  type: "office365_calendar",
  title: "Outlook Calendar",
  variant: "calendar",
  category: "calendar",
  categories: ["calendar"],
  logo: "icon.svg",
  publisher: "Cal.com",
  slug: "office365-calendar",
  dirName: "office365calendar",
  url: "https://oskarhulter.com/",
  email: "help@oskarhulter.com",
  isOAuth: true,
} as AppMeta;

export default metadata;
