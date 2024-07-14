import _package from "./package.json";
import type { AppMeta } from "@sln/types/App";


export const metadata = {
  name: "CalDav (Beta)",
  description: _package.description,
  installed: true,
  type: "caldav_calendar",
  title: "CalDav (Beta)",
  variant: "calendar",
  category: "calendar",
  categories: ["calendar"],
  logo: "icon.svg",
  publisher: "Cal.com",
  slug: "caldav-calendar",
  url: "https://oskarhulter.com/",
  email: "ali@oskarhulter.com",
  dirName: "caldavcalendar",
  isOAuth: false,
} as AppMeta;

export default metadata;
