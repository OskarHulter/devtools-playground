import CalendarService from "@sln/lib/CalendarService";
import type { CredentialPayload } from "@sln/types/Credential";

export default class CalDavCalendarService extends CalendarService {
  constructor(credential: CredentialPayload) {
    super(credential, "caldav_calendar");
  }
}
