import { Injectable, NestMiddleware } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Response } from "express";
import { isValidObjectId, Model } from "mongoose";
import { ReturnUnauthorized } from "src/helpers/responses";
import { RequestI } from "src/helpers/utils";
import { User, UserDocument } from "src/models/users.model";

@Injectable()
export class UserMiddleware implements NestMiddleware {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async use(req: RequestI, res: Response, next: () => any) {
    if (req.user) {
      if (req.user.id && isValidObjectId(req.user.id)) {
        const user = await this.userModel.findById(req.user.id);
        if (user) req.userDoc = user;
        if (!user) return ReturnUnauthorized(res);
      }
    }
    next();
  }
}
