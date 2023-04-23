export type Note = {
  id: number;
  title: string;
  text: string;
  createdAt: number;
  hashtags: string[];
};

export type Topic = {
  title: string;
  createdAt: number;
};

export type Suggestion = {
  title: string;
  createdAt: number;
  topicName: string;
}