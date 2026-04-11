import { ChromaClient, type EmbeddingFunction } from "chromadb";
import { client } from "../../lib/openai";

const EMBEDDING_MODEL = "text-embedding-3-small" as const;

const openAiEmbedding: EmbeddingFunction = {
    name: `openai-${EMBEDDING_MODEL}`,
    async generate(texts: string[]) {
        const res = await client.embeddings.create({
            model: EMBEDDING_MODEL,
            input: texts,
        });
        const ordered = [...res.data].sort((a, b) => a.index - b.index);
        return ordered.map((d) => d.embedding);
    },
};

export const chroma = new ChromaClient();

export async function getTradeCollection() {
    return await chroma.getOrCreateCollection({
        name: "trades",
        embeddingFunction: openAiEmbedding,
    });
}