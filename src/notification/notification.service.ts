import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Notification, NotificationDocument } from "src/models/notifications.model";
import { PaginationDto } from "src/helpers/dtos/data.dto";
import { FindFieldCompare } from "src/helpers/functions";
import { SocketUsers } from "src/socket/socket.base";
import { User, UserDocument } from "src/models/users.model";

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notsModel: Model<NotificationDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private _configs: ConfigService,
  ) {}

  async getNotifications(userId: Types.ObjectId, body: PaginationDto): Promise<any> {
    return Promise.all([
      this.notsModel
        .find({ userId })
        .populate("data.userId", ["avatar"], this.userModel)
        .sort({ date: -1 })
        .skip(body.limit * body.page)
        .limit(+body.limit),
      this.notsModel.countDocuments({ userId }),
      this.notsModel.countDocuments({ userId, seen: false }),
    ]);
  }

  async getNotification(notId: any): Promise<any> {
    return this.notsModel.findById(notId).populate("data.userId", ["avatar"], this.userModel);
  }

  async sendNotification(
    userId: Types.ObjectId,
    type: string,
    data: string,
    _data: Record<string, unknown>,
  ) {
    try {
      const not = await this.notsModel.create({
        date: new Date(),
        userId,
        type: type,
        metaData: data,
        data: _data,
      });

      if (not) {
        const users = SocketUsers.users;
        const socketUser = FindFieldCompare(users, "userId", userId);
        if (socketUser) {
          socketUser?.notSocket.emit("not", not);
        } else {
          console.log("Socket user is not found");
        }
      }

      return not;
    } catch (e) {
      // console.error(e);
    }
  }

  async seeNotification(notId: string) {
    return this.notsModel.findByIdAndUpdate(notId, { seen: true });
  }

  async seeAllNotifications(userId: Types.ObjectId) {
    return this.notsModel.updateMany({ userId }, { seen: true });
  }

  async getUserNotification(userId: Types.ObjectId, page: number, limit: number) {
    const [nots, count, notSeenNotsCount] = await Promise.all([
      this.notsModel
        .find({ userId })
        .populate("userId", ["name", "avatar"], this.userModel)
        .sort({ date: -1 })
        .skip(+page * +limit)
        .limit(+limit),
      this.notsModel.countDocuments({ userId }),
      this.notsModel.countDocuments({
        userId,
        seen: false,
      }),
    ]);
    return { nots, count, notSeenNotsCount };
  }
}
