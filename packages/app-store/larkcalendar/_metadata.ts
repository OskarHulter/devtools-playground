import _package from "./package.json";
import type { AppMeta } from "@sln/types/App";

export const metadata = {
  name: "Lark Calendar",
  description: _package.description,
  installed: true,
  type: "lark_calendar",
  title: "Lark Calendar",
  variant: "calendar",
  categories: ["calendar"],
  logo: "icon.svg",
  publisher: "Lark",
  slug: "lark-calendar",
  url: "https://larksuite.com/",
  email: "alan@larksuite.com",
  dirName: "larkcalendar",
  isOAuth: true,
} as AppMeta;

export default metadata;
