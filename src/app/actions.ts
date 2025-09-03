
'use server';

import { summarizeLongEmail } from '@/ai/flows/summarize-long-emails';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

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

interface ReceiveEmailData {
  recipient: string;
  sender: string;
  subject: string;
  body: string;
}

export async function handleReceiveEmail(
  data: ReceiveEmailData
): Promise<{ success: boolean; error: string | null }> {
  try {
    await addDoc(collection(db, 'inbox'), {
      ...data,
      createdAt: serverTimestamp(),
    });
    return { success: true, error: null };
  } catch (error: any) {
    console.error('Error adding document: ', error);
    return { success: false, error: error.message };
  }
}
