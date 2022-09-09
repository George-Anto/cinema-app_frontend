import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CalculateDistanceService {
  constructor() {}

  //This function takes in latitude and longitude of two location and returns the distance
  //between them as the crow flies (in km)
  calcDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const newLat1 = this.toRad(lat1);
    const newLat2 = this.toRad(lat2);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) *
        Math.sin(dLon / 2) *
        Math.cos(newLat1) *
        Math.cos(newLat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d;
  }

  // Converts numeric degrees to radians
  private toRad(Value: number) {
    return (Value * Math.PI) / 180;
  }
}
