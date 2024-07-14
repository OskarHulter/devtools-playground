import _package from "./package.json";
import type { AppMeta } from "@sln/types/App";


export const metadata = {
  name: "HubSpot CRM",
  installed: !!process.env.HUBSPOT_CLIENT_ID,
  description: _package.description,
  type: "hubspot_crm",
  variant: "crm",
  logo: "icon.svg",
  publisher: "Cal.com",
  url: "https://hubspot.com/",
  categories: ["crm"],
  label: "HubSpot CRM",
  slug: "hubspot",
  extendsFeature: "EventType",
  title: "HubSpot CRM",
  email: "help@oskarhulter.com",
  dirName: "hubspot",
  isOAuth: true,
} as AppMeta;

export default metadata;
