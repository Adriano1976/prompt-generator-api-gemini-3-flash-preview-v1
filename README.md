<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Execute e implante o aplicativo AI Studio

Contém tudo que precisa para executar seu aplicativo localmente.

Visualize o aplicativo no AI Studio: https://ai.studio/apps/drive/1OyuZz-JBZrHrrg3cAA3TI3k9QfUmpN1x

## Execute localmente

**Pré-requisitos:** Node.js


1. Instale dependências:
   `npm install`
2. Defina `GEMINI_API_KEY` em [.env.local](.env.local) para sua chave API Gemini
3. Execute o aplicativo:
   `npm executar dev`

## Sobre o aplicativo: Assistente de Criação de prompts para NotebookLM

Assistente especializado para configuração personalizada do NotebookLM, projetado e integrado ao modelo `gemini-3-flash-preview` para maximizar a aprendizagem por meio de prompts adaptativos e otimizados. A partir de um breve questionário sobre objetivos de estudo, contexto e nível de instrução, o assistente gera um guia técnico completo e um prompt parametrizável, incluindo instruções de formato, exemplos de input/output, parâmetros de inferência recomendados (p. ex., temperature, max_tokens, top_k) e estratégias pedagógicas (scaffolding, chunking, feedback formativo), tudo calibrado ao perfil do aprendiz para extrair o máximo das capacidades de IA do NotebookLM.

## Objetivo

- Ajudar usuários (estudantes, professores, profissionais) a estruturar prompts claros e úteis.
- Transformar informações sobre objetivos, público e formato desejado em prompts prontos para uso.
- Reduzir o tempo e tentativa/erro ao criar prompts para NotebookLM.

## Como funciona (visão geral)

1. O assistente faz perguntas sobre:
   - Objetivo do prompt (o que você quer que o NotebookLM faça).
   - Público-alvo (nível de conhecimento, interesses).
   - Formato de resposta desejado (resumo, lista, passo-a-passo, código, etc.).
   - Restrições ou pontos importantes a incluir.
2. Com base nas respostas, gera um prompt estruturado e claro.
3. Você copia o prompt gerado e o utiliza no NotebookLM.

## Exemplo de prompt gerado

- Objetivo: Resumir artigo científico
- Público: Estudantes de pós-graduação em Biologia
- Formato: Resumo em 5 pontos + referências principais

Prompt gerado (exemplo):
"Leia o seguinte artigo (insira texto/link). Resuma os 5 pontos principais, explique a relevância para pesquisadores de pós-graduação em Biologia e indique 3 referências complementares. Use linguagem técnica, mas acessível para estudantes."

## Boas práticas para prompts
- Seja específico sobre objetivo e formato.
- Declare o público-alvo e nível de detalhe esperado.
- Indique restrições (tamanho, tom, palavras a evitar).
- Peça exemplos ou estrutura se precisar de formato padronizado.

## Contribuição
- Abra uma issue descrevendo a ideia ou correção.
- Faça um fork, crie uma branch com sua alteração e abra um pull request.
- Mantenha o estilo de código e adicione exemplos ou testes quando pertinente.

## Licença
- Inclua aqui a licença do projeto (ex.: MIT). Se ainda não tiver, adicione um arquivo `LICENSE` e informe qual será adotada.

## 

<div align="center">
  <p><b><h3> Contagem de visitantes </h3></b></p>  
  <img src="https://vbr.nathanchung.dev/badge?page_id=Adriano1976/prompt-generator-api-gemini-3-flash-preview-v1" style="height: 30px;" />
   <br>
  <img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=87CEFA&height=120&section=footer"/>
</div>
