import _package from "./package.json";
import type { App } from "@sln/types/App";


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
  email: "help@oskarhulter.com",
  dirName: "caldavcalendar",
} as App;

export * as api from "./api";
export * as lib from "./lib";
