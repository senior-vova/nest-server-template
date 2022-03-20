import { Model, Types } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { LoginDto, RegisterDto } from "./auth.dto";
import * as moment from "moment";
import * as sha1 from "sha1";
import { MailService } from "src/mail/mail.service";
import { MessagesTypesEnum } from "src/mail/mail.data";
import { projections } from "../users/users.dto";
import { Random6Code } from "src/helpers/functions";
import { MESSAGE } from "src/helpers/messages";
import { RoleEnum, User, UserDocument } from "src/models/users.model";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private readonly mailService: MailService,
  ) {}

  async login(body: LoginDto): Promise<any> {
    let em = await this.userModel.findOne({ email: body.email });
    if (!em) return Promise.resolve(MESSAGE.AUTH.WRONG_LOGIN_OR_PASS);
    const user = await this.userModel.findOne({
      email: body.email,
      password: this.hashPassword(body.password),
    });
    if (!user) {
      if (
        em.privateInfo.blockedTime !== null &&
        moment(new Date()).diff(moment(em.privateInfo.blockedTime), "minute") < 0
      )
        return Promise.resolve(
          MESSAGE.AUTH.TRY_LOGIN_AFTER(
            -1 * moment(new Date()).diff(moment(em.privateInfo.blockedTime), "minute"),
          ),
        );
      em = await this.userModel.findOneAndUpdate(
        { email: body.email },
        {
          "privateInfo.attempts": em.privateInfo.attempts + 1,
          "privateInfo.blockedTime": null,
        },
        { new: true },
      );
      if (em.privateInfo.attempts >= 3) {
        em = await this.userModel.findOneAndUpdate(
          { email: body.email },
          {
            "privateInfo.attempts": 0,
            "privateInfo.blockedTime": moment(new Date()).add(3, "minute").toDate(),
          },
          { new: true },
        );
        return Promise.resolve(MESSAGE.AUTH.WRONG_ATTEMPT_LEFT(3));
      }
      return Promise.resolve(MESSAGE.AUTH.WRONG_ATTEMPT_LEFT(3 - em.privateInfo.attempts));
    } else {
      if (user.privateInfo.isBlock) return Promise.resolve(MESSAGE.AUTH.IS_BLOCKED);
      if (
        em.privateInfo.blockedTime !== null &&
        moment(new Date()).diff(moment(em.privateInfo.blockedTime), "minute") < 0
      )
        return Promise.resolve(
          MESSAGE.AUTH.TRY_LOGIN_AFTER(
            -1 * moment(new Date()).diff(moment(em.privateInfo.blockedTime), "minute"),
          ),
        );
      if (!user.privateInfo.isActive) {
        await this.userModel.findOneAndUpdate(
          { email: body.email },
          { "privateInfo.attempts": 0, "privateInfo.blockedTime": null },
        );
        const code = Random6Code();
        await this.sendCodeToMail(body.email, code);
        return Promise.resolve(MESSAGE.AUTH.IS_NOT_ACTIVE(body.email));
      }
      return await this.userModel.findOneAndUpdate(
        { email: body.email },
        { "privateInfo.attempts": 0, "privateInfo.blockedTime": null },
        { new: true, projection: projections.base },
      );
    }
  }

  async register(body: RegisterDto): Promise<any> {
    const user = await this.userModel.findOne({ email: body.email });
    if (!user) {
      try {
        const code = Random6Code();
        await this.userModel.create({
          name: body.name,
          email: body.email,
          role: RoleEnum.USER,
          password: this.hashPassword(body.password),
          "privateInfo.fpCode": code,
        });
        await this.mailService.sendMailMsg(body.email, MessagesTypesEnum.AUTH, code);
        return Promise.resolve(MESSAGE.AUTH.CODE_SENT_TO_EMAIL(body.email));
      } catch (error) {
        return Promise.reject();
      }
    } else {
      return Promise.reject(MESSAGE.AUTH.USER_IS_EXIST);
    }
  }

  async getUser(id: Types.ObjectId): Promise<UserDocument> {
    return this.userModel.findById(id, projections.self);
  }

  async forgotPassword(email: string): Promise<any> {
    const user = await this.userModel.findOne({ email });
    if (user) {
      return this.sendCodeToMail(email, Random6Code());
    } else {
      return Promise.reject(MESSAGE.AUTH.INCORRECT_EMAIL);
    }
  }

  async sendCodeToMail(email: string, code: number): Promise<any> {
    try {
      await Promise.all([
        this.userModel.findOneAndUpdate({ email }, { "privateInfo.fpCode": code }),
        this.mailService.sendMailMsg(email, MessagesTypesEnum.CODE, code),
      ]);
      return Promise.resolve(MESSAGE.AUTH.CODE_SENT_TO_EMAIL(email));
    } catch (error) {
      return Promise.reject();
    }
  }

  async confirmCode(code: number, newPass: string, email: string): Promise<any> {
    const user = await this.userModel.findOne({
      email,
      "privateInfo.fpCode": code,
    });
    if (!user) return Promise.reject(MESSAGE.AUTH.INCORRECT_CONFIRM_CODE);
    return this.userModel.findByIdAndUpdate(
      user._id,
      {
        "privateInfo.fpCode": null,
        "privateInfo.isActive": true,
        "privateInfo.attempts": 0,
        password: this.hashPassword(newPass),
      },
      { new: true, projection: projections.base },
    );
  }

  async confirmCodeForRegistration(code: number, email: string): Promise<any> {
    const user = await this.userModel.findOne({
      email,
      "privateInfo.fpCode": code,
    });
    if (!user) return Promise.reject(MESSAGE.AUTH.INCORRECT_CONFIRM_CODE);
    return this.userModel.findByIdAndUpdate(
      user._id,
      {
        "privateInfo.fpCode": null,
        "privateInfo.isActive": true,
        "privateInfo.attempts": 0,
      },
      { new: true, projection: projections.base },
    );
  }

  private hashPassword(password: string) {
    return sha1(
      `6f9b9af3cd6e8b8a73c2cdced37fe9f59226e27d${password}d72e62295f9ef73decdc2c37a8b8e6dc3fa9b9f6`,
    );
  }
}
