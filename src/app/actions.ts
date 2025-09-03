'use server';

import { summarizeLongEmail } from '@/ai/flows/summarize-long-emails';

export async function handleSummarize(
  emailBody: string
): Promise<{ summary: string | null; error: string | null }> {
  if (!emailBody) {
    return { summary: null, error: 'Email body is empty.' };
  }

  try {
    const result = await summarizeLongEmail({ emailBody });
    return { summary: result.summary, error: null };
  } catch (e) {
    console.error(e);
    return {
      summary: null,
      error:
        'An error occurred while summarizing the email. Please try again later.',
    };
  }
}
