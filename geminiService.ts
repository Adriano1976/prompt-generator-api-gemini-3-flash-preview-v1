
import { GoogleGenAI, Type } from "@google/genai";
import { StudentProfile, GeneratedResult } from "./types";

export const generateNotebookLMPrompt = async (profile: StudentProfile): Promise<GeneratedResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const promptRequest = `
    Atue como um especialista em Prompt Engineering para NotebookLM. 
    O usuário é um estudante de nível "${profile.level}" do curso de "${profile.course}".
    O tema abordado é: "${profile.theme}".
    O recurso do NotebookLM escolhido foi: "${profile.feature}" 
    ${profile.subFeature ? `(Sub-recurso: ${profile.subFeature})` : ''}
    ${profile.extraConfigs ? `Configurações adicionais: ${JSON.stringify(profile.extraConfigs)}` : ''}

    Com base nisso:
    1. Forneça instruções passo a passo simples de como configurar o NotebookLM para este objetivo (alinhado ao nível do estudante).
    2. Crie um 'Prompt Mestre' em português do Brasil que o estudante deve colar no NotebookLM para extrair o máximo das fontes e das capacidades de IA para o tema informado.

    O prompt deve ser profissional, usar técnicas de Few-Shot ou Chain-of-Thought se necessário, e focar em resultados acadêmicos de alta qualidade.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: promptRequest,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          instructions: {
            type: Type.STRING,
            description: "Instruções de configuração do NotebookLM."
          },
          prompt: {
            type: Type.STRING,
            description: "O prompt final gerado para ser usado no NotebookLM."
          }
        },
        required: ["instructions", "prompt"]
      }
    }
  });

  try {
    return JSON.parse(response.text.trim()) as GeneratedResult;
  } catch (e) {
    console.error("Erro ao processar JSON do Gemini", e);
    return {
      instructions: "Houve um erro ao gerar as instruções. Tente novamente.",
      prompt: "Erro na geração do prompt."
    };
  }
};
