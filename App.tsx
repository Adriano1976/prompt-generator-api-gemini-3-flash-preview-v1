
import React, { useState, useEffect } from 'react';
import { 
  AcademicLevel, 
  NotebookLMFeature, 
  StudentProfile, 
  GeneratedResult,
  ConfigGroup
} from './types';
import { FEATURE_OPTIONS } from './constants';
import { generateNotebookLMPrompt } from './geminiService';

// Icons placeholders using SVG for simplicity
const BookIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5s3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
);

const App: React.FC = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<Partial<StudentProfile>>({});
  const [result, setResult] = useState<GeneratedResult | null>(null);
  const [showCopyBadge, setShowCopyBadge] = useState(false);

  const academicLevels = Object.values(AcademicLevel);
  const features = Object.values(NotebookLMFeature);

  const handleLevelSelect = (level: AcademicLevel) => {
    setProfile({ ...profile, level });
    setStep(2);
  };

  const handleInfoSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setProfile({ 
      ...profile, 
      course: formData.get('course') as string,
      theme: formData.get('theme') as string 
    });
    setStep(3);
  };

  const handleFeatureSelect = (feature: NotebookLMFeature) => {
    const hasSubs = FEATURE_OPTIONS[feature].subOptions.length > 0;
    const hasConfigs = (FEATURE_OPTIONS[feature].configGroups?.length || 0) > 0;

    if (!hasSubs && !hasConfigs) {
      finalizeGeneration({ ...profile, feature } as StudentProfile);
    } else {
      setProfile({ ...profile, feature });
      setStep(4);
    }
  };

  const finalizeGeneration = async (finalProfile: StudentProfile) => {
    setLoading(true);
    setStep(5);
    try {
      const data = await generateNotebookLMPrompt(finalProfile);
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubFeatureSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const subFeature = formData.get('subFeature') as string;
    const extraConfigs: Record<string, string> = {};
    
    FEATURE_OPTIONS[profile.feature!].configGroups?.forEach((group) => {
      extraConfigs[group.key] = formData.get(group.key) as string;
    });

    const finalProfile = { ...profile, subFeature, extraConfigs } as StudentProfile;
    finalizeGeneration(finalProfile);
  };

  const reset = () => {
    setStep(1);
    setProfile({});
    setResult(null);
    setShowCopyBadge(false);
  };

  const goBack = () => {
    if (step === 5 && result) {
        const hasSubs = profile.feature && (FEATURE_OPTIONS[profile.feature].subOptions.length > 0 || (FEATURE_OPTIONS[profile.feature].configGroups?.length || 0) > 0);
        setStep(hasSubs ? 4 : 3);
        setResult(null);
        setShowCopyBadge(false);
    } else {
        setStep(prev => Math.max(1, prev - 1));
    }
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result.prompt);
      setShowCopyBadge(true);
      setTimeout(() => setShowCopyBadge(false), 5000);
    }
  };

  const primaryBtnClass = "bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-blue-700 transform hover:-translate-y-0.5 transition-all text-center flex items-center justify-center";
  const secondaryBtnClass = "bg-slate-700 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-slate-800 transform hover:-translate-y-0.5 transition-all text-center flex items-center justify-center";
  
  const inputFieldClass = "w-full px-4 py-3 rounded-xl bg-slate-800 text-white placeholder-slate-400 border border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all";

  // Função para obter o caminho completo das opções escolhidas desde o início
  const getBreadcrumbs = () => {
    const crumbs: string[] = [];
    if (step > 1 && profile.level) crumbs.push(profile.level);
    if (step > 2 && profile.course) crumbs.push(`${profile.course} - ${profile.theme}`);
    if (step > 3 && profile.feature) crumbs.push(profile.feature);
    if (step > 4 && (profile.subFeature || (profile.extraConfigs && Object.keys(profile.extraConfigs).length > 0))) {
      crumbs.push(profile.subFeature || "Personalizado");
    }
    return crumbs;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-16">
      {/* Header */}
      <header className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-3 bg-blue-600 text-white rounded-2xl shadow-lg mb-4">
          <BookIcon />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">
          Mestre do NotebookLM
        </h1>
        <p className="mt-2 text-slate-600 max-w-lg mx-auto">
          Otimize seus estudos e pesquisas com prompts de alta performance gerados por IA.
        </p>
      </header>

      <main className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-slate-100">
          <div 
            className="h-full bg-blue-600 transition-all duration-500" 
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        {/* Título Dinâmico (Breadcrumbs) exibindo todas as escolhas anteriores */}
        {step > 1 && (
          <div className="px-8 pt-6 md:px-12 md:pt-8 animate-in fade-in slide-in-from-top-1">
            <div className="flex flex-wrap gap-2 items-center bg-slate-50 p-3 rounded-2xl border border-slate-100 shadow-sm">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest mr-1">Progresso:</span>
              {getBreadcrumbs().map((crumb, index) => (
                <React.Fragment key={index}>
                  <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold whitespace-nowrap">
                    {crumb}
                  </div>
                  {index < getBreadcrumbs().length - 1 && (
                    <span className="text-slate-300 font-bold">›</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        <div className="p-8 md:p-12">
          {/* STEP 1: WELCOME & LEVEL */}
          {step === 1 && (
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-bold mb-2 text-slate-800">Olá! Sou seu Orientador Especialista.</h2>
              <p className="text-slate-600 mb-8">Para começar, qual é o seu grau de instrução atual?</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {academicLevels.map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => handleLevelSelect(lvl)}
                    className="flex items-center justify-between p-4 border-2 border-slate-100 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group text-left"
                  >
                    <span className="font-medium text-slate-700 group-hover:text-blue-700">{lvl}</span>
                    <span className="text-slate-300 group-hover:text-blue-400">→</span>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* STEP 2: COURSE & THEME */}
          {step === 2 && (
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-bold mb-6 text-slate-800">Conte-me sobre seus estudos</h2>
              <form onSubmit={handleInfoSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    {profile.level === AcademicLevel.CONCURSO ? "Qual é o cargo pretendido?" : "Qual é o seu curso?"}
                  </label>
                  <input 
                    name="course" 
                    required 
                    defaultValue={profile.course}
                    placeholder={profile.level === AcademicLevel.CONCURSO ? "Ex: Auditor Fiscal, Analista Judiciário..." : "Ex: Engenharia de Software, Medicina, História..."}
                    className={inputFieldClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Qual o tema ou disciplina que vamos abordar?</label>
                  <input 
                    name="theme" 
                    required 
                    defaultValue={profile.theme}
                    placeholder="Ex: Inteligência Artificial, Revolução Francesa..."
                    className={inputFieldClass}
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={goBack}
                    className={`flex-1 ${secondaryBtnClass}`}
                  >
                    Voltar
                  </button>
                  <button 
                    type="submit"
                    className={`flex-[2] ${primaryBtnClass}`}
                  >
                    Continuar
                  </button>
                </div>
              </form>
            </section>
          )}

          {/* STEP 3: FEATURE SELECTION */}
          {step === 3 && (
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-bold mb-2 text-slate-800">O que você deseja criar?</h2>
              <p className="text-slate-600 mb-8">Escolha o recurso do NotebookLM que você vai utilizar agora.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {features.map((f) => (
                  <button
                    key={f}
                    onClick={() => handleFeatureSelect(f)}
                    className={`flex flex-col p-5 border-2 rounded-xl transition-all text-left ${profile.feature === f ? 'border-blue-500 bg-blue-50' : 'border-slate-100 hover:border-blue-500 hover:bg-blue-50'}`}
                  >
                    <span className="font-bold text-slate-800 mb-1">{f}</span>
                    <span className="text-sm text-slate-500">{FEATURE_OPTIONS[f].label}</span>
                  </button>
                ))}
              </div>
              <div className="mt-8 flex justify-start">
                <button 
                  onClick={goBack}
                  className={`${secondaryBtnClass} px-8 py-3 text-sm`}
                >
                  ← Voltar
                </button>
              </div>
            </section>
          )}

          {/* STEP 4: SUB-FEATURE & CONFIGS */}
          {step === 4 && profile.feature && (
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-bold mb-6 text-slate-800">Personalize sua escolha</h2>
              <form onSubmit={handleSubFeatureSubmit} className="space-y-10">
                {/* Renderizar Variação Principal se houver */}
                {FEATURE_OPTIONS[profile.feature].subOptions.length > 0 && (
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-slate-700">Escolha uma variação:</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {FEATURE_OPTIONS[profile.feature].subOptions.map((opt) => (
                        <label key={opt} className="relative flex items-center p-4 border rounded-xl cursor-pointer hover:bg-slate-50 border-slate-200 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50 transition-all">
                          <input type="radio" name="subFeature" value={opt} defaultChecked={profile.subFeature === opt} required className="mr-3 h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium text-slate-700">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Renderizar Grupos de Configuração como Grade de Rádios */}
                {FEATURE_OPTIONS[profile.feature].configGroups?.map((group) => (
                  <div key={group.key} className="space-y-3">
                    <label className="block text-sm font-semibold text-slate-700">{group.label}:</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {group.options.map((opt) => (
                        <label key={opt} className="relative flex items-center p-4 border rounded-xl cursor-pointer hover:bg-slate-50 border-slate-200 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50 transition-all">
                          <input 
                            type="radio" 
                            name={group.key} 
                            value={opt} 
                            defaultChecked={profile.extraConfigs?.[group.key] === opt} 
                            required 
                            className="mr-3 h-4 w-4 text-blue-600" 
                          />
                          <span className="text-sm font-medium text-slate-700">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={goBack}
                    className={`flex-1 ${secondaryBtnClass}`}
                  >
                    Voltar
                  </button>
                  <button 
                    type="submit"
                    className={`flex-[2] ${primaryBtnClass}`}
                  >
                    Gerar Prompt Mestre
                  </button>
                </div>
              </form>
            </section>
          )}

          {/* STEP 5: LOADING & RESULT */}
          {step === 5 && (
            <section className="animate-in fade-in duration-500">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-6"></div>
                  <h2 className="text-xl font-bold text-slate-800 mb-2">Sincronizando com o Gemini...</h2>
                  <p className="text-slate-500">Construindo o prompt ideal para sua pesquisa.</p>
                </div>
              ) : result ? (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center">
                      <span className="bg-blue-100 text-blue-700 rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">1</span>
                      Instruções de Configuração
                    </h2>
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {result.instructions}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center">
                      <span className="bg-blue-100 text-blue-700 rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">2</span>
                      Prompt Mestre para NotebookLM
                    </h2>
                    <div className="space-y-4">
                      <div className="bg-slate-900 text-blue-100 p-6 rounded-2xl font-mono text-sm leading-relaxed whitespace-pre-wrap shadow-inner overflow-x-auto min-h-[100px]">
                        {result.prompt}
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={handleCopy}
                          className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-lg flex items-center gap-2 transform active:scale-95 ${showCopyBadge ? 'bg-green-600 text-white' : 'bg-slate-800 text-white hover:bg-slate-700'}`}
                        >
                          {showCopyBadge ? (
                            <>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                              Copiado!
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                              Copiar Prompt
                            </>
                          )}
                        </button>

                        {showCopyBadge && (
                          <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg text-xs font-bold border border-green-200 animate-in fade-in slide-in-from-left-2 duration-300">
                            Pronto! Agora cole no chat do NotebookLM.
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <p className="mt-4 text-sm text-slate-400 italic">
                      * O prompt acima foi otimizado para as fontes que você carregou no NotebookLM.
                    </p>
                  </div>

                  <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row gap-4">
                    <button 
                      onClick={goBack}
                      className={`flex-1 ${secondaryBtnClass}`}
                    >
                      Voltar e Ajustar
                    </button>
                    <button 
                      onClick={reset}
                      className="flex-1 bg-blue-50 text-blue-600 font-bold py-4 rounded-xl hover:bg-blue-100 transition-all border border-blue-200 flex items-center justify-center"
                    >
                      Novo Início
                    </button>
                    <a 
                      href="https://notebooklm.google.com/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`flex-[1.5] ${primaryBtnClass}`}
                    >
                      Abrir NotebookLM
                    </a>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-red-500 font-bold">Ocorreu um erro na geração. Por favor, reinicie.</p>
                  <button onClick={reset} className="mt-4 text-blue-600 underline">Reiniciar</button>
                </div>
              )}
            </section>
          )}
        </div>
      </main>

      {/* Footer Info */}
      <footer className="mt-12 text-center text-slate-400 text-sm space-y-2 pb-12">
        <p>Criado por Adriano Santos e desenvolvido com IA para maximizar sua produtividade acadêmica.</p>
        <p>© 2024 Mestre do NotebookLM • Assistente de Prompt Engineering</p>
      </footer>
    </div>
  );
};

export default App;
