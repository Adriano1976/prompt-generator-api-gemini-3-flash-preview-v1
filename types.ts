
export enum AcademicLevel {
  ENSINO_MEDIO = 'Ensino Médio',
  TECNICO = 'Técnico',
  GRADUACAO = 'Graduação',
  ESPECIALIZACAO = 'Especialização',
  MESTRADO_DOUTORADO = 'Mestrado ou Doutorado',
  CONCURSO = 'Preparação para Concurso'
}

export enum NotebookLMFeature {
  AUDIO = 'Resumo em Áudio',
  VIDEO = 'Resumo em Vídeo',
  RELATORIO = 'Cria relatório',
  FLASHCARDS = 'Cartões didáticos',
  TESTE = 'Teste interativo',
  INFOGRAFICO = 'Infográfico',
  SLIDES = 'Apresentação de slides',
  CONVERSA = 'Configuração de conversas'
}

export interface ConfigGroup {
  label: string;
  key: string;
  options: string[];
}

export interface StudentProfile {
  level: AcademicLevel;
  course: string;
  theme: string;
  feature: NotebookLMFeature;
  subFeature?: string;
  extraConfigs?: Record<string, string>;
}

export interface GeneratedResult {
  instructions: string;
  prompt: string;
}
