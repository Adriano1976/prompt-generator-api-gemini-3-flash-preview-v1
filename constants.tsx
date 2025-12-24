
import { NotebookLMFeature, ConfigGroup } from './types';

export const FEATURE_OPTIONS: Record<NotebookLMFeature, { label: string; subOptions: string[]; configGroups?: ConfigGroup[] }> = {
  [NotebookLMFeature.AUDIO]: {
    label: 'Gere um podcast com IA baseado nas suas fontes',
    subOptions: ['Análise detalhada', 'Resumo', 'Crítica', 'Debate']
  },
  [NotebookLMFeature.VIDEO]: {
    label: 'Gere um vídeo explicativo apresentado por IA',
    subOptions: ['Vídeo explicativo', 'Resumo']
  },
  [NotebookLMFeature.RELATORIO]: {
    label: 'Crie documentos estruturados a partir das fontes',
    subOptions: [
      'Criar do zero',
      'Documento de resumo',
      'Guia de estudo',
      'Post de blog',
      'Relatório Técnico',
      'Proposta de Projeto',
      'Texto Didático',
      'Síntese Conceitual'
    ]
  },
  [NotebookLMFeature.FLASHCARDS]: {
    label: 'Gere cartões de estudo baseados nas suas fontes',
    subOptions: [],
    configGroups: [
      { label: 'Número de cards', key: 'cards_qty', options: ['Menos', 'Padrão', 'Mais'] },
      { label: 'Nível de dificuldade', key: 'difficulty', options: ['Fácil', 'Médio (padrão)', 'Difícil'] }
    ]
  },
  [NotebookLMFeature.TESTE]: {
    label: 'Crie um teste interativo com IA',
    subOptions: [],
    configGroups: [
      { label: 'Número de questões', key: 'questions_qty', options: ['Menos', 'Padrão', 'Mais'] },
      { label: 'Nível de dificuldade', key: 'difficulty', options: ['Fácil', 'Médio (padrão)', 'Difícil'] }
    ]
  },
  [NotebookLMFeature.INFOGRAFICO]: {
    label: 'Use a IA para estruturar um infográfico',
    subOptions: [],
    configGroups: [
      { label: 'Escolher orientação', key: 'orientation', options: ['Paisagem', 'Retrato', 'Quadrado'] },
      { label: 'Nível de detalhamento', key: 'detail', options: ['Conciso', 'Padrão', 'Detalhado'] }
    ]
  },
  [NotebookLMFeature.SLIDES]: {
    label: 'Gere uma estrutura de apresentação de slides',
    subOptions: ['Apresentação detalhada', 'Slides de apresentador']
  },
  [NotebookLMFeature.CONVERSA]: {
    label: 'Personalize como a IA responde no chat',
    subOptions: [],
    configGroups: [
      { label: 'Meta, estilo ou papel', key: 'meta', options: ['Padrão', 'Guia de aprendizado', 'Personalizado'] },
      { label: 'Tamanho da resposta', key: 'length', options: ['Padrão', 'Mais longa', 'Mais curta'] }
    ]
  }
};
