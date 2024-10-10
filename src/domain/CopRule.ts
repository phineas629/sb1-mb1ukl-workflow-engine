import { z } from 'zod';

export const CopRuleSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  condition: z.function().args(z.record(z.unknown())).returns(z.boolean()),
  action: z.function().args(z.record(z.unknown())).returns(z.record(z.unknown())),
});

export type CopRule = z.infer<typeof CopRuleSchema>;
