
import React, { useState, useCallback, useEffect } from 'react';
import Layout from './components/Layout';
import BookGrid from './components/BookGrid';
import StudyViewer from './components/StudyViewer';
import { BibleBook, StudyContent } from './types';
import { generateBibleStudy, generateStudyImage } from './services/gemini';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [selectedBook, setSelectedBook] = useState<BibleBook | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState<string>("");
  const [currentStudy, setCurrentStudy] = useState<StudyContent | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (localStorage.getItem('pastor_auth') === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.toLowerCase() === 'pastor' && password === '123456') {
      setIsLoggedIn(true);
      localStorage.setItem('pastor_auth', 'true');
    } else {
      setLoginError('Credenciais ministeriais não reconhecidas.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('pastor_auth');
  };

  const handleSelectBook = async (book: BibleBook) => {
    setSelectedBook(book);
    setIsLoading(true);
    setError(null);
    setLoadingStatus(`Extraindo tesouros de ${book.name}...`);

    try {
      // Geração paralela para otimizar tempo
      const [study, imageBase64] = await Promise.all([
        generateBibleStudy(book.name),
        generateStudyImage(book.name)
      ]);
      
      setCurrentStudy({ ...study, generatedImageBase64: imageBase64 });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error(err);
      setError(err.message === "API_KEY_MISSING" ? "API_KEY_MISSING" : "Houve um problema ao conectar com o Scriptório Celestial.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-library flex items-center justify-center p-4">
        <div className="w-full max-w-md glass p-10 rounded-[2.5rem] border border-white/10 shadow-2xl animate-in zoom-in duration-500">
          <div className="text-center mb-8">
            <div className="inline-block p-5 bg-amber-500 text-indigo-950 rounded-3xl shadow-xl mb-6">
              <i className="fas fa-church text-3xl"></i>
            </div>
            <h1 className="serif text-4xl font-bold text-white mb-2">Acesso ao Scriptório</h1>
            <p className="text-slate-400 font-light italic">Identifique-se para iniciar seu estudo</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-amber-500 tracking-widest ml-1">Credencial</label>
              <input 
                type="text" 
                placeholder="Ex: pastor" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-amber-500 transition-all"
                onChange={e => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-amber-500 tracking-widest ml-1">Código de Acesso</label>
              <input 
                type="password" 
                placeholder="••••••" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-amber-500 transition-all"
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            {loginError && <p className="text-red-400 text-xs text-center animate-shake">{loginError}</p>}
            <button className="w-full bg-amber-500 text-indigo-950 py-5 rounded-2xl font-bold text-lg hover:bg-amber-400 shadow-lg shadow-amber-500/20 transition-all active:scale-95">
              Entrar na Biblioteca
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <Layout onLogout={handleLogout}>
      <div className="max-w-7xl mx-auto px-4 py-12 lg:py-20">
        {isLoading && (
          <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-8">
            <div className="relative">
              <div className="w-24 h-24 border-8 border-amber-500/10 border-t-amber-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <i className="fas fa-quill-pen text-2xl text-amber-500"></i>
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="serif text-4xl font-bold text-white">{loadingStatus}</h2>
              <p className="text-slate-500 italic">Isso pode levar alguns segundos enquanto a exegese é processada...</p>
            </div>
          </div>
        )}

        {!isLoading && currentStudy && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-700">
            <button 
              onClick={() => setCurrentStudy(null)} 
              className="no-print mb-10 text-slate-400 hover:text-amber-500 flex items-center gap-3 font-bold transition-colors group"
            >
              <i className="fas fa-arrow-left transition-transform group-hover:-translate-x-1"></i> 
              Voltar à Coleção
            </button>
            <StudyViewer study={currentStudy} />
          </div>
        )}

        {!isLoading && !currentStudy && !error && (
          <div className="space-y-16">
            <div className="text-center max-w-3xl mx-auto space-y-6">
              <div className="inline-block px-4 py-1 glass rounded-full border border-white/10 mb-4">
                <span className="text-[10px] text-amber-500 font-bold uppercase tracking-[0.3em]">Preparação de Sermões</span>
              </div>
              <h1 className="serif text-6xl lg:text-7xl font-bold text-white tracking-tight">O Scriptório do Pastor</h1>
              <p className="text-slate-400 text-xl font-light serif italic">
                Escolha um livro da Bíblia para gerar um guia de estudo e e-book exclusivo, fundamentado na sã doutrina.
              </p>
            </div>
            <BookGrid onSelectBook={handleSelectBook} selectedBookName={selectedBook?.name} />
          </div>
        )}

        {error === "API_KEY_MISSING" && (
          <div className="max-w-2xl mx-auto glass p-12 rounded-[2.5rem] border border-red-500/20 text-center shadow-2xl animate-in zoom-in">
            <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-8 border border-red-500/20">
              <i className="fas fa-plug text-3xl"></i>
            </div>
            <h2 className="serif text-3xl font-bold text-white mb-6">Configuração de Servidor Pendente</h2>
            <div className="text-left bg-black/40 p-8 rounded-3xl border border-white/5 space-y-5 text-slate-300">
              <p className="font-semibold text-white">Siga estas instruções para ativar o Scriptório:</p>
              <ol className="space-y-3 text-sm list-decimal pl-5">
                <li>Acesse o seu projeto no painel da <strong>Vercel</strong>.</li>
                <li>Navegue até <strong>Settings {" > "} Environment Variables</strong>.</li>
                <li>Crie uma nova variável com o nome exato: <code className="text-amber-500 font-bold">API_KEY</code>.</li>
                <li>Cole sua chave do <strong>Google AI Studio</strong> no valor.</li>
                <li>Vá na aba <strong>Deployments</strong> e faça um novo <strong>Redeploy</strong>.</li>
              </ol>
            </div>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-10 bg-white/10 text-white px-10 py-4 rounded-2xl font-bold hover:bg-white/20 transition-all active:scale-95"
            >
              Já configurei, recarregar sistema
            </button>
          </div>
        )}

        {error && error !== "API_KEY_MISSING" && (
          <div className="text-center py-20">
             <i className="fas fa-exclamation-circle text-5xl text-red-500 mb-6"></i>
             <h2 className="serif text-3xl text-white mb-4">Ops! Houve uma interrupção</h2>
             <p className="text-slate-400 mb-8">{error}</p>
             <button onClick={() => window.location.reload()} className="bg-amber-500 text-indigo-950 px-8 py-3 rounded-xl font-bold">Tentar novamente</button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default App;
