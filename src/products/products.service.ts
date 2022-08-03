import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { validate as isUUID } from 'uuid';
// import { isUUID } from 'class-validator';

@Injectable()
export class ProductsService {
  // injected in the constructor -> respository for product
  private readonly logger = new Logger('ProductsService');
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const product = this.productRepository.create(createProductDto);
      await this.productRepository.save(product);

      return product;
    } catch (err) {
      this.handleException(err);
    }
  }

  // TODO paginar
  async findAll(paginateDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginateDto;

    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
      // TODO: relations
    });

    return products;
  }

  async findOne(term: string) {
    let product: Product;
    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({ id: term });
    } else {
      product = await this.productRepository.findOneBy({ slug: term });
    }

    if (!product) {
      throw new NotFoundException(`Product with ${term} not found`);
    }

    return product;
    // TODO: optional
    // const product = [];
    // if (isUUID(term)) {
    //   product.push(await this.productRepository.findOneBy({ id: term }));
    // }
    // product.push(await this.productRepository.findOneBy({ slug: term }));
    // if (!product[0]) {
    //   throw new NotFoundException(`Product with ${term} not found`);
    // }
    // return product[0];
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: string) {
    // try {
    //   await this.productRepository.delete(id);
    //   const message = 'Delete Success';
    //   return { message };
    // } catch (err) {
    //   throw new BadRequestException({ err });
    // }
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }

  private handleException(err: any) {
    // console.error(err);
    if (err.code === '23505') {
      throw new BadRequestException(err.detail);
    }
    this.logger.error(err);
    throw new InternalServerErrorException(
      'We apologize for the problems, if the problem persists, please contact the administrator.',
    );
  }

  // private isArrayNull(arr: any): boolean {
  //   return arr.every((element: any) => element === null);
  // }
}
