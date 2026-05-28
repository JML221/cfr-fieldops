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
