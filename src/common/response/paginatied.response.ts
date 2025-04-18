import { HttpStatus } from '@nestjs/common';

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
    page?: number;
    limit?: number;
    totalItems: number;
    additionalInfo?: Y;
  }) {
    this.items = data.items;
    this.page = data.page ?? 1;
    this.limit = data.limit ?? 20;
    this.totalItems = data.totalItems;
    this.totalPages = Math.ceil(this.totalItems / this.limit) || 0;
    this.hasNextPage = this.page < this.totalPages;
    this.hasPrevPage = this.page > 1;
    this.additionalInfo = data.additionalInfo ?? null;
  }

  call(message: string = 'Get list successfully') {
    return {
      status: 'success',
      message: message,
      items: this.items,
      meta: {
        page: this.page,
        limit: this.limit,
        hasNextPage: this.hasNextPage,
        hasPrevPage: this.hasPrevPage,
        totalItems: this.totalItems,
        totalPages: this.totalPages,
      },
      additionalInfo: this.additionalInfo,
      errorCode: null,
      statusCode: HttpStatus.OK,
    };
  }
}
