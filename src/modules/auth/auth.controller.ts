import { Body, Res, Req, Get } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CodeDto, ConfirmCodeDto, EmailDto, LoginDto, RegisterDto } from "./auth.dto";
import { Response } from "express";
import { RequestI } from "src/helpers/utils";
import {
  ReturnBadRequest,
  ReturnCreated,
  ReturnError,
  ReturnNotFound,
  ReturnOK,
} from "src/helpers/responses";
import { isString } from "class-validator";
import { JWTService } from "nest-jwt-module";
import { SuperController } from "src/helpers/decorators";
import { RoleEnum } from "../users/users.dto";
import { UseCatch } from "src/helpers/decorators/endpoint.helpers";

@SuperController("auth")
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly jwtService: JWTService) {}

  @UseCatch(true)
  @AuthEndpoint("GET", "token")
  async auth(@Req() req: RequestI, @Res() res: Response) {
    const user = await this.authService.getUser(req.user.id);
    if (!user) return ReturnNotFound(res);
    const jwt = await this.jwtService.GenerateToken({ id: user._id });
    return ReturnOK(res, { user }, { token: jwt });
  }

  @UseCatch(true)
  @AuthEndpoint("POST", "login")
  async login(@Body() requestBody: LoginDto, @Res() res: Response) {
    const resp = await this.authService.login(requestBody);
    if (resp) {
      if (isString(resp)) return ReturnBadRequest(res, resp);
      const [user, token] = await Promise.all([
        this.authService.getUser(resp._id),
        this.jwtService.GenerateToken({ id: resp._id }),
      ]);
      return ReturnOK(res, { user }, { token });
    } else {
      return ReturnError(res);
    }
  }

  @UseCatch(true)
  @AuthEndpoint("POST", "register")
  async Register(@Body() body: RegisterDto, @Res() res: Response) {
    const resp = await this.authService.register(body);
    if (body.role != RoleEnum.student && !isString(body.telephone))
      return ReturnBadRequest(res, "Wrong telephone");
    if (resp) return ReturnCreated(res, { status: resp });
    else ReturnError(res);
  }

  @UseCatch(true)
  @AuthEndpoint("POST", "forgotpassword")
  async forgotPass(@Body() data: EmailDto, @Res() res: Response) {
    const resp = await this.authService.forgotPassword(data.email);
    if (resp) return ReturnOK(res, { status: resp });
    return ReturnError(res);
  }

  @UseCatch(true)
  @AuthEndpoint("POST", "confirmcode")
  async confirmCode(@Body() data: ConfirmCodeDto, @Res() res: Response) {
    const resp = await this.authService.confirmCode(data.code, data.password, data.email);
    const jwt = await this.jwtService.GenerateToken({ id: resp._id });
    return ReturnOK(res, { user: resp }, { token: jwt });
  }

  @UseCatch(true)
  @AuthEndpoint("POST", "confirmregcode")
  async confirmRegistrationCode(@Body() data: CodeDto, @Res() res: Response) {
    const resp = await this.authService.confirmCodeForRegistration(data.code, data.email);
    const jwt = await this.jwtService.GenerateToken({ id: resp._id });
    return ReturnOK(res, { user: resp }, { token: jwt });
  }
}
