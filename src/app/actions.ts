'use server';

import { summarizeLongEmail } from '@/ai/flows/summarize-long-emails';
import { translateText } from '@/ai/flows/translate-text';

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

export async function handleTranslate(
  text: string,
  targetLanguage: string
): Promise<{ translation: string | null; error: string | null }> {
  if (!text) {
    return { translation: null, error: 'Text is empty.' };
  }
  try {
    const result = await translateText({ text, targetLanguage });
    return { translation: result.translation, error: null };
  } catch (e) {
    console.error(e);
    return {
      translation: null,
      error: `An error occurred while translating the text. Please try again later.`,
    };
  }
}
