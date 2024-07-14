import { refreshCredential } from "./refreshCredential";
import type { CredentialPayload } from "@sln/types/Credential";
import async from "async";

/**
 * Refreshes the given set of credentials.
 *
 * @param credentials
 */
export async function refreshCredentials(
  credentials: Array<CredentialPayload>
): Promise<Array<CredentialPayload>> {
  return await async.mapLimit(credentials, 5, refreshCredential);
}
