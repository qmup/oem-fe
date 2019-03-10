export class Shared {
  id: number;
  name: string;
}

export class PaginationResponse {
  content: any[];
  totalPages: number;
  totalElements: number;
  last: boolean;
  numberOfElements: number;
  sort: any;
  first: boolean;
  size: number;
  number: number;
}
