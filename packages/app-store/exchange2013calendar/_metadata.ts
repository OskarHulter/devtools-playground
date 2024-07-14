import _package from "./package.json";
import type { AppMeta } from "@sln/types/App";


export const metadata = {
  name: "Microsoft Exchange 2013 Calendar",
  description: _package.description,
  installed: true,
  type: "exchange2013_calendar",
  title: "Microsoft Exchange 2013 Calendar",
  variant: "calendar",
  category: "calendar",
  categories: ["calendar"],
  label: "Exchange Calendar",
  logo: "icon.svg",
  publisher: "Cal.com",
  slug: "exchange2013-calendar",
  url: "https://oskarhulter.com/",
  email: "help@oskarhulter.com",
  dirName: "exchange2013calendar",
  isOAuth: false,
} as AppMeta;

export default metadata;
