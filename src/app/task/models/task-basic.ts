export class TaskBasic {
  description: string;
  duration: number;
  id: number;
  picture: string;
  title: string;

  constructor() {
    this.description = '';
    this.duration = 0;
    this.id = 0;
    this.picture = '';
    this.title = '';
  }
}
