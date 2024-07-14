import _package from "./package.json";
import type { AppMeta } from "@sln/types/App";

export const metadata = {
  name: "Feishu Calendar",
  description: _package.description,
  installed: true,
  type: "feishu_calendar",
  title: "Feishu Calendar",
  variant: "calendar",
  categories: ["calendar"],
  logo: "icon.svg",
  publisher: "Feishu",
  slug: "feishu-calendar",
  url: "https://feishu.cn/",
  email: "alan@larksuite.com",
  dirName: "feishucalendar",
} as AppMeta;

export default metadata;
