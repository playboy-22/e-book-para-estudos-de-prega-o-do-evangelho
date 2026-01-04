
import { GoogleGenAI, Type } from "@google/genai";
import { StudyContent } from "../types";

// Verificação segura para evitar erro de "process is not defined" em ambientes de produção
const getApiKey = () => {
  try {
    return process.env.API_KEY || '';
  } catch (e) {
    return '';
  }
};

const ai = new GoogleGenAI({ apiKey: getApiKey() });

/**
 * Gera o conteúdo textual do estudo bíblico de forma ultrarrápida
 */
export const generateBibleStudy = async (bookName: string): Promise<StudyContent> => {
  const prompt = `Você é um teólogo evangélico de classe mundial e pastor experiente. 
  Crie um "Ebook de Estudo Pronto" para o livro de ${bookName} da Bíblia.
  
  IMPORTANTE: Todo o conteúdo deve estar em PORTUGUÊS DO BRASIL.
  O tom deve ser inspirador, profundamente bíblico e PRONTO PARA SER LIDO pelo pastor aos crentes. 
  
  Inclua uma seção de "Metáfora Visual" que descreva uma imagem ou cena altamente simbólica que ilustre o entendimento central deste livro. 
  
  Por favor, forneça o conteúdo no formato JSON estruturado.`;

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

  try {
    const data = JSON.parse(response.text);
    return data;
  } catch (error) {
    console.error("Erro ao processar resposta do Gemini:", error);
    throw new Error("Não foi possível gerar o conteúdo textual.");
  }
};

/**
 * Gera uma imagem artística contextual de forma independente para permitir paralelismo
 */
export const generateStudyImage = async (bookName: string): Promise<string | undefined> => {
  const imagePrompt = `A sacred, cinematic, and deeply symbolic oil painting representing the core theological context and spiritual understanding of the biblical book of ${bookName}. 
  Style: Epic sacred art, warm divine light, ethereal atmosphere, high detail, masterpiece. 
  NO TEXT, NO MODERN OBJECTS, NO FACES.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: [{ text: imagePrompt }],
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
    console.error("Erro ao gerar imagem com Gemini:", error);
  }
  return undefined;
};
