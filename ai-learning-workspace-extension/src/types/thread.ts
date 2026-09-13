export type Message = {
  sender: string;
  text: string;
  timestamp: string;
};

export interface Thread {
  id: number;
  title: string;
  context: string;
  sourceUrl?: string;

  createdAt: string;
  updatedAt: string;

  messages: {
    sender: string;
    text: string;
    timestamp: string;
  }[];
}