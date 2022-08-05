import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';

@Injectable()
export class SeedService {
  constructor(private productService: ProductsService) {}

  async create() {
    await this.insertNewProducts();
    return 'Seed Excecuted';
  }

  private async insertNewProducts() {
    this.productService.deleteAllProducts();
    return true;
  }
}
