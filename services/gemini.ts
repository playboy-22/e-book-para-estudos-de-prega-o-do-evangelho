
import { GoogleGenAI, Type } from "@google/genai";
import { StudyContent } from "../types";

/**
 * Função para inicializar o cliente Google AI.
 * A API_KEY é injetada automaticamente pelo ambiente.
 */
const getAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY_MISSING");
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * Gera o conteúdo textual do estudo bíblico de forma estruturada.
 */
export const generateBibleStudy = async (bookName: string): Promise<StudyContent> => {
  const ai = getAI();
  const prompt = `Você é um teólogo evangélico de classe mundial e pastor experiente. 
  Crie um "Guia de Estudo e Preparação de Sermão" para o livro de ${bookName} da Bíblia.
  
  O conteúdo deve ser em PORTUGUÊS DO BRASIL, com tom solene, inspirador e exegético.
  O objetivo é auxiliar um pastor na preparação de uma série de mensagens para sua igreja.
  
  Por favor, retorne os dados estritamente no formato JSON solicitado.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
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

  const text = response.text;
  if (!text) throw new Error("A IA não retornou conteúdo.");

  return JSON.parse(text);
};

/**
 * Gera uma arte sacra representativa para o e-book.
 */
export const generateStudyImage = async (bookName: string): Promise<string | undefined> => {
  const ai = getAI();
  const imagePrompt = `Sacred art, cinematic oil painting representing the spiritual essence of the biblical book of ${bookName}. 
  Atmosphere: Divine light, ancient textures, theological symbolism, masterpiece, 8k. 
  NO TEXT, NO MODERN ELEMENTS.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: imagePrompt }] },
      config: {
        imageConfig: {
          aspectRatio: "16:9"
        }
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  } catch (error) {
    console.error("Erro na geração da imagem sacra:", error);
  }
  return undefined;
};
