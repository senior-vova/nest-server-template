import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { RequestI } from "../utils";

export const CreateFileInterceptor = (field: string) => {
  return FileInterceptor(field, {
    storage: diskStorage({
      destination: "./uploads",
      filename: (req: RequestI, file: any, cb: any) => {
        cb(null, file ? `${Date.now()}-${file.originalname}` : null);
      },
    }),
    limits: {
      fileSize: parseInt(process.env.IMAGE_SIZE_BY_BYTE),
    },
  });
};
