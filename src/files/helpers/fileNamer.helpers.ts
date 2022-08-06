import { v4 as uuid } from 'uuid';

export const fileName = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: (value: null | Error, answerIs: string) => void,
) => {
  const fileExtension = file.mimetype.split('/')[1];

  const fileNameForStorage = `${uuid()}.${fileExtension}`;

  callback(null, fileNameForStorage || '');
};
