import { Injectable } from '@nestjs/common';
import { v2 } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService) {}

  async uploadImage(file: Express.Multer.File) {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        {
          folder: 'users',
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      upload.end(file.buffer);
    });
  }

  async deleteImage(publicId: string) {
    return v2.uploader.destroy(publicId);
  }
}
