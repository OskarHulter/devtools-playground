import type { AppFrontendPayload as App } from "@sln/types/App";


export const _SBApps: App[] = [
  {
    name: "Google Calendar",
    description: "Google Calendar",
    installed: true,
    type: "google_calendar",
    title: "Google Calendar",
    variant: "calendar",
    category: "calendar",
    categories: ["calendar"],
    logo: "/api/app-store/googlecalendar/icon.svg",
    publisher: "Cal.com",
    slug: "google-calendar",
    url: "https://oskarhulter.com/",
    email: "help@oskarhulter.com",
    dirName: "googlecalendar",
  },
  {
    name: "Zoom Video",
    description: "Zoom Video",
    type: "zoom_video",
    categories: ["video"],
    variant: "conferencing",
    logo: "/api/app-store/zoomvideo/icon.svg",
    publisher: "Cal.com",
    url: "https://zoom.us/",
    category: "video",
    slug: "zoom",
    title: "Zoom Video",
    email: "help@oskarhulter.com",
    appData: {
      location: {
        default: false,
        linkType: "dynamic",
        type: "integrations:zoom",
        label: "Zoom Video",
      },
    },
    dirName: "zoomvideo",
  },
];

export const _SBAppCategoryList = [
  {
    name: "Calendar",
    count: 1,
  },
  {
    name: "Video",
    count: 5,
  },
];
