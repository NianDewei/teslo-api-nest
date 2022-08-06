import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { FilesService } from './files.service';
import { fileFilter } from './helpers/fileFilter.helpers';
import { fileName } from './helpers/fileNamer.helpers';

const configUpload = {
  fileFilter,
  // limits: { fileSize: 1000 },
  storage: diskStorage({
    destination: './static/products',
    filename: fileName,
  }),
};

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get('products/:imageName')
  findProductImage(
    @Param('imageName') imageName: string,
    @Res() res: Response,
  ) {
    const path = this.filesService.getStaticProductImage(imageName);

    return res.status(200).sendFile(path);
  }

  @Post('products')
  @UseInterceptors(FileInterceptor('file', configUpload))
  uploadProductImage(@UploadedFile() file: Express.Multer.File) {
    const pathFolder = 'products';
    const secureUrlofImage = this.filesService.getSecureUrlFile(
      file,
      pathFolder,
    );

    return { secureUrlofImage };
  }
}
