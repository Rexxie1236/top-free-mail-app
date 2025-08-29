'use server';

/**
 * @fileOverview A flow that summarizes long emails using AI.
 *
 * - summarizeLongEmail - A function that handles the email summarization process.
 * - SummarizeLongEmailInput - The input type for the summarizeLongEmail function.
 * - SummarizeLongEmailOutput - The return type for the summarizeLongEmail function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

const SummarizeLongEmailInputSchema = z.object({
  emailBody: z
    .string()
    .describe('The body of the email to be summarized.'),
});
export type SummarizeLongEmailInput = z.infer<typeof SummarizeLongEmailInputSchema>;

const SummarizeLongEmailOutputSchema = z.object({
  summary: z.string().describe('The summary of the email.'),
});
export type SummarizeLongEmailOutput = z.infer<typeof SummarizeLongEmailOutputSchema>;

export async function summarizeLongEmail(
  input: SummarizeLongEmailInput
): Promise<SummarizeLongEmailOutput> {
  return summarizeLongEmailFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeLongEmailPrompt',
  input: {schema: SummarizeLongEmailInputSchema},
  output: {schema: SummarizeLongEmailOutputSchema},
  prompt: `You are an AI assistant that specializes in summarizing long emails.

  Please provide a concise summary of the following email, highlighting the key information and main points:

  {{emailBody}}`,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const summarizeLongEmailFlow = ai.defineFlow(
  {
    name: 'summarizeLongEmailFlow',
    inputSchema: SummarizeLongEmailInputSchema,
    outputSchema: SummarizeLongEmailOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
