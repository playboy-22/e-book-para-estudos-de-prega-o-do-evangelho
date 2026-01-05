
export enum BibleDivision {
  PENTATEUCH = 'Pentateuco',
  HISTORY = 'Livros Históricos',
  POETRY = 'Poesia e Sabedoria',
  MAJOR_PROPHETS = 'Profetas Maiores',
  MINOR_PROPHETS = 'Profetas Menores',
  GOSPELS = 'Evangelhos',
  CHURCH_HISTORY = 'História da Igreja',
  PAULINE_EPISTLES = 'Epístolas Paulinas',
  GENERAL_EPISTLES = 'Epístolas Gerais',
  APOCALYPSE = 'Apocalíptico'
}

export interface BibleBook {
  name: string;
  division: BibleDivision;
  chapters: number;
}

export interface StudyContent {
  bookName: string;
  title: string;
  introduction: string;
  historicalContext: string;
  theologicalThemes: {
    title: string;
    description: string;
  }[];
  chapterOutlines: {
    chapterRange: string;
    summary: string;
    homileticalPoints: string[];
  }[];
  wordStudies: {
    originalWord: string;
    transliteration: string;
    meaning: string;
    significance: string;
  }[];
  sermonSeriesIdeas: {
    seriesTitle: string;
    description: string;
    messageOutlines: string[];
  }[];
  pastoralApplication: string;
  visualMetaphor: {
    description: string;
    concept: string;
    imageKeywords: string;
  };
  generatedImageBase64?: string;
}

export interface SavedStudy {
  id: string;
  bookName: string;
  createdAt: string;
  content: StudyContent;
}

// Declaração para o TypeScript não reclamar do process.env no navegador
declare global {
  interface Window {
    process: {
      env: {
        [key: string]: string | undefined;
      };
    };
  }
}
