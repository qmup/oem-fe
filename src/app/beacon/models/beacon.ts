import { Place } from 'src/app/place/models/place';

export class Beacon {
  id: number;
  workplace: Place;
  workplaceId: number;
  description: string;
  name: string;
  placeName: string;

  constructor() {
    this.id = 0;
    this.workplaceId = 0;
    this.description = '';
    this.name = '';
  }
}
