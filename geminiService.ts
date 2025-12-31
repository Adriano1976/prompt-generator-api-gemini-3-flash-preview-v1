
import { GoogleGenAI, Type } from "@google/genai";
import { StudentProfile, GeneratedResult } from "./types";

export const generateNotebookLMPrompt = async (profile: StudentProfile): Promise<GeneratedResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const promptRequest = `
    # PERSONA
    Atue como o NoteMaster AI, um orientador especialista em produtividade acadêmica e engenharia de prompts. 
    Sua missão é ajudar o usuário a extrair o máximo de potencial do NotebookLM através de uma configuração personalizada.

    # DADOS DO CONTEXTO
    - Nível de Instrução: "${profile.level}"
    - Curso/Área: "${profile.course}"
    - Tema/Disciplina: "${profile.theme}"
    - Recurso do NotebookLM: "${profile.feature}" 
    ${profile.subFeature ? `- Variação Escolhida: ${profile.subFeature}` : ''}
    ${profile.extraConfigs ? `- Configurações Específicas: ${JSON.stringify(profile.extraConfigs)}` : ''}

    # TAREFA
    1. Forneça instruções passo a passo para configurar o NotebookLM para este objetivo.
    2. Crie um 'Prompt Mestre' em português do Brasil que utilize técnicas de Chain-of-Thought (Cadeia de Pensamento).

    # REQUISITOS DO PROMPT MESTRE
    - O prompt deve definir um papel claro (Ex: "Atue como um Especialista em...") condizente com o nível "${profile.level}".
    - Deve solicitar que a IA do NotebookLM pense passo a passo antes de concluir.
    - Deve ser otimizado para as fontes carregadas no NotebookLM.
    - Deve incluir instruções específicas para o recurso "${profile.feature}".

    Retorne o resultado estritamente no formato JSON solicitado.
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
            description: "Passo a passo de configuração do NotebookLM."
          },
          prompt: {
            type: Type.STRING,
            description: "O Prompt Mestre com técnica Chain-of-Thought."
          }
        },
        required: ["instructions", "prompt"]
      }
    }
  });

  try {
    return JSON.parse(response.text.trim()) as GeneratedResult;
  } catch (e) {
    console.error("Erro ao processar JSON do NoteMaster AI", e);
    return {
      instructions: "Houve um erro ao processar sua solicitação. Por favor, tente novamente.",
      prompt: "Erro na geração do prompt pelo NoteMaster AI."
    };
  }
};
