const OpenAI = require('openai');

class OpenAIService {
    constructor() {
        this.client = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
        this.model = process.env.OPENAI_MODEL || 'gpt-4o';
        this.maxTokens = parseInt(process.env.OPENAI_MAX_TOKENS) || 2000;
        this.temperature = parseFloat(process.env.OPENAI_TEMPERATURE) || 0.7;
    }

    /**
     * Chunk content if it's too large
     */
    chunkContent(content, maxChunkSize = 4000) {
        if (content.length <= maxChunkSize) {
            return [content];
        }

        const chunks = [];
        const paragraphs = content.split('\n\n');
        let currentChunk = '';

        for (const para of paragraphs) {
            if ((currentChunk + para).length > maxChunkSize) {
                if (currentChunk) {
                    chunks.push(currentChunk.trim());
                    currentChunk = para;
                } else {
                    // Single paragraph too large, split by sentences
                    const sentences = para.match(/[^.!?]+[.!?]+/g) || [para];
                    for (const sentence of sentences) {
                        if ((currentChunk + sentence).length > maxChunkSize) {
                            chunks.push(currentChunk.trim());
                            currentChunk = sentence;
                        } else {
                            currentChunk += sentence;
                        }
                    }
                }
            } else {
                currentChunk += '\n\n' + para;
            }
        }

        if (currentChunk.trim()) {
            chunks.push(currentChunk.trim());
        }

        return chunks;
    }

    /**
     * Build the prompt for FAQ generation
     */
    buildFAQPrompt(content, sourceUrl) {
        return `You are an AI assistant that generates FAQs strictly from the provided website content.

RULES:
1. Use ONLY the content below.
2. Do NOT add external knowledge.
3. If answer is not present, say 'Information not available in the source content.'
4. Generate user-friendly questions.
5. Keep answers under 120 words.

CONTENT:
${content}

Return JSON array with this structure:
[
  {
    "question": "...",
    "answer": "...",
    "source": "${sourceUrl}"
  }
]

Generate 3-5 FAQs if sufficient content is available. If content is insufficient, return an empty array.`;
    }

    /**
     * Generate FAQs from page content
     */
    async generateFAQs(extractedContent, sourceUrl) {
        try {
            if (!extractedContent || extractedContent.trim().length < 200) {
                return {
                    success: false,
                    message: 'Not enough content to generate a reliable FAQ.',
                    faqs: []
                };
            }

            // Chunk content if needed
            const chunks = this.chunkContent(extractedContent);
            let allFAQs = [];

            for (const chunk of chunks) {
                const prompt = this.buildFAQPrompt(chunk, sourceUrl);

                const response = await this.client.chat.completions.create({
                    model: this.model,
                    messages: [
                        {
                            role: 'system',
                            content: 'You are a helpful assistant that generates factual FAQs from website content. Always respond with valid JSON.'
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    temperature: this.temperature,
                    max_tokens: this.maxTokens,
                    response_format: { type: 'json_object' }
                });

                const content = response.choices[0]?.message?.content;

                if (content) {
                    try {
                        // Try to parse as direct array
                        let parsed;
                        try {
                            parsed = JSON.parse(content);
                        } catch {
                            // If not direct array, try to extract array from object
                            const match = content.match(/\[[\s\S]*\]/);
                            if (match) {
                                parsed = JSON.parse(match[0]);
                            }
                        }

                        if (Array.isArray(parsed)) {
                            allFAQs.push(...parsed);
                        } else if (parsed.faqs && Array.isArray(parsed.faqs)) {
                            allFAQs.push(...parsed.faqs);
                        } else if (parsed.questions && Array.isArray(parsed.questions)) {
                            allFAQs.push(...parsed.questions);
                        }
                    } catch (parseError) {
                        console.error('Failed to parse OpenAI response:', parseError.message);
                    }
                }

                // Limit to avoid rate limits
                if (chunks.length > 1) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }

            return {
                success: true,
                faqs: allFAQs,
                count: allFAQs.length
            };

        } catch (error) {
            console.error('OpenAI API Error:', error.message);

            if (error.status === 401) {
                throw new Error('Invalid OpenAI API key');
            } else if (error.status === 429) {
                throw new Error('OpenAI rate limit exceeded. Please try again later.');
            } else if (error.status === 500) {
                throw new Error('OpenAI service error. Please try again later.');
            }

            throw new Error(`Failed to generate FAQs: ${error.message}`);
        }
    }

    /**
     * Validate API key
     */
    async validateAPIKey() {
        try {
            await this.client.models.list();
            return { valid: true };
        } catch (error) {
            return {
                valid: false,
                error: error.message
            };
        }
    }
}

module.exports = new OpenAIService();
