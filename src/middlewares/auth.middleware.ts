import { Injectable, NestMiddleware } from "@nestjs/common";
import { Response } from "express";
import { isValidObjectId, Types } from "mongoose";
import { JWTService } from "nest-jwt-module";
import { RequestI } from "src/helpers/utils";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private jwtService: JWTService) {}

  async use(req: RequestI, res: Response, next: () => any) {
    const token = req.headers["Authorization"] || req.headers["authorization"];
    if (token) {
      try {
        const resp = await this.jwtService.Verify((token as string).replace("Bearer ", ""));
        const data = resp.data;
        if (data) {
          req.user = data as Record<string, any>;
          const id = data["id"];
          if (isValidObjectId(id)) {
            req.user.id = Types.ObjectId(data["id"]);
          }
        }
      } catch (error) {
        // console.log(error);
      }
    }
    next();
  }
}
