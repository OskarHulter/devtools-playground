import CalendarService from "@sln/lib/CalendarService";
import type { CredentialPayload } from "@sln/types/Credential";

export default class AppleCalendarService extends CalendarService {
  constructor(credential: CredentialPayload) {
    super(credential, "apple_calendar", "https://caldav.icloud.com");
  }
}
