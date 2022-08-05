import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/pruduct.data';

@Injectable()
export class SeedService {
  constructor(private productService: ProductsService) {}

  async create() {
    await this.insertNewProducts();
    return 'Seed Excecuted';
  }

  private async insertNewProducts() {
    this.productService.deleteAllProducts();

    const products = initialData.products;
    const insertPromises = products.map((product) =>
      this.productService.create(product),
    );

    await Promise.all(insertPromises);

    return true;
  }
}
