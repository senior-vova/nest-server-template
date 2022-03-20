import { Body, Res, Req, UploadedFile, Param, Query } from "@nestjs/common";
import { Response } from "express";
import { UserService } from "./users.service";
import { UploadAvatarDto, UpdateUser, GetUsersByNameQuery } from "./users.dto";
import { ReturnOK } from "src/helpers/responses";
import { isValidObjectId, Types } from "mongoose";
import { RequestI } from "src/helpers/utils";
import { PaginationQuery } from "src/helpers/dtos/query.dto";
import { Endpoint, SuperController } from "src/helpers/decorators";
import { ApiBearerAuth } from "@nestjs/swagger";

@SuperController("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @Endpoint("GET", ":id", "NONE")
  async GetUser(@Res() res: Response, @Req() req: RequestI, @Param("id") id: string) {
    const user = await this.userService.GetUser(req?.user?.id, Types.ObjectId(id));
    return ReturnOK(res, { user });
  }

  @Endpoint("POST", "byname", "NONE")
  async GetUsersByName(@Res() res: Response, @Body() query: GetUsersByNameQuery) {
    const [users, count] = await this.userService.GetUsersByName(query);
    return ReturnOK(res, { users }, { page: query.page, limit: query.limit, count });
  }

  @Endpoint("GET", ":id/connections/count")
  async GetUserConnectionsCount(@Res() res: Response, @Param("id") id: string) {
    const connections = await this.userService.GetUserConnectionsCount(Types.ObjectId(id));
    return ReturnOK(res, connections);
  }

  @Endpoint("GET", ":id/connections/followings")
  async GetUserConnectionsFollowings(
    @Res() res: Response,
    @Param("id") id: string,
    @Query() query: PaginationQuery,
  ) {
    const connections = await this.userService.GetUserConnectionsFollowings(
      Types.ObjectId(id),
      +query.page,
      +query.limit,
    );
    return ReturnOK(res, connections);
  }

  @Endpoint("GET", ":id/connections/followers")
  async GetUserConnectionsFollowers(
    @Req() req: RequestI,
    @Res() res: Response,
    @Param("id") id: string,
    @Query() query: PaginationQuery,
  ) {
    const connections = await this.userService.GetUserConnectionsFollowers(
      req.user.id,
      Types.ObjectId(id),
      +query.page,
      +query.limit,
    );
    return ReturnOK(res, connections);
  }

  @Endpoint("PUT", ":id/follow")
  async FollowUser(@Req() req: RequestI, @Res() res: Response, @Param("id") id: string) {
    if (!isValidObjectId(id)) return Promise.reject("Invalid id");
    const resp = await this.userService.Follow(req.user.id, id);
    return ReturnOK(res, { user: resp });
  }

  @Endpoint("PUT", "uploadavatar", "USER", { fileInterceptor: "avatar" })
  async UploadAvatar(
    @Body() reqBody: UploadAvatarDto,
    @Req() req: RequestI,
    @Res() res: Response,
    @UploadedFile() avatar: any,
  ) {
    const user = await this.userService.UpdateAvatar(req.user.id, avatar?.filename, avatar);
    return ReturnOK(res, { user });
  }

  @Endpoint("PUT", "update")
  async UpdateUser(@Body() body: UpdateUser, @Req() req: RequestI, @Res() res: Response) {
    const user = await this.userService.UpdateUser(req.user.id, body);
    return ReturnOK(res, { user });
  }
}
