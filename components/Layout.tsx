
import React, { useState } from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isManualOpen, setIsManualOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="no-print sticky top-0 z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-amber-500 text-indigo-950 p-2.5 rounded-xl shadow-lg shadow-amber-500/20">
              <i className="fas fa-scroll text-2xl"></i>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight leading-none serif">O Scriptório do Pastor</h1>
              <span className="text-[10px] text-amber-500 uppercase font-bold tracking-widest">Excelência Teológica</span>
            </div>
          </div>
          <nav className="flex items-center gap-6">
            <button 
              onClick={() => setIsManualOpen(true)}
              className="text-sm font-semibold text-slate-300 hover:text-amber-500 transition-colors flex items-center gap-2"
            >
              <i className="fas fa-info-circle"></i> Manual
            </button>
            <div className="w-px h-8 bg-white/10 hidden sm:block"></div>
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Status do Sistema</span>
              <span className="text-xs text-green-400 font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span> Pronto para o Estudo
              </span>
            </div>
          </nav>
        </div>
      </header>
      
      <main className="flex-grow">
        {children}
      </main>

      {/* Modal do Manual Otimizado */}
      {isManualOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[#0f172a] border border-white/10 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="bg-gradient-to-r from-indigo-900 to-slate-900 p-8 flex justify-between items-center text-white border-b border-white/5">
              <div className="flex items-center gap-4">
                <div className="bg-amber-500/20 p-2 rounded-lg">
                  <i className="fas fa-book-reader text-2xl text-amber-500"></i>
                </div>
                <div>
                  <h2 className="serif text-3xl font-bold">Manual do Obreiro</h2>
                  <p className="text-xs text-indigo-300 uppercase tracking-widest font-bold">Instruções para o Púlpito</p>
                </div>
              </div>
              <button onClick={() => setIsManualOpen(false)} className="text-white/40 hover:text-white transition-colors">
                <i className="fas fa-times text-2xl"></i>
              </button>
            </div>
            <div className="p-8 space-y-8 bg-library">
              {[
                { step: 1, title: "Curadoria de Livros", desc: "Navegue pela biblioteca organizada por divisões teológicas. Cada livro é uma porta para novos sermões." },
                { step: 2, title: "Iluminação por IA", desc: "Nossa IA processa exegese instantânea e gera artes simbólicas exclusivas para cada livro." },
                { step: 3, title: "Homilética Pronta", desc: "Use os esboços estruturados para conduzir sua igreja em estudos profundos e séries de mensagens impactantes." },
                { step: 4, title: "E-books de Luxo", desc: "Exporte seu material em PDF de alta qualidade, ideal para tablets no púlpito ou para presentear sua liderança." }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 group">
                  <div className="flex-shrink-0 w-12 h-12 bg-white/5 text-amber-500 rounded-2xl flex items-center justify-center font-bold text-xl border border-white/10 group-hover:bg-amber-500 group-hover:text-indigo-950 transition-all">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg mb-1">{item.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
              <div className="pt-6 border-t border-white/5 flex justify-end">
                <button 
                  onClick={() => setIsManualOpen(false)}
                  className="bg-amber-500 text-indigo-950 px-8 py-3 rounded-xl font-bold hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20 active:scale-95"
                >
                  Confirmar e Iniciar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="no-print bg-black/40 border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center gap-6 mb-6">
             <i className="fas fa-bible text-slate-700 text-2xl"></i>
             <i className="fas fa-cross text-slate-700 text-2xl"></i>
             <i className="fas fa-dove text-slate-700 text-2xl"></i>
          </div>
          <p className="text-slate-400 text-sm serif italic">
            "A palavra de Cristo habite em vós abundantemente, em toda a sabedoria..." - Colossenses 3:16
          </p>
          <div className="mt-8 text-[10px] text-slate-600 uppercase tracking-widest font-bold">
            &copy; {new Date().getFullYear()} O Scriptório do Pastor &bull; Desenvolvido para a Excelência Ministerial
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
