
import { GoogleGenAI, Type } from "@google/genai";
import { StudyContent } from "../types";

const getAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY_MISSING");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateBibleStudy = async (bookName: string): Promise<StudyContent> => {
  const ai = getAI();
  const prompt = `Você é um renomado teólogo e professor de homilética. 
  Sua tarefa é criar um E-BOOK DE ESTUDO PROFUNDO sobre o livro de ${bookName}.
  O conteúdo deve ser denso, acadêmico mas devocional, voltado para pastores.
  
  Inclua:
  1. Título criativo para o e-book.
  2. Introdução abrangente.
  3. Contexto histórico-cultural detalhado.
  4. 3 a 5 Temas Teológicos centrais com descrições profundas.
  5. Esboços de capítulos (agrupados por seções lógicas).
  6. Estudo de 3 palavras originais (Hebraico para AT, Grego para NT) com transliteração e significado exegético.
  7. Ideias para uma série de sermões (Título da série e esboço de 4 mensagens).
  8. Uma aplicação pastoral final impactante.
  9. Uma "Metáfora Visual" (conceito e descrição) para guiar a arte da capa.

  Responda estritamente em JSON, seguindo o esquema definido. Idioma: Português Brasileiro.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      thinkingConfig: { thinkingBudget: 4000 },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          bookName: { type: Type.STRING },
          title: { type: Type.STRING },
          introduction: { type: Type.STRING },
          historicalContext: { type: Type.STRING },
          theologicalThemes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING }
              },
              required: ["title", "description"]
            }
          },
          chapterOutlines: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                chapterRange: { type: Type.STRING },
                summary: { type: Type.STRING },
                homileticalPoints: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["chapterRange", "summary", "homileticalPoints"]
            }
          },
          wordStudies: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                originalWord: { type: Type.STRING },
                transliteration: { type: Type.STRING },
                meaning: { type: Type.STRING },
                significance: { type: Type.STRING }
              },
              required: ["originalWord", "transliteration", "meaning", "significance"]
            }
          },
          sermonSeriesIdeas: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                seriesTitle: { type: Type.STRING },
                description: { type: Type.STRING },
                messageOutlines: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["seriesTitle", "description", "messageOutlines"]
            }
          },
          pastoralApplication: { type: Type.STRING },
          visualMetaphor: {
            type: Type.OBJECT,
            properties: {
              concept: { type: Type.STRING },
              description: { type: Type.STRING },
              imageKeywords: { type: Type.STRING }
            },
            required: ["concept", "description", "imageKeywords"]
          }
        },
        required: [
          "bookName", "title", "introduction", "historicalContext", 
          "theologicalThemes", "chapterOutlines", "wordStudies", 
          "sermonSeriesIdeas", "pastoralApplication", "visualMetaphor"
        ]
      }
    }
  });

  return JSON.parse(response.text || "{}");
};

export const generateStudyImage = async (bookName: string): Promise<string | undefined> => {
  const ai = getAI();
  const imagePrompt = `Epic, high-detail sacred art, oil on canvas style. Visual representation of the biblical book of ${bookName}. Theological symbolism, divine atmosphere, dramatic lighting, rich textures. No text, no modern objects. 4k resolution masterpiece.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: imagePrompt }] },
      config: {
        imageConfig: { aspectRatio: "16:9" }
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  } catch (error) {
    console.error("Erro na geração da imagem:", error);
  }
  return undefined;
};
