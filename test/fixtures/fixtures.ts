// my-test.ts
import { test as base } from "vitest";

import { getTestEmails } from "@sln/lib/testEmails";
import { getTestSMS } from "@sln/lib/testSMS";

export interface Fixtures {
	emails: ReturnType<typeof getEmailsFixture>;
	sms: ReturnType<typeof getSMSFixture>;
}

export const test = base.extend<Fixtures>({
	emails: async ({}, use) => {
		await use(getEmailsFixture());
	},
	sms: async ({}, use) => {
		await use(getSMSFixture());
	},
});

function getEmailsFixture() {
	return {
		get: getTestEmails,
	};
}

function getSMSFixture() {
	return {
		get: getTestSMS,
	};
}
