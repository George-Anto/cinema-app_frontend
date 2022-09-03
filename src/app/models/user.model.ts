export class User {
  constructor(
    public jsonToken: string,
    public role: string,
    public id: string,
    public name: string,
    public surname: string,
    public username: string,
    public email: string,
    public mobilePhone: string,
    public photo?: string,
    public age?: number,
    public isColorBlind?: boolean,
    public favoriteDays?: FavoriteDays,
    public genres?: Genres,
    public address?: Address,
    public hasChildren?: boolean,
    public friends?: string[]
  ) {}
}

export type FavoriteDays = {
  sunday: boolean;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
};

export type Genres = {
  Action: boolean;
  Comedy: boolean;
  Drama: boolean;
  Fantasy: boolean;
  Horror: boolean;
  Mystery: boolean;
  Romance: boolean;
  Thriller: boolean;
  Western: boolean;
};

export type Address = {
  street: string;
  number: number;
  district: string;
  city: string;
  latitude: number;
  longitude: number;
};
