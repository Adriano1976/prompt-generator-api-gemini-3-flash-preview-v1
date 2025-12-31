
# NoteMaster AI 🚀
### O seu guia de alta performance para o NotebookLM

<img width="1366" height="768" alt="image" src="https://github.com/user-attachments/assets/e33e0a9f-e017-4b49-9a5d-0fb3f6602d97" />

O **NoteMaster AI** é uma ferramenta avançada de Engenharia de Prompts projetada especificamente para maximizar o potencial do Google NotebookLM. Devido à necessidade de integração segura com a API do Google Gemini e gerenciamento de chaves, esta aplicação foi otimizada para hospedagem na plataforma **Netlify**.

---

## 🔗 Demonstração ao Vivo
Acesse a aplicação pronta para uso aqui:  
👉 **[https://notemasteria.netlify.app/](https://notemasteria.netlify.app/)**

---

## 📋 Índice
- [Visão Geral](#-visão-geral)
- [Principais Recursos](#-principais-recursos)
- [Como Funciona](#-como-funciona)
- [Guia de Deploy (Netlify)](#-guia-de-deploy-netlify)
- [Tecnologias](#-tecnologias)
- [Contribuição](#-contribuição)

---

## 🌟 Visão Geral

O NoteMaster AI ajuda estudantes e pesquisadores a extrair o máximo das fontes carregadas no NotebookLM, gerando prompts técnicos baseados na metodologia **Chain-of-Thought (Cadeia de Pensamento)**. Isso garante respostas mais profundas, precisas e estruturadas.

## ✨ Principais Recursos

- 🎓 **Níveis Acadêmicos**: Personalização total para Ensino Médio, Graduação, Mestrado/Doutorado e Concursos.
- 🛠️ **Foco no NotebookLM**: Otimizado para os recursos de Podcast, Flashcards, Testes e Relatórios do Google.
- 🧠 **Raciocínio Estruturado**: Substitui comandos simples por guias lógicos passo a passo.
- ⚡ **Interface Ultra-Rápida**: Construída com React e Tailwind CSS para uma experiência fluida.

---

## 🚀 Guia de Deploy (Netlify)

Como a aplicação consome a API do Google Gemini, o deploy no **Netlify** é recomendado por permitir a gestão de variáveis de ambiente de forma simples.

### Passos para fazer o seu próprio deploy:

1.  **Fork do Repositório**: Faça um fork deste projeto para sua conta do GitHub.
2.  **Conectar ao Netlify**:
    - Vá para [Netlify.com](https://www.netlify.com/).
    - Clique em `Add new site` > `Import an existing project`.
    - Selecione o GitHub e autorize o acesso ao repositório `notemaster`.
3.  **Configurações de Build**:
    - O projeto utiliza uma estrutura baseada em módulos ES6. 
    - Se estiver usando o ambiente de desenvolvimento padrão, o Netlify detectará automaticamente. Caso contrário, certifique-se de que a pasta raiz contenha o `index.html`.
4.  **Variáveis de Ambiente (CRUCIAL)**:
    - No painel do seu site no Netlify, vá em `Site Settings` > `Environment variables`.
    - Adicione uma nova variável:
        - **Key**: `API_KEY`
        - **Value**: `SUA_CHAVE_API_DO_GOOGLE_GEMINI`
5.  **Deploy**: Clique em `Deploy site`. O Netlify cuidará do resto e fornecerá uma URL segura (HTTPS).

---

## 🛠 Tecnologias Utilizadas

- **React 19**: Interface reativa e moderna.
- **Tailwind CSS**: Estilização de alta performance.
- **Google Gemini API**: Inteligência Artificial para geração dos prompts.
- **TypeScript**: Código seguro e tipado.
- **Netlify**: Hospedagem e gestão de ambiente.

## 📁 Estrutura do Projeto

- `App.tsx`: Interface e controle de fluxo do app.
- `geminiService.ts`: Lógica de comunicação com a IA.
- `constants.tsx`: Configurações de recursos do NotebookLM.
- `types.ts`: Definições de tipos para o sistema.

---

## 🤝 Contribuição

Sinta-se à vontade para abrir Issues ou enviar Pull Requests. Para mudanças grandes, abra uma discussão primeiro para conversarmos sobre o que você gostaria de mudar.

## 📄 Licença

Este projeto está sob a licença MIT. Consulte o arquivo `LICENSE` para mais detalhes.

---

### Contact

**Author:** Adriano1976
**GitHub:** [@Adriano1976](https://github.com/Adriano1976)
**Email:** adrianosantos.git@gmail.com

<br><br><br><br> 

<div align="center">
  <p><b><h3> Contagem de visitantes </h3></b></p>  
  <img src="https://vbr.nathanchung.dev/badge?page_id=Adriano1976/prompt-generator-notebooklm" style="height: 30px;" />
   <br>
  <img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=87CEFA&height=120&section=footer"/>
</div>

---

**Last Updated:** 2025-12-31
