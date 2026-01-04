
import React, { useState, useCallback, useEffect } from 'react';
import Layout from './components/Layout';
import BookGrid from './components/BookGrid';
import StudyViewer from './components/StudyViewer';
import { BibleBook, StudyContent } from './types';
import { generateBibleStudy, generateStudyImage } from './services/gemini';

const App: React.FC = () => {
  // Estados de Autenticação
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Estados da Aplicação
  const [selectedBook, setSelectedBook] = useState<BibleBook | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState<string>("");
  const [currentStudy, setCurrentStudy] = useState<StudyContent | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Verificar login salvo
  useEffect(() => {
    const savedAuth = localStorage.getItem('pastor_auth');
    if (savedAuth === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Credenciais Padrão: pastor / 123456
    if (username.toLowerCase() === 'pastor' && password === '123456') {
      setIsLoggedIn(true);
      setLoginError('');
      localStorage.setItem('pastor_auth', 'true');
    } else {
      setLoginError('Credenciais ministeriais incorretas. Tente novamente.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('pastor_auth');
    // Limpa campos sensíveis ao sair
    setUsername('');
    setPassword('');
    setShowPassword(false);
  };

  const handleSelectBook = async (book: BibleBook) => {
    setSelectedBook(book);
    setIsLoading(true);
    setError(null);
    setCurrentStudy(null);
    setLoadingStatus("Iniciando Exegese Profunda...");

    try {
      const [study, imageBase64] = await Promise.all([
        generateBibleStudy(book.name),
        generateStudyImage(book.name)
      ]);
      
      const completeStudy: StudyContent = {
        ...study,
        generatedImageBase64: imageBase64
      };

      setCurrentStudy(completeStudy);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      setError("Houve uma interrupção na conexão com os originais. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
      setLoadingStatus("");
    }
  };

  const handleBackToLibrary = () => {
    setCurrentStudy(null);
    setSelectedBook(null);
  };

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  // Tela de Login
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-library flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-in fade-in zoom-in duration-700">
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-amber-500 text-indigo-950 rounded-3xl shadow-2xl mb-6 shadow-amber-500/20">
              <i className="fas fa-key text-3xl"></i>
            </div>
            <h1 className="serif text-4xl font-bold text-white mb-2">Acesso ao Scriptório</h1>
            <p className="text-slate-400 font-light italic">Autentique-se para acessar a biblioteca sagrada</p>
          </div>

          <div className="glass p-8 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden">
            {/* Brilho decorativo */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl"></div>
            
            <form onSubmit={handleLogin} className="space-y-6 relative z-10">
              <div className="space-y-2">
                <label className="text-xs font-bold text-amber-500 uppercase tracking-widest ml-1">Usuário</label>
                <div className="relative">
                  <i className="fas fa-user absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"></i>
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Seu usuário pastoral"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/5 transition-all outline-none"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-amber-500 uppercase tracking-widest ml-1">Senha</label>
                <div className="relative">
                  <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"></i>
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-white placeholder:text-slate-600 focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/5 transition-all outline-none"
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-amber-500 transition-colors p-2"
                    title={showPassword ? "Ocultar senha" : "Revelar senha"}
                  >
                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
              </div>

              {loginError && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-3 animate-shake">
                  <i className="fas fa-exclamation-circle"></i>
                  {loginError}
                </div>
              )}

              <button 
                type="submit"
                className="w-full bg-amber-500 text-indigo-950 py-4 rounded-2xl font-bold text-lg hover:bg-amber-400 transition-all shadow-xl shadow-amber-500/20 active:scale-[0.98] flex items-center justify-center gap-3"
              >
                Entrar no Scriptório <i className="fas fa-arrow-right text-sm"></i>
              </button>
            </form>
          </div>
          
          <div className="text-center mt-8 text-slate-500 text-xs uppercase tracking-widest font-bold">
            &copy; {new Date().getFullYear()} O Scriptório do Pastor
          </div>
        </div>
      </div>
    );
  }

  return (
    <Layout onLogout={handleLogout}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        {!currentStudy && !isLoading && (
          <div className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="text-center space-y-6 max-w-4xl mx-auto">
              <div className="inline-block px-4 py-1.5 glass rounded-full border border-white/10 mb-4">
                 <span className="text-xs text-amber-500 font-bold uppercase tracking-[0.3em]">Ambiente de Preparação</span>
              </div>
              <h2 className="serif text-5xl lg:text-7xl font-bold text-white tracking-tight drop-shadow-2xl">
                O Scriptório do Divino
              </h2>
              <p className="text-slate-400 text-xl lg:text-2xl font-light leading-relaxed serif italic">
                Sua biblioteca de auxílio ministerial. Escolha o livro da sua próxima jornada e deixe-nos preparar o solo teológico.
              </p>
              <div className="flex justify-center pt-4">
                 <div className="w-24 h-1 bg-amber-500 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.5)]"></div>
              </div>
            </div>
            <BookGrid onSelectBook={handleSelectBook} selectedBookName={selectedBook?.name} />
          </div>
        )}

        {isLoading && (
          <div className="min-h-[70vh] flex flex-col items-center justify-center text-center animate-in zoom-in duration-500">
            <div className="relative mb-12">
              <div className="w-32 h-32 border-[6px] border-white/5 border-t-amber-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <i className="fas fa-quill-pen text-3xl text-amber-500"></i>
              </div>
              <div className="absolute inset-0 w-32 h-32 rounded-full border border-amber-500/20 blur-xl animate-pulse"></div>
            </div>
            <h3 className="serif text-3xl font-bold text-white mb-3">Compilando Tesouros de {selectedBook?.name}</h3>
            <p className="text-amber-500/80 max-w-sm mx-auto font-bold uppercase tracking-widest text-xs animate-pulse">
              {loadingStatus}
            </p>
            <div className="mt-12 flex gap-2">
               <span className="w-2 h-2 rounded-full bg-white/20 animate-bounce delay-75"></span>
               <span className="w-2 h-2 rounded-full bg-white/20 animate-bounce delay-150"></span>
               <span className="w-2 h-2 rounded-full bg-white/20 animate-bounce delay-300"></span>
            </div>
          </div>
        )}

        {currentStudy && !isLoading && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-1000">
            <div className="no-print flex items-center justify-between mb-12">
              <button 
                onClick={handleBackToLibrary}
                className="flex items-center gap-3 text-slate-400 hover:text-amber-500 font-bold transition-all group px-4 py-2 rounded-lg hover:bg-white/5"
              >
                <i className="fas fa-chevron-left transition-transform group-hover:-translate-x-1"></i>
                Retornar ao Scriptório
              </button>
              
              <div className="hidden md:flex items-center gap-4 text-xs font-bold text-slate-600 tracking-widest uppercase">
                 <span>{selectedBook?.division}</span>
                 <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                 <span>Capítulo Selecionado</span>
              </div>
            </div>
            
            <StudyViewer study={currentStudy} onPrint={handlePrint} />
            
            <div className="no-print flex justify-center pb-20 pt-8">
              <button 
                onClick={handleBackToLibrary}
                className="bg-amber-500 text-indigo-950 px-10 py-5 rounded-2xl shadow-2xl shadow-amber-500/20 hover:bg-amber-400 transition-all font-bold flex items-center gap-4 active:scale-95 text-lg"
              >
                <i className="fas fa-book-open"></i> Explorar Nova Escritura
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="max-w-md mx-auto glass border border-red-500/20 p-12 rounded-[2rem] text-center shadow-2xl">
            <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
              <i className="fas fa-exclamation-circle text-3xl"></i>
            </div>
            <h3 className="serif text-2xl font-bold text-white mb-3">Falha na Escrita</h3>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed">Não conseguimos acessar os manuscritos neste momento. Por favor, tente novamente.</p>
            <button 
              onClick={() => handleSelectBook(selectedBook!)}
              className="w-full bg-red-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20"
            >
              Tentar Novamente
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default App;
