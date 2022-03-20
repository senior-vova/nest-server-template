import { ExecutionContext, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Observable } from "rxjs";
import { UserDocument } from "src/models/users.model";
import { RequestI } from "../utils";

@Injectable()
export class UserAuthGuard {
  constructor(
    @InjectModel("UserModel")
    private readonly userModel: Model<UserDocument>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean | Observable<boolean>> {
    const request: RequestI = context.switchToHttp().getRequest();
    if (request.user && request.user.id) {
      const user = await this.userModel.findById(request.user.id);
      if (user) {
        return Promise.resolve(true);
      }
    }
    return Promise.resolve(false);
  }
}
