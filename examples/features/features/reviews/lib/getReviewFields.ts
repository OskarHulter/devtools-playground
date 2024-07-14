import type {
	EventTypeCustomInput,
	EventType,
	Prisma,
	Workflow,
} from "@prisma/client";
import type { z } from "zod";

import { SMS_REMINDER_NUMBER_FIELD } from "@sln/features/Reviews/lib/SystemField";
import { fieldsThatSupportLabelAsSafeHtml } from "@sln/features/form-builder/fieldsThatSupportLabelAsSafeHtml";
import { getFieldIdentifier } from "@sln/features/form-builder/utils/getFieldIdentifier";
import { markdownToSafeHTML } from "@sln/lib/markdownToSafeHTML";
import slugify from "@sln/lib/slugify";
import { EventTypeCustomInputType } from "@sln/prisma/enums";
import {
	ReviewFieldTypeEnum,
	customInputSchema,
	type reviewFields,
	EventTypeMetaDataSchema,
} from "@sln/prisma/zod-utils";

type Fields = z.infer<typeof reviewFields>;

if (typeof window !== "undefined") {
	// This file imports some costly dependencies, so we want to make sure it's not imported on the client side.
	throw new Error("`reviewFields` must not be imported on the client side.");
}

/**
 * PHONE -> Phone
 */
function upperCaseToCamelCase(upperCaseString: string) {
	return (
		upperCaseString[0].toUpperCase() + upperCaseString.slice(1).toLowerCase()
	);
}

export const getSmsReminderNumberField = () =>
	({
		name: SMS_REMINDER_NUMBER_FIELD,
		type: "phone",
		defaultLabel: "number_text_notifications",
		defaultPlaceholder: "enter_phone_number",
		editable: "system",
	}) as const;

export const getSmsReminderNumberSource = ({
	workflowId,
	isSmsReminderNumberRequired,
}: {
	workflowId: Workflow["id"];
	isSmsReminderNumberRequired: boolean;
}) => ({
	id: `${workflowId}`,
	type: "workflow",
	label: "Workflow",
	fieldRequired: isSmsReminderNumberRequired,
	editUrl: `/workflows/${workflowId}`,
});

/**
 * This fn is the key to ensure on the fly mapping of customInputs to reviewFields and ensuring that all the systems fields are present and correctly ordered in reviewFields
 */
export const reviewFieldsWithSystemFields = ({
	reviewFields,
	disableGuests,
	disableReviewTitle,
	customInputs,
	metadata,
	workflows,
}: {
	reviewFields: Fields | EventType["reviewFields"];
	disableGuests: boolean;
	disableReviewTitle?: boolean;
	customInputs: EventTypeCustomInput[] | z.infer<typeof customInputSchema>[];
	metadata: EventType["metadata"] | z.infer<typeof EventTypeMetaDataSchema>;
	workflows: Prisma.EventTypeGetPayload<{
		select: {
			workflows: {
				select: {
					workflow: {
						select: {
							id: true;
							steps: true;
						};
					};
				};
			};
		};
	}>["workflows"];
}) => {
	const parsedMetaData = EventTypeMetaDataSchema.parse(metadata || {});
	const reviewFields = reviewFields.parse(reviewFields || []);
	const parsedCustomInputs = customInputSchema
		.array()
		.parse(customInputs || []);
	workflows = workflows || [];
	return ensureReviewInputsHaveSystemFields({
		reviewFields: reviewFields,
		disableGuests,
		disableReviewTitle,
		additionalNotesRequired: parsedMetaData?.additionalNotesRequired || false,
		customInputs: parsedCustomInputs,
		workflows,
	});
};

export const ensureReviewInputsHaveSystemFields = ({
	reviewFields,
	disableGuests,
	disableReviewTitle,
	additionalNotesRequired,
	customInputs,
	workflows,
}: {
	reviewFields: Fields;
	disableGuests: boolean;
	disableReviewTitle?: boolean;
	additionalNotesRequired: boolean;
	customInputs: z.infer<typeof customInputSchema>[];
	workflows: Prisma.EventTypeGetPayload<{
		select: {
			workflows: {
				select: {
					workflow: {
						select: {
							id: true;
							steps: true;
						};
					};
				};
			};
		};
	}>["workflows"];
}) => {
	// If reviewFields is set already, the migration is done.
	const hideReviewTitle = disableReviewTitle ?? true;
	const handleMigration = !reviewFields.length;
	const CustomInputTypeToFieldType = {
		[EventTypeCustomInputType.TEXT]: ReviewFieldTypeEnum.text,
		[EventTypeCustomInputType.TEXTLONG]: ReviewFieldTypeEnum.textarea,
		[EventTypeCustomInputType.NUMBER]: ReviewFieldTypeEnum.number,
		[EventTypeCustomInputType.BOOL]: ReviewFieldTypeEnum.boolean,
		[EventTypeCustomInputType.RADIO]: ReviewFieldTypeEnum.radio,
		[EventTypeCustomInputType.PHONE]: ReviewFieldTypeEnum.phone,
	};

	const smsNumberSources = [] as NonNullable<
		(typeof reviewFields)[number]["sources"]
	>;
	workflows.forEach((workflow) => {
		workflow.workflow.steps.forEach((step) => {
			if (
				step.action === "SMS_ATTENDEE" ||
				step.action === "WHATSAPP_ATTENDEE"
			) {
				const workflowId = workflow.workflow.id;
				smsNumberSources.push(
					getSmsReminderNumberSource({
						workflowId,
						isSmsReminderNumberRequired: !!step.numberRequired,
					}),
				);
			}
		});
	});

	// These fields should be added before other user fields
	const systemBeforeFields: typeof reviewFields = [
		{
			type: "name",
			// This is the `name` of the main field
			name: "name",
			editable: "system",
			// This Label is used in Email only as of now.
			defaultLabel: "your_name",
			required: true,
			sources: [
				{
					label: "Default",
					id: "default",
					type: "default",
				},
			],
		},
		{
			defaultLabel: "email_address",
			type: "email",
			name: "email",
			required: true,
			editable: "system",
			sources: [
				{
					label: "Default",
					id: "default",
					type: "default",
				},
			],
		},
		{
			defaultLabel: "location",
			type: "radioInput",
			name: "location",
			editable: "system",
			hideWhenJustOneOption: true,
			required: false,
			getOptionsAt: "locations",
			optionsInputs: {
				attendeeInPerson: {
					type: "address",
					required: true,
					placeholder: "",
				},
				phone: {
					type: "phone",
					required: true,
					placeholder: "",
				},
			},
			sources: [
				{
					label: "Default",
					id: "default",
					type: "default",
				},
			],
		},
	];

	// These fields should be added after other user fields
	const systemAfterFields: typeof reviewFields = [
		{
			defaultLabel: "what_is_this_meeting_about",
			type: "text",
			name: "title",
			editable: "system-but-optional",
			required: true,
			hidden: hideReviewTitle,
			defaultPlaceholder: "",
			sources: [
				{
					label: "Default",
					id: "default",
					type: "default",
				},
			],
		},
		{
			defaultLabel: "additional_notes",
			type: "textarea",
			name: "notes",
			editable: "system-but-optional",
			required: additionalNotesRequired,
			defaultPlaceholder: "share_additional_notes",
			sources: [
				{
					label: "Default",
					id: "default",
					type: "default",
				},
			],
		},
		{
			defaultLabel: "additional_guests",
			type: "multiemail",
			editable: "system-but-optional",
			name: "guests",
			defaultPlaceholder: "email",
			required: false,
			hidden: disableGuests,
			sources: [
				{
					label: "Default",
					id: "default",
					type: "default",
				},
			],
		},
		{
			defaultLabel: "reason_for_reschedule",
			type: "textarea",
			editable: "system-but-optional",
			name: "rescheduleReason",
			defaultPlaceholder: "reschedule_placeholder",
			required: false,
			views: [
				{
					id: "reschedule",
					label: "Reschedule View",
				},
			],
			sources: [
				{
					label: "Default",
					id: "default",
					type: "default",
				},
			],
		},
	];

	const missingSystemBeforeFields = [];
	for (const field of systemBeforeFields) {
		const existingReviewFieldIndex = reviewFields.findIndex(
			(f) => getFieldIdentifier(f.name) === getFieldIdentifier(field.name),
		);
		// Only do a push, we must not update existing system fields as user could have modified any property in it,
		if (existingReviewFieldIndex === -1) {
			missingSystemBeforeFields.push(field);
		} else {
			// Adding the fields from Code first and then fields from DB. Allows, the code to push new properties to the field
			reviewFields[existingReviewFieldIndex] = {
				...field,
				...reviewFields[existingReviewFieldIndex],
			};
		}
	}

	reviewFields = missingSystemBeforeFields.concat(reviewFields);

	// Backward Compatibility for SMS Reminder Number
	// Note: We still need workflows in `reviewFields` due to Backward Compatibility. If we do a one time entry for all event-types, we can remove workflows from `reviewFields`
	// Also, note that even if Workflows don't explicity add smsReminderNumber field to reviewFields, it would be added as a side effect of this backward compatibility logic
	if (
		smsNumberSources.length &&
		!reviewFields.find(
			(f) =>
				getFieldIdentifier(f.name) !==
				getFieldIdentifier(SMS_REMINDER_NUMBER_FIELD),
		)
	) {
		const indexForLocation = reviewFields.findIndex(
			(f) => getFieldIdentifier(f.name) === getFieldIdentifier("location"),
		);
		// Add the SMS Reminder Number field after `location` field always
		reviewFields.splice(indexForLocation + 1, 0, {
			...getSmsReminderNumberField(),
			sources: smsNumberSources,
		});
	}

	// Backward Compatibility: If we are migrating from old system, we need to map `customInputs` to `reviewFields`
	if (handleMigration) {
		customInputs.forEach((input, index) => {
			const label = input.label || `${upperCaseToCamelCase(input.type)}`;
			reviewFields.push({
				label: label,
				editable: "user",
				// Custom Input's slugified label was being used as query param for prefilling. So, make that the name of the field
				// Also Custom Input's label could have been empty string as well. But it's not possible to have empty name. So generate a name automatically.
				name: slugify(input.label || `${input.type}-${index + 1}`),
				placeholder: input.placeholder,
				type: CustomInputTypeToFieldType[input.type],
				required: input.required,
				options: input.options
					? input.options.map((o) => {
							return {
								...o,
								// Send the label as the value without any trimming or lowercase as this is what customInput are doing. It maintains backward compatibility
								value: o.label,
							};
						})
					: [],
			});
		});
	}

	const missingSystemAfterFields = [];
	for (const field of systemAfterFields) {
		const existingReviewFieldIndex = reviewFields.findIndex(
			(f) => getFieldIdentifier(f.name) === getFieldIdentifier(field.name),
		);
		// Only do a push, we must not update existing system fields as user could have modified any property in it,
		if (existingReviewFieldIndex === -1) {
			missingSystemAfterFields.push(field);
		} else {
			reviewFields[existingReviewFieldIndex] = {
				// Adding the fields from Code first and then fields from DB. Allows, the code to push new properties to the field
				...field,
				...reviewFields[existingReviewFieldIndex],
			};
		}
	}

	reviewFields = reviewFields.concat(missingSystemAfterFields).map((f) => {
		return {
			...f,
			// TODO: This has to be a FormBuilder feature and not be specific to reviewFields. Either use zod transform in FormBuilder to add labelAsSafeHtml automatically or add a getter for fields that would do this.
			...(fieldsThatSupportLabelAsSafeHtml.includes(f.type)
				? { labelAsSafeHtml: markdownToSafeHTML(f.label || null) || "" }
				: null),
		};
	});

	return reviewFields.brand<"HAS_SYSTEM_FIELDS">().parse(reviewFields);
};
