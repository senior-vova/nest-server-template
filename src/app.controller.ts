import { Body, Param, Res, UploadedFile } from "@nestjs/common";
import { Response } from "express";
import { ReturnOK } from "./helpers/responses";
import { Endpoint, SuperController } from "./helpers/decorators";
import { ApiProperty } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";
import { join } from "path";
import { existsSync } from "fs";

class FileUploadDto {
  @ApiProperty({ type: "file" })
  readonly file?: any;
}

@SuperController("")
export class AppController {
  private readonly server_url: string;
  constructor(private readonly configService: ConfigService) {
    this.server_url = configService.get("SERVER_URL");
  }

  @Endpoint("GET", "uploads/:filename", "NONE", { useCatch: false })
  async getImage(@Param("filename") filename: string, @Res() res: Response) {
    if (filename && existsSync(join(__dirname, "..", "..", "uploads", filename))) {
      return res.sendFile(filename, { root: "./uploads" });
    }
    return res.sendFile("default.jpg", { root: "./static" });
  }

  @Endpoint("GET", "uploads/:filename/download", "NONE", { useCatch: false })
  async downloadImage(@Param("filename") filename: string, @Res() res: Response) {
    return res.download(`./uploads/${filename}`);
  }

  @Endpoint("POST", "uploads", "USER", { fileInterceptor: "file", useCatch: false })
  async uploadImage(@Body() body: FileUploadDto, @Res() res: Response, @UploadedFile() file: any) {
    return ReturnOK(res, {
      url: `${this.server_url}/uploads/${file?.filename}`,
    });
  }
}
