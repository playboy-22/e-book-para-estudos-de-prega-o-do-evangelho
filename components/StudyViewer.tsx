
import React, { useRef } from 'react';
import { StudyContent } from '../types';

interface StudyViewerProps {
  study: StudyContent;
}

const StudyViewer: React.FC<StudyViewerProps> = ({ study }) => {
  const studyRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = () => {
    if (!studyRef.current) return;
    const element = studyRef.current;
    
    const opt = {
      margin: [15, 15, 15, 15],
      filename: `Ebook_Pastoral_${study.bookName.replace(/\s+/g, '_')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        letterRendering: true
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    // @ts-ignore
    html2pdf().set(opt).from(element).save();
  };

  const defaultPlaceholder = "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=1200&auto=format&fit=crop";

  return (
    <div className="max-w-4xl mx-auto mb-24">
      <div className="no-print flex justify-end mb-6">
        <button 
          onClick={handleDownloadPDF}
          className="bg-amber-500 text-indigo-950 px-8 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-xl hover:bg-amber-400 transition-all active:scale-95"
        >
          <i className="fas fa-file-pdf text-xl"></i> Baixar E-book em PDF
        </button>
      </div>

      <div ref={studyRef} className="bg-white text-slate-900 shadow-2xl rounded-3xl overflow-hidden border border-stone-200">
        {/* Capa do E-book */}
        <div className="relative h-[650px] bg-slate-950">
          <img 
            src={study.generatedImageBase64 || defaultPlaceholder} 
            alt={study.bookName} 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center text-white">
            <div className="w-24 h-px bg-amber-500 mb-8"></div>
            <span className="text-amber-500 text-sm font-bold uppercase tracking-[0.4em] mb-4">Coleção Exegética Pastoral</span>
            <h1 className="serif text-7xl lg:text-9xl font-bold mb-6 tracking-tighter drop-shadow-2xl">{study.bookName}</h1>
            <div className="max-w-2xl">
              <p className="serif text-3xl lg:text-4xl italic font-light leading-snug drop-shadow-lg">{study.title}</p>
            </div>
            <div className="mt-20 flex flex-col items-center gap-4">
              <i className="fas fa-scroll text-3xl opacity-40"></i>
              <p className="text-xs uppercase tracking-[0.2em] font-bold opacity-60">Manual de Estudo e Preparação</p>
            </div>
          </div>
        </div>

        {/* Conteúdo Literário */}
        <div className="p-10 lg:p-20 space-y-24 bg-[#fffcf5]">
          
          {/* Introdução com Capitular */}
          <section className="relative">
            <h2 className="serif text-sm font-bold text-amber-600 uppercase tracking-widest mb-12 flex items-center gap-4">
              <span className="flex-grow h-px bg-amber-200"></span>
              I. Prolegômenos
              <span className="flex-grow h-px bg-amber-200"></span>
            </h2>
            <div className="prose-bible text-slate-800 text-xl leading-[1.8] serif whitespace-pre-wrap first-letter:text-7xl first-letter:font-bold first-letter:text-amber-600 first-letter:mr-3 first-letter:float-left first-letter:mt-1">
              {study.introduction}
            </div>
          </section>

          {/* Contexto Histórico */}
          <section className="bg-stone-100/50 p-12 rounded-3xl border border-stone-200/50 italic">
            <h3 className="serif text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <i className="fas fa-landmark text-amber-700"></i>
              Fundo Histórico e Canônico
            </h3>
            <p className="text-slate-700 text-lg leading-relaxed">
              {study.historicalContext}
            </p>
          </section>

          {/* Temas Teológicos */}
          <section>
            <h2 className="serif text-3xl font-bold text-slate-900 mb-12 text-center">Núcleos Doutrinários</h2>
            <div className="grid md:grid-cols-1 gap-10">
              {study.theologicalThemes.map((theme, idx) => (
                <div key={idx} className="flex gap-8 group">
                  <div className="flex-shrink-0 w-16 h-16 bg-white border border-stone-200 shadow-sm rounded-2xl flex items-center justify-center serif font-bold text-2xl text-amber-600">
                    0{idx + 1}
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-2xl font-bold text-slate-900 serif">{theme.title}</h4>
                    <p className="text-slate-600 text-lg leading-relaxed">{theme.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Análise Linguística (Hebraico/Grego) */}
          <section className="bg-slate-900 text-white p-12 lg:p-16 rounded-[3rem] shadow-2xl">
            <h2 className="serif text-3xl font-bold mb-12 text-amber-400">Exegese dos Originais</h2>
            <div className="grid gap-8">
              {study.wordStudies.map((word, idx) => (
                <div key={idx} className="border-l-4 border-amber-500 pl-8 py-2">
                  <div className="flex flex-col md:flex-row md:items-baseline gap-4 mb-4">
                    <span className="text-4xl font-bold serif text-white">{word.originalWord}</span>
                    <span className="text-amber-500 font-mono text-sm tracking-widest uppercase font-bold">[{word.transliteration}]</span>
                  </div>
                  <h5 className="text-xl font-bold text-slate-200 mb-2">{word.meaning}</h5>
                  <p className="text-slate-400 font-light leading-relaxed serif italic text-lg">{word.significance}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Esboços Homiléticos */}
          <section>
            <h2 className="serif text-3xl font-bold text-slate-900 mb-12">Estrutura de Exposição Bíblica</h2>
            <div className="space-y-16">
              {study.chapterOutlines.map((outline, idx) => (
                <div key={idx} className="space-y-6">
                  <div className="flex items-center gap-6">
                    <span className="px-4 py-1 bg-amber-100 text-amber-800 rounded-lg font-bold text-sm uppercase">Capítulos {outline.chapterRange}</span>
                    <div className="h-px flex-grow bg-stone-200"></div>
                  </div>
                  <p className="text-xl serif italic text-slate-700 leading-relaxed border-l-2 border-stone-300 pl-8">
                    {outline.summary}
                  </p>
                  <div className="grid md:grid-cols-2 gap-4 ml-8">
                    {outline.homileticalPoints.map((point, pIdx) => (
                      <div key={pIdx} className="bg-white p-5 rounded-2xl border border-stone-200 flex items-start gap-4">
                        <i className="fas fa-fire text-amber-500 mt-1"></i>
                        <span className="text-slate-800 font-medium">{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Ideias de Sermão */}
          <section className="border-t-2 border-stone-200 pt-20">
            <div className="text-center mb-16">
              <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">Aplicações Práticas</span>
              <h2 className="serif text-4xl font-bold text-slate-900 mt-2">Sugestões de Séries Homiléticas</h2>
            </div>
            {study.sermonSeriesIdeas.map((series, idx) => (
              <div key={idx} className="mb-20 last:mb-0">
                <div className="bg-stone-50 p-10 rounded-[2.5rem] border border-stone-200">
                  <h3 className="serif text-3xl font-bold text-indigo-950 mb-4">{series.seriesTitle}</h3>
                  <p className="text-slate-600 mb-10 text-lg leading-relaxed">{series.description}</p>
                  <div className="grid sm:grid-cols-2 gap-6">
                    {series.messageOutlines.map((msg, mIdx) => (
                      <div key={mIdx} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-4">
                        <span className="w-8 h-8 rounded-full bg-indigo-900 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">{mIdx + 1}</span>
                        <p className="text-slate-800 font-bold">{msg}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </section>

          {/* Palavra Final */}
          <section className="pt-10 text-center space-y-8">
            <div className="w-16 h-16 bg-amber-500/10 text-amber-600 rounded-full flex items-center justify-center mx-auto">
              <i className="fas fa-dove text-2xl"></i>
            </div>
            <div className="max-w-3xl mx-auto">
              <h2 className="serif text-3xl font-bold text-slate-900 mb-6">Aplicação ao Rebanho</h2>
              <p className="serif text-2xl italic leading-[1.8] text-slate-700 whitespace-pre-wrap">
                "{study.pastoralApplication}"
              </p>
            </div>
            <div className="pt-20 text-[10px] uppercase font-bold tracking-[0.5em] text-stone-400">
              Soli Deo Gloria
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default StudyViewer;
