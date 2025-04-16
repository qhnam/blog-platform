export class PaginatedResponse<T, Y> {
  public items: Array<T>;
  public page: number;
  public limit: number;
  public hasNextPage: boolean;
  public hasPrevPage: boolean;
  public totalItems: number;
  public totalPages: number;
  public additionalInfo: Y | null;

  constructor(data: {
    items: T[];
    page: number;
    limit: number;
    totalItems: number;
    additionalInfo?: Y;
  }) {
    this.items = data.items;
    this.page = data.page;
    this.limit = data.limit;
    this.totalItems = data.totalItems;
    this.totalPages = Math.ceil(this.totalItems / this.limit) || 0;
    this.hasNextPage = this.page < this.totalPages;
    this.hasPrevPage = this.page > 1;
    this.additionalInfo = data.additionalInfo ?? null;
  }
}
