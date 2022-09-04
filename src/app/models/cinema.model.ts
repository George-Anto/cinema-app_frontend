export type Cinema = {
  _id: string;
  name: string;
  photo: string;
  code: number;
  // seatsLayout: Array<number>;
  seatsLayout: number[][];
  seatsAvailable: number;
  startDate: Date;
  endDate: Date;
  location: { longitude: number; latitude: number };
  active: boolean;
};
