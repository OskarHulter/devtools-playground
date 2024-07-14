import _package from "./package.json";
import { validJson } from "@sln/lib/jsonUtils";
import type { AppMeta } from "@sln/types/App";


export const metadata = {
  name: "Google Calendar",
  description: _package.description,
  installed: !!(
    process.env.GOOGLE_API_CREDENTIALS &&
    validJson(process.env.GOOGLE_API_CREDENTIALS)
  ),
  type: "google_calendar",
  title: "Google Calendar",
  variant: "calendar",
  category: "calendar",
  categories: ["calendar"],
  logo: "icon.svg",
  publisher: "Cal.com",
  slug: "google-calendar",
  url: "https://oskarhulter.com/",
  email: "help@oskarhulter.com",
  dirName: "googlecalendar",
  isOAuth: true,
} as AppMeta;

export default metadata;
