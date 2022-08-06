import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class FilesService {
  constructor(private readonly configService: ConfigService) {}

  getStaticProductImage(imageName: string) {
    const path = join(__dirname, '../../static/products', imageName);
    if (!existsSync(path))
      throw new BadRequestException('No product found with image:' + imageName);

    return path;
  }

  getSecureUrlFile(file: Express.Multer.File, pathFolder: string): string {
    if (!file) {
      throw new BadRequestException('Make sure that the file is an image');
    }

    const nameHost: string = this.configService.get('HOST_API');
    const path = '/v1/files/' + pathFolder;
    const nameFile = '/' + file.filename;

    const secureUrlFile = nameHost + path + nameFile;

    return secureUrlFile;
  }
}
