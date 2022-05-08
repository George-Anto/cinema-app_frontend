export type Movie = {
  _id: string;
  title: string;
  year: number;
  runtime: number;
  released: Date;
  plot: string;
  fullplot: string;
  directors: string;
  cast: string;
  imdb: { rating: number; votes: number };
  tomatoes: { rating: number; votes: number };
  posters: string;
};
