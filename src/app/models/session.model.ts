import { Time } from '@angular/common';

export type Session = {
  _id: string;
  code: number;
  name: string;
  startDate: Date;
  startTime: Time;
  movie: {
    _id: string;
    title: string;
  };
  cinema: {
    _id: string;
    name: string;
  };
};
