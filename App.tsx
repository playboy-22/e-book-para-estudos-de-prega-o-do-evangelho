
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
  const [showPassword, setShowPassword] = useState(false);
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
      setLoginError('Credenciais incorretas.');
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
    setLoadingStatus("Consultando as Escrituras...");

    try {
      const [study, imageBase64] = await Promise.all([
        generateBibleStudy(book.name),
        generateStudyImage(book.name)
      ]);
      
      setCurrentStudy({ ...study, generatedImageBase64: imageBase64 });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setError(err.message === "API_KEY_MISSING" ? "API_KEY_MISSING" : "Erro de conexão.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-library flex items-center justify-center p-4">
        <div className="w-full max-w-md glass p-8 rounded-[2.5rem] border border-white/10 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-amber-500 text-indigo-950 rounded-full mb-4">
              <i className="fas fa-key text-2xl"></i>
            </div>
            <h1 className="serif text-3xl font-bold text-white">Acesso Ministerial</h1>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="text" 
              placeholder="Usuário" 
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-amber-500"
              onChange={e => setUsername(e.target.value)}
            />
            <input 
              type="password" 
              placeholder="Senha" 
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-amber-500"
              onChange={e => setPassword(e.target.value)}
            />
            {loginError && <p className="text-red-400 text-xs">{loginError}</p>}
            <button className="w-full bg-amber-500 text-indigo-950 py-4 rounded-xl font-bold hover:bg-amber-400">Entrar</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <Layout onLogout={handleLogout}>
      <div className="max-w-7xl mx-auto px-4 py-12">
        {isLoading && (
          <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mb-6"></div>
            <h2 className="serif text-2xl text-white">{loadingStatus}</h2>
          </div>
        )}

        {!isLoading && currentStudy && (
          <div className="animate-in fade-in duration-700">
            <button onClick={() => setCurrentStudy(null)} className="no-print mb-8 text-slate-400 hover:text-white flex items-center gap-2">
              <i className="fas fa-arrow-left"></i> Voltar à Biblioteca
            </button>
            <StudyViewer study={currentStudy} />
          </div>
        )}

        {!isLoading && !currentStudy && !error && (
          <div className="space-y-12">
            <div className="text-center">
              <h1 className="serif text-5xl font-bold text-white mb-4">O Scriptório do Pastor</h1>
              <p className="text-slate-400 text-lg">Selecione um livro para gerar seu guia de estudo exclusivo.</p>
            </div>
            <BookGrid onSelectBook={handleSelectBook} selectedBookName={selectedBook?.name} />
          </div>
        )}

        {error === "API_KEY_MISSING" && (
          <div className="max-w-xl mx-auto glass p-8 rounded-3xl border border-red-500/20 text-center">
            <i className="fas fa-plug text-4xl text-red-500 mb-4"></i>
            <h2 className="serif text-2xl text-white mb-4">Configuração Necessária</h2>
            <div className="text-left bg-black/30 p-4 rounded-xl text-sm text-slate-300 space-y-2">
              <p>O sistema precisa da sua chave de API para funcionar:</p>
              <ol className="list-decimal pl-4 space-y-1">
                <li>Acesse o painel da Vercel.</li>
                <li>Vá em <strong>Settings {" > "} Environment Variables</strong>.</li>
                <li>Adicione <strong>API_KEY</strong> com sua chave do Google AI Studio.</li>
                <li>Faça um novo <strong>Redeploy</strong>.</li>
              </ol>
            </div>
            <button onClick={() => window.location.reload()} className="mt-6 bg-white/10 text-white px-6 py-2 rounded-lg hover:bg-white/20">Já configurei, recarregar</button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default App;
