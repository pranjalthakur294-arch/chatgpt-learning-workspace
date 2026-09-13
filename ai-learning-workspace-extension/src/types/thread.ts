export type MessageType = "chat" | "explanation" | "quiz" | "practice";

export interface QuizData {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  selectedIndex?: number;
}

export interface PracticeData {
  scenario: string;
  task: string;
  hint?: string;
  solution: string;
  solutionVisible?: boolean;
}

export type Message = {
  sender: string;
  text: string;
  timestamp: string;
  type?: MessageType;
  quiz?: QuizData;
  practice?: PracticeData;
};

export interface Thread {
  id: number;
  title: string;
  context: string;
  sourceUrl?: string;

  createdAt: string;
  updatedAt: string;

  messages: Message[];
}