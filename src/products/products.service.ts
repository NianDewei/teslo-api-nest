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
  async findAll() {
    const products = await this.productRepository.find();
    return products;
  }

  async findOne(id: string) {
    // const product = await this.productRepository.findOneByOrFail({ id });
    const product = await this.productRepository.findOneBy({ id });
    if (!product)
      throw new NotFoundException(`Product with id ${id} not found`);

    return product;
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
}
