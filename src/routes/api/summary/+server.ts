import { db } from '$lib/server/db';
import { students, subjects, grades, enrollmentHistory } from '$lib/server/db/schema';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);

const OLLAMA_MODEL = 'llama3.2:latest'; // Updated to match your installed model
const SYSTEM_PROMPT = `You are a highly capable AI assistant specialized in summarizing information. 
Follow these guidelines:
- Focus on key insights and important patterns
- Use clear, concise language
- Organize information logically
- Highlight notable trends or anomalies
- Keep the tone professional and objective`;

type OllamaRequest = {
    model: string;
    prompt: string;
    system?: string;
    stream?: boolean;
};

type OllamaResponse = {
    response: string;
    done: boolean;
};

const generateSummary = async (input: string): Promise<string> => {
    try {
        const body: OllamaRequest = {
            model: OLLAMA_MODEL,
            system: SYSTEM_PROMPT,
            prompt: `Please analyze and summarize the following information:\n\n${input}\n\nProvide a well-structured summary that captures the essential information and any notable patterns or insights.`,
            stream: false
        };

        const res = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (!res.ok) {
            throw new Error(`Failed to connect to Ollama: ${res.statusText}`);
        }

        const reader = res.body?.getReader();
        if (!reader) {
            throw new Error('No response body from Ollama');
        }

        const decoder = new TextDecoder();
        let fullText = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n').filter(line => line.trim() !== '');
            
            for (const line of lines) {
                try {
                    const json = JSON.parse(line) as OllamaResponse;
                    fullText += json.response || '';
                    if (json.done) break;
                } catch (err) {
                    console.warn('Failed to parse chunk:', line);
                }
            }
        }

        return fullText.trim() || 'Unable to generate a meaningful summary.';
    } catch (error) {
        console.error('Error in generateSummary:', error);
        throw new Error('Failed to generate summary');
    }
};

export const GET: RequestHandler = async () => {
    try {
        // Here you would typically query your database and get relevant data
        // For now, we'll return a mock summary
        const dbSummary = "Database summary functionality will be implemented soon. This will include statistics about students, grades, and courses.";
        return json({ summary: dbSummary });
    } catch (error) {
        console.error('Database summary error:', error);
        return json({ error: 'Error generating database summary' }, { status: 500 });
    }
};

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { text } = await request.json();

        if (!text) {
            return json({ error: 'No text provided' }, { status: 400 });
        }

        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant that provides concise summaries."
                },
                {
                    role: "user",
                    content: `Please summarize the following text:\n\n${text}`
                }
            ],
            max_tokens: 500,
            temperature: 0.7,
        });

        const summary = completion.data.choices[0]?.message?.content || 'Unable to generate summary';
        return json({ summary });

    } catch (error) {
        console.error('Summary generation error:', error);
        return json({ error: 'Error generating summary' }, { status: 500 });
    }
};
