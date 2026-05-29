export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export interface Challenge {
  id: string;
  title: string;
  region: string;
  summary: string;
  status: 'active' | 'coming_soon';
  tags: string[];
}

export interface ArmedGroup {
  name: string;
  type: string;
  geography: string;
  status: string;
  engagement_notes: string;
  risks: string;
}

export interface LessonCategory {
  category: string;
  lessons: string[];
}

export interface Source {
  title: string;
  url: string;
}

export interface LessonContent {
  id: string;
  title: string;
  region: string;
  starter_prompts: string[];
  situation_overview: string;
  armed_groups: ArmedGroup[];
  lessons: LessonCategory[];
  sources: Source[];
}
