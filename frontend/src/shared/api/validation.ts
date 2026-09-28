import { z } from 'zod';

const responseBaseSchema = z.object({
  success: z.boolean(),
  statusCode: z.number(),
  message: z.string(),
  error: z.unknown().optional(),
});

export function parseApiData<TSchema extends z.ZodType>(
  schema: TSchema,
  payload: unknown,
): z.output<TSchema> {
  const result = responseBaseSchema.extend({ data: schema }).parse(payload) as {
    data: z.output<TSchema>;
  };
  return result.data;
}

export function parseApiResponse(payload: unknown): z.infer<typeof responseBaseSchema> {
  return responseBaseSchema.parse(payload);
}
