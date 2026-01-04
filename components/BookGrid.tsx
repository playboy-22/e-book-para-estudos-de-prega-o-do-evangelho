
import React from 'react';
import { BIBLE_BOOKS } from '../constants';
import { BibleBook, BibleDivision } from '../types';

interface BookGridProps {
  onSelectBook: (book: BibleBook) => void;
  selectedBookName?: string;
}

const BookGrid: React.FC<BookGridProps> = ({ onSelectBook, selectedBookName }) => {
  const divisions = Object.values(BibleDivision);

  const getDivisionIcon = (division: BibleDivision) => {
    switch (division) {
      case BibleDivision.PENTATEUCH: return 'fa-scroll';
      case BibleDivision.HISTORY: return 'fa-shield-halved';
      case BibleDivision.POETRY: return 'fa-music';
      case BibleDivision.MAJOR_PROPHETS: return 'fa-fire';
      case BibleDivision.MINOR_PROPHETS: return 'fa-leaf';
      case BibleDivision.GOSPELS: return 'fa-dove';
      case BibleDivision.CHURCH_HISTORY: return 'fa-church';
      case BibleDivision.PAULINE_EPISTLES: return 'fa-pen-nib';
      case BibleDivision.GENERAL_EPISTLES: return 'fa-envelope-open-text';
      case BibleDivision.APOCALYPSE: return 'fa-sun';
      default: return 'fa-book';
    }
  };

  return (
    <div className="space-y-16 py-12">
      {divisions.map((division) => {
        const books = BIBLE_BOOKS.filter(b => b.division === division);
        if (books.length === 0) return null;

        return (
          <div key={division} className="relative">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                <i className={`fas ${getDivisionIcon(division)} text-amber-500`}></i>
              </div>
              <h3 className="text-lg font-bold text-white serif tracking-wide">
                {division}
              </h3>
              <div className="flex-grow h-px bg-gradient-to-r from-white/10 to-transparent"></div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {books.map((book) => (
                <button
                  key={book.name}
                  onClick={() => onSelectBook(book)}
                  className={`
                    group relative p-6 rounded-2xl text-left transition-all duration-300 glass
                    ${selectedBookName === book.name 
                      ? 'ring-2 ring-amber-500 bg-amber-500/10 shadow-[0_0_30px_rgba(245,158,11,0.1)]' 
                      : 'glass-hover'
                    }
                  `}
                >
                  <div className="flex flex-col h-full justify-between gap-3">
                    <div className="flex justify-between items-start">
                       <span className={`
                        text-base font-bold transition-colors serif
                        ${selectedBookName === book.name ? 'text-amber-500' : 'text-slate-100 group-hover:text-amber-400'}
                      `}>
                        {book.name}
                      </span>
                      {selectedBookName === book.name && (
                        <i className="fas fa-check-circle text-amber-500 text-xs animate-in zoom-in"></i>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                       <span className="px-2 py-0.5 rounded-md bg-white/5 text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                        {book.chapters} Cap.
                      </span>
                      <div className={`h-1 flex-grow rounded-full bg-white/5 overflow-hidden`}>
                         <div className={`h-full bg-amber-500/40 w-full transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700`}></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Decorative corner */}
                  <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute top-2 right-2 w-1 h-1 bg-amber-500 rounded-full"></div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BookGrid;
