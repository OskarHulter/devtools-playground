import { EventTypeDuplicateInput } from "@sln/prisma/zod/custom/eventtype";
import type { z } from "zod";

export const ZDuplicateInputSchema = EventTypeDuplicateInput;

export type TDuplicateInputSchema = z.infer<typeof ZDuplicateInputSchema>;
