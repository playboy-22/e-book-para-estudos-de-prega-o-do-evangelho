
import React, { useRef } from 'react';
import { StudyContent } from '../types';

interface StudyViewerProps {
  study: StudyContent;
  onPrint?: () => void;
}

const StudyViewer: React.FC<StudyViewerProps> = ({ study }) => {
  const studyRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = () => {
    if (!studyRef.current) return;

    const element = studyRef.current;
    
    const opt = {
      margin: [10, 10, 10, 10],
      filename: `Ebook_Pastoral_${study.bookName.replace(/\s+/g, '_')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        letterRendering: true,
        logging: false
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    // @ts-ignore
    html2pdf().set(opt).from(element).save();
  };

  const defaultPlaceholder = "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=1200&auto=format&fit=crop";

  return (
    <div ref={studyRef} className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden mb-12 border border-stone-200">
      {/* Header Image Section - Usando a Imagem gerada pela IA */}
      <div className="relative h-[450px] bg-slate-900 overflow-hidden">
        <img 
          src={study.generatedImageBase64 || defaultPlaceholder} 
          alt={study.bookName} 
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent flex flex-col justify-end p-8 lg:p-12">
          <span className="text-indigo-300 text-sm font-bold uppercase tracking-[0.2em] mb-2">E-book Pastoral Exclusivo</span>
          <h1 className="serif text-5xl lg:text-7xl font-bold text-white mb-3 drop-shadow-lg">{study.bookName}</h1>
          <p className="text-white text-xl lg:text-2xl italic font-light serif max-w-2xl drop-shadow-md">{study.title}</p>
        </div>
        
        <button 
          type="button"
          onClick={handleDownloadPDF}
          className="no-print absolute top-8 right-8 z-[80] bg-white/10 hover:bg-white/30 backdrop-blur-lg active:scale-95 text-white px-5 py-2.5 rounded-full transition-all flex items-center gap-2 text-sm font-bold shadow-2xl border border-white/20 cursor-pointer"
        >
          <i className="fas fa-file-download"></i> Baixar Ebook PDF
        </button>
      </div>

      <div className="p-8 lg:p-16 space-y-16">
        {/* Introdução */}
        <section>
          <h2 className="serif text-3xl font-bold text-indigo-900 mb-6 flex items-center gap-3">
            <span className="w-12 h-px bg-indigo-300"></span>
            Introdução ao Povo
          </h2>
          <div className="prose-bible text-slate-700 leading-relaxed text-xl whitespace-pre-wrap font-serif">
            {study.introduction}
          </div>
        </section>

        {/* Metáfora Visual - ILUSTRAÇÃO DO ENTENDIMENTO DA PALAVRA */}
        <section className="space-y-8">
          <div className="text-center">
             <h2 className="serif text-3xl font-bold text-slate-900 mb-2">Visão Profética e Teológica</h2>
             <p className="text-indigo-600 font-bold text-sm tracking-widest uppercase">{study.visualMetaphor.concept}</p>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-stone-50">
            <img 
              src={study.generatedImageBase64 || defaultPlaceholder} 
              alt={study.visualMetaphor.concept}
              className="w-full h-auto object-cover"
            />
            <div className="p-8 bg-indigo-900 text-white">
              <p className="italic text-lg leading-relaxed serif">
                <i className="fas fa-quote-left text-indigo-300 mr-4 opacity-50"></i>
                {study.visualMetaphor.description}
              </p>
            </div>
          </div>
        </section>

        {/* Contexto Histórico */}
        <section className="bg-stone-50 p-10 rounded-3xl border border-stone-100">
          <h2 className="serif text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
            <i className="fas fa-scroll text-indigo-400"></i>
            Contexto Histórico e Bíblico
          </h2>
          <p className="text-slate-600 leading-relaxed italic text-lg">
            {study.historicalContext}
          </p>
        </section>

        {/* Temas Teológicos */}
        <section>
          <h2 className="serif text-3xl font-bold text-indigo-900 mb-10 text-center">Pilares Doutrinários do Estudo</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {study.theologicalThemes.map((theme, idx) => (
              <div key={idx} className="border border-stone-200 p-8 rounded-2xl hover:shadow-xl transition-all bg-white group">
                <h3 className="font-bold text-indigo-900 text-xl mb-4 flex items-center gap-3">
                  <span className="bg-indigo-900 text-white w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shadow-md group-hover:scale-110 transition-transform">{idx + 1}</span>
                  {theme.title}
                </h3>
                <p className="text-slate-600 text-base leading-relaxed">{theme.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Palavras Chave */}
        <section>
          <h2 className="serif text-3xl font-bold text-slate-900 mb-8">Tesouros dos Originais</h2>
          <div className="grid gap-6">
            {study.wordStudies.map((word, idx) => (
              <div key={idx} className="flex flex-col md:flex-row gap-6 p-8 border-l-8 border-indigo-600 bg-indigo-50/50 rounded-r-2xl">
                <div className="md:w-1/3">
                  <div className="text-4xl font-bold text-indigo-900 serif mb-1">{word.originalWord}</div>
                  <div className="text-sm text-indigo-500 font-mono tracking-[0.2em] font-bold">{word.transliteration}</div>
                </div>
                <div className="md:w-2/3">
                  <p className="text-xl font-bold text-slate-800 mb-2">{word.meaning}</p>
                  <p className="text-base text-slate-600 leading-relaxed font-serif">{word.significance}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Esboços por Capítulos */}
        <section>
          <h2 className="serif text-3xl font-bold text-slate-900 mb-10">Exegese Estruturada para o Púlpito</h2>
          <div className="space-y-12">
            {study.chapterOutlines.map((outline, idx) => (
              <div key={idx} className="relative pl-12 border-l-2 border-stone-200 pb-12 last:pb-0">
                <div className="absolute top-0 left-[-16px] w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold ring-4 ring-white">
                  {idx + 1}
                </div>
                <h3 className="font-bold text-slate-800 text-2xl mb-4">Capítulos {outline.chapterRange}</h3>
                <p className="text-slate-600 mb-6 text-lg italic bg-stone-50 p-6 rounded-2xl border border-stone-100">{outline.summary}</p>
                <div className="bg-white border-2 border-indigo-50 p-8 rounded-2xl shadow-sm">
                  <h4 className="text-xs uppercase tracking-widest text-indigo-600 font-bold mb-6 border-b border-indigo-50 pb-2">Pontos Homiléticos Sugeridos</h4>
                  <ul className="space-y-4">
                    {outline.homileticalPoints.map((point, pIdx) => (
                      <li key={pIdx} className="text-lg text-slate-700 flex items-start gap-4">
                        <span className="text-indigo-500 mt-1 flex-shrink-0"><i className="fas fa-fire-alt"></i></span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Séries de Sermões */}
        <section className="bg-slate-900 text-white p-10 lg:p-16 rounded-[3rem] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <i className="fas fa-church text-9xl"></i>
          </div>
          <h2 className="serif text-4xl font-bold mb-12 text-center text-indigo-200">Séries de Mensagens Sugeridas</h2>
          <div className="space-y-16">
            {study.sermonSeriesIdeas.map((series, idx) => (
              <div key={idx} className="relative z-10">
                <h3 className="text-3xl font-bold mb-4 text-white serif border-l-4 border-indigo-500 pl-6">{series.seriesTitle}</h3>
                <p className="text-indigo-200 text-lg mb-8 font-light leading-relaxed max-w-3xl">{series.description}</p>
                <div className="grid sm:grid-cols-2 gap-6">
                  {series.messageOutlines.map((msg, mIdx) => (
                    <div key={mIdx} className="bg-white/5 border border-white/10 p-6 rounded-2xl text-base font-medium hover:bg-white/10 transition-colors backdrop-blur-sm">
                      <span className="text-indigo-400 block mb-2 text-xs uppercase font-bold tracking-widest">Sermão {mIdx + 1}</span>
                      {msg}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Aplicação Pastoral */}
        <section className="pb-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-block p-4 bg-indigo-50 rounded-full mb-8">
              <i className="fas fa-hands-praying text-indigo-600 text-3xl"></i>
            </div>
            <h2 className="serif text-3xl font-bold text-slate-900 mb-8">Palavra Final para a Igreja</h2>
            <div className="prose-bible text-slate-700 italic text-2xl whitespace-pre-wrap serif leading-relaxed">
              "{study.pastoralApplication}"
            </div>
            
            <div className="no-print mt-16 space-y-4">
                <button 
                  type="button"
                  onClick={handleDownloadPDF}
                  className="bg-indigo-900 text-white px-12 py-6 rounded-2xl shadow-2xl hover:bg-indigo-800 active:scale-95 transition-all font-bold flex items-center gap-4 mx-auto text-xl"
                >
                  <i className="fas fa-file-pdf"></i> Download do E-book Ilustrado
                </button>
                <p className="text-slate-400 text-sm">Pronto para impressão em alta qualidade</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default StudyViewer;
