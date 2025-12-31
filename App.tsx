
import React, { useState } from 'react';
import { 
  AcademicLevel, 
  NotebookLMFeature, 
  StudentProfile, 
  GeneratedResult
} from './types';
import { FEATURE_OPTIONS } from './constants';
import { generateNotebookLMPrompt } from './geminiService';

const LogoIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
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

  const primaryBtnClass = "bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-blue-700 transform hover:-translate-y-0.5 transition-all text-center flex items-center justify-center cursor-pointer";
  const secondaryBtnClass = "bg-slate-700 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-slate-800 transform hover:-translate-y-0.5 transition-all text-center flex items-center justify-center cursor-pointer";
  // Alterado text-slate-900 para text-black para garantir texto preto puro no preenchimento
  const inputFieldClass = "w-full px-4 py-3 rounded-xl bg-slate-50 text-black font-medium placeholder-slate-400 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all";

  const getBreadcrumbs = () => {
    const crumbs: string[] = [];
    if (step > 1 && profile.level) crumbs.push(profile.level);
    if (step > 2 && profile.course) crumbs.push(`${profile.course} - ${profile.theme}`);
    if (step > 3 && profile.feature) crumbs.push(profile.feature);
    return crumbs;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-16">
      <header className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-3 bg-blue-600 text-white rounded-2xl shadow-xl mb-4 transform hover:rotate-12 transition-transform">
          <LogoIcon />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
          NoteMaster <span className="text-blue-600">AI</span>
        </h1>
        <p className="mt-2 text-slate-500 font-medium max-w-lg mx-auto uppercase tracking-widest text-xs">
          O seu guia de alta performance para o NotebookLM
        </p>
      </header>

      <main className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden relative">
        <div className="h-1.5 w-full bg-slate-50">
          <div className="h-full bg-blue-600 transition-all duration-700 ease-out" style={{ width: `${(step / 5) * 100}%` }} />
        </div>

        {step > 1 && (
          <div className="px-8 pt-6 md:px-12 md:pt-8 animate-in fade-in slide-in-from-top-2">
            <div className="flex flex-wrap gap-2 items-center bg-slate-50 p-3 rounded-2xl border border-slate-100 shadow-sm">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest mr-1">Rastro:</span>
              {getBreadcrumbs().map((crumb, index) => (
                <React.Fragment key={index}>
                  <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-[11px] font-black uppercase whitespace-nowrap">
                    {crumb}
                  </div>
                  {index < getBreadcrumbs().length - 1 && <span className="text-slate-300">/</span>}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        <div className="p-8 md:p-12">
          {step === 1 && (
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-8 p-6 bg-blue-50 border-l-4 border-blue-600 rounded-r-xl">
                <p className="text-slate-700 leading-relaxed font-medium italic">
                  "Olá! Sou o <span className="text-blue-700 font-bold">NoteMaster AI</span> e vou guiar você na configuração personalizada do NotebookLM para elevar o nível do seu aprendizado. Por meio de breves perguntas, gerarei um guia exclusivo e um prompt de alta performance, garantindo que você utilize todo o poder da IA nos seus estudos."
                </p>
              </div>
              <h2 className="text-xl font-black mb-6 text-slate-900 uppercase tracking-tight">Qual seu nível atual?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {academicLevels.map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => handleLevelSelect(lvl)}
                    className="flex items-center justify-between p-5 border-2 border-slate-100 rounded-2xl hover:border-blue-600 hover:bg-blue-50 transition-all group text-left shadow-sm"
                  >
                    <span className="font-bold text-slate-800 group-hover:text-black">{lvl}</span>
                    <span className="text-slate-300 group-hover:text-blue-600 font-black">→</span>
                  </button>
                ))}
              </div>
            </section>
          )}

          {step === 2 && (
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-black mb-6 text-slate-900 tracking-tight">FOCO ACADÊMICO</h2>
              <form onSubmit={handleInfoSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                    {profile.level === AcademicLevel.CONCURSO ? "Cargo Almejado" : "Seu Curso / Área"}
                  </label>
                  <input 
                    name="course" required defaultValue={profile.course}
                    placeholder="Ex: Medicina, Auditor Fiscal, Engenharia..."
                    className={inputFieldClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Tema ou Disciplina</label>
                  <input 
                    name="theme" required defaultValue={profile.theme}
                    placeholder="Ex: Farmacologia, Direito Constitucional..."
                    className={inputFieldClass}
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button type="button" onClick={goBack} className={`flex-1 ${secondaryBtnClass}`}>Voltar</button>
                  <button type="submit" className={`flex-[2] ${primaryBtnClass}`}>Próximo Passo</button>
                </div>
              </form>
            </section>
          )}

          {step === 3 && (
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-black mb-2 text-slate-900 tracking-tight text-center">RECURSO ESTRATÉGICO</h2>
              <p className="text-slate-500 mb-8 text-center text-sm font-medium">O que o NoteMaster deve preparar para você hoje?</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {features.map((f) => (
                  <button
                    key={f}
                    onClick={() => handleFeatureSelect(f)}
                    className={`flex flex-col p-6 border-2 rounded-2xl transition-all text-left shadow-sm ${profile.feature === f ? 'border-blue-600 bg-blue-50' : 'border-slate-50 hover:border-blue-600 hover:bg-blue-50'}`}
                  >
                    <span className="font-black text-slate-900 mb-1 uppercase text-sm tracking-tight">{f}</span>
                    <span className="text-xs text-slate-400 font-medium leading-tight">{FEATURE_OPTIONS[f].label}</span>
                  </button>
                ))}
              </div>
              <button onClick={goBack} className="mt-8 text-slate-400 text-xs font-black uppercase hover:text-slate-600 transition-colors">← Voltar</button>
            </section>
          )}

          {step === 4 && profile.feature && (
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-black mb-6 text-slate-900 tracking-tight">REFINAMENTO TÉCNICO</h2>
              <form onSubmit={handleSubFeatureSubmit} className="space-y-8">
                {FEATURE_OPTIONS[profile.feature].subOptions.length > 0 && (
                  <div className="space-y-4">
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Escolha a Variação:</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {FEATURE_OPTIONS[profile.feature].subOptions.map((opt) => (
                        <label key={opt} className="relative flex items-center p-4 border-2 rounded-xl cursor-pointer hover:bg-slate-50 border-slate-100 has-[:checked]:border-blue-600 has-[:checked]:bg-blue-50 transition-all">
                          <input type="radio" name="subFeature" value={opt} defaultChecked={profile.subFeature === opt} required className="mr-3 h-4 w-4 accent-blue-600" />
                          <span className="text-sm font-bold text-black">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {FEATURE_OPTIONS[profile.feature].configGroups?.map((group) => (
                  <div key={group.key} className="space-y-4">
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">{group.label}:</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {group.options.map((opt) => (
                        <label key={opt} className="relative flex items-center p-4 border-2 rounded-xl cursor-pointer hover:bg-slate-50 border-slate-100 has-[:checked]:border-blue-600 has-[:checked]:bg-blue-50 transition-all">
                          <input type="radio" name={group.key} value={opt} defaultChecked={profile.extraConfigs?.[group.key] === opt} required className="mr-3 h-4 w-4 accent-blue-600" />
                          <span className="text-sm font-bold text-black">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button type="button" onClick={goBack} className={`flex-1 ${secondaryBtnClass}`}>Voltar</button>
                  <button type="submit" className={`flex-[2] ${primaryBtnClass}`}>Gerar Guia NoteMaster</button>
                </div>
              </form>
            </section>
          )}

          {step === 5 && (
            <section className="animate-in fade-in duration-700">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="relative w-20 h-20 mb-8">
                    <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <h2 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">O NoteMaster está pensando...</h2>
                  <p className="text-slate-400 font-medium">Estruturando seu prompt com técnica Chain-of-Thought.</p>
                </div>
              ) : result ? (
                <div className="space-y-10">
                  <div>
                    <h2 className="text-sm font-black text-blue-600 mb-4 uppercase tracking-[0.2em] flex items-center">
                      <span className="w-8 h-px bg-blue-600 mr-3"></span> Instruções de Configuração
                    </h2>
                    <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 text-slate-700 leading-relaxed font-medium shadow-inner">
                      {result.instructions}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-sm font-black text-blue-600 mb-4 uppercase tracking-[0.2em] flex items-center">
                      <span className="w-8 h-px bg-blue-600 mr-3"></span> Prompt Mestre (Alta Performance)
                    </h2>
                    <div className="relative group">
                      <div className="bg-slate-900 text-blue-100 p-8 rounded-3xl font-mono text-sm leading-relaxed whitespace-pre-wrap shadow-2xl overflow-x-auto max-h-[400px]">
                        {result.prompt}
                      </div>
                      
                      <div className="mt-6 flex flex-wrap items-center gap-4">
                        <button 
                          onClick={handleCopy}
                          className={`px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl flex items-center gap-3 transform active:scale-95 ${showCopyBadge ? 'bg-green-600 text-white' : 'bg-slate-800 text-white hover:bg-slate-700'}`}
                        >
                          {showCopyBadge ? "Copiado com Sucesso" : "Copiar Prompt Mestre"}
                        </button>
                        {showCopyBadge && (
                          <span className="text-[10px] font-black text-green-600 uppercase tracking-widest animate-pulse">
                            Pronto para o NotebookLM!
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-10 border-t border-slate-100 flex flex-col sm:flex-row gap-4">
                    <button onClick={goBack} className={`flex-1 ${secondaryBtnClass}`}>Ajustar Dados</button>
                    <button onClick={reset} className="flex-1 bg-slate-100 text-slate-600 font-black text-[10px] uppercase tracking-widest py-4 rounded-xl hover:bg-slate-200 transition-all">Novo Ciclo</button>
                    <a href="https://notebooklm.google.com/" target="_blank" rel="noopener noreferrer" className={`flex-[1.5] ${primaryBtnClass}`}>Abrir NotebookLM</a>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-red-500 font-black uppercase tracking-widest">Falha na Conexão NoteMaster.</p>
                  <button onClick={reset} className="mt-4 text-blue-600 font-bold underline">Tentar Reiniciar</button>
                </div>
              )}
            </section>
          )}
        </div>
      </main>

      <footer className="mt-16 text-center text-slate-400 space-y-3 pb-12">
        <p className="text-[10px] font-black uppercase tracking-[0.3em]">© 2024 NoteMaster AI • Sistema de Engenharia de Prompts</p>
        <p className="text-[9px] font-medium max-w-md mx-auto leading-relaxed">Desenvolvido com IA para maximizar a produtividade acadêmica. Este é um guia independente para otimização do Google NotebookLM.</p>
      </footer>
    </div>
  );
};

export default App;
