import _package from "./package.json";
import type { AppMeta } from "@sln/types/App";


export const metadata = {
  name: "Apple Calendar",
  description: _package.description,
  installed: true,
  type: "apple_calendar",
  title: "Apple Calendar",
  variant: "calendar",
  categories: ["calendar"],
  category: "calendar",
  logo: "icon.svg",
  publisher: "Cal.com",
  slug: "apple-calendar",
  url: "https://oskarhulter.com/",
  email: "help@oskarhulter.com",
  dirName: "applecalendar",
  isOAuth: false,
} as AppMeta;

export default metadata;
