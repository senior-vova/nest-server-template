import { Model, Types } from "mongoose";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { UpdateUser, projections, GetUsersByNameQuery } from "./users.dto";
import { generateNotificationText, notificationEnum } from "src/notification/notifications.dto";
import { User, UserDocument } from "src/models/users.model";
import { NotificationsService } from "src/notification/notification.service";
import { Compare, FindCompare } from "../../helpers/functions";
import { ConfigService } from "@nestjs/config";
import { MESSAGE } from "src/helpers/messages";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    @Inject(forwardRef(() => NotificationsService))
    private readonly notificationsService: NotificationsService,
    private readonly configService: ConfigService,
  ) {}

  async GetUsersByName(query: GetUsersByNameQuery): Promise<[any[], number]> {
    const nameReg = new RegExp(`${query.name}`);
    const criteria = {
      name: { $regex: nameReg, $options: "i" },
      role: { $in: query.role },
      roleAccepted: true,
    };

    const users = this.userModel
      .find(criteria, { name: 1, status: 1, avatar: 1, role: 1 })
      .skip(+query.page * +query.limit)
      .limit(+query.limit);

    const count = this.userModel.countDocuments(criteria);

    return Promise.all([users, count]);
  }

  async GetUser(reqUserId: Types.ObjectId, id: Types.ObjectId): Promise<any> {
    const [user, isFollowing] = await Promise.all([
      this.userModel.findById(
        id,
        reqUserId && Compare(reqUserId, id) ? projections.self : projections.base,
      ),
      this.IsUserFollowing(reqUserId, id),
    ]);
    return { ...user.toObject(), isFollowing };
  }

  async IsUserFollowing(id: Types.ObjectId, userId: Types.ObjectId): Promise<any> {
    const user = await this.userModel.findById(userId);
    if (user && FindCompare(user.followers, id)) {
      return true;
    } else {
      return false;
    }
  }

  async Follow(followerID: Types.ObjectId, userID: string): Promise<any> {
    if (Compare(followerID, userID)) return Promise.reject();
    const [follower, user] = await Promise.all([
      this.userModel.findById(followerID),
      this.userModel.findById(userID),
    ]);
    if (!user) return Promise.reject(MESSAGE.NOT_FOUND("User"));
    const isFollowed = FindCompare(user.followers, followerID);
    const action = isFollowed
      ? { $pull: { followers: follower._id } }
      : { $addToSet: { followers: follower._id } };

    const [newUser] = await Promise.all([
      this.userModel.findByIdAndUpdate(userID, action, {
        new: true,
        projection: projections.base,
      }),
      new Promise((res) => {
        if (!isFollowed) {
          res(
            this.notificationsService.sendNotification(
              Types.ObjectId(userID),
              notificationEnum.follow,
              generateNotificationText.follow(follower.name),
              { name: follower.name, userId: follower._id },
            ),
          );
        } else {
          res(null);
        }
      }),
    ]);
    return newUser;
  }

  async GetUserConnectionsCount(id: Types.ObjectId): Promise<any> {
    const user = await this.userModel.findById(id);
    if (!user) return Promise.reject(MESSAGE.NOT_FOUND("User"));
    const followingsCount = await this.userModel.countDocuments({
      followers: { $in: [user._id] },
    });
    return { followingsCount, followersCount: user.followers.length };
  }

  async GetUserConnectionsFollowers(
    reqUserId: Types.ObjectId,
    id: Types.ObjectId,
    page: number,
    limit: number,
  ): Promise<any> {
    const user = await this.userModel.findById(id);

    const followers = await this.userModel.aggregate([
      {
        $match: {
          _id: {
            $in: user.followers.filter((_id) => !Compare(_id, reqUserId)),
          },
        },
      },
      {
        $skip: page * limit,
      },
      {
        $limit: +limit,
      },
      {
        $addFields: {
          foll: {
            $reduce: {
              input: "$followers",
              initialValue: "",
              in: {
                $concat: [{ $toString: "$$value" }, { $toString: "$$this" }],
              },
            },
          },
        },
      },
      {
        $project: {
          name: 1,
          avatar: 1,
          role: 1,
          isFollowing: {
            $regexMatch: {
              input: "$foll",
              regex: new RegExp(String(reqUserId)),
              options: "i",
            },
          },
        },
      },
    ]);

    return { followers, followersCount: user.followers.length, page: +page };
  }

  async GetUserConnectionsFollowings(
    id: Types.ObjectId,
    page: number,
    limit: number,
  ): Promise<any> {
    const user = await this.userModel.findById(id);

    const followingsCount = await this.userModel.countDocuments({
      followers: { $in: [user._id] },
    });

    if (!user) return Promise.reject(MESSAGE.NOT_FOUND("User"));
    const followings = await this.userModel
      .find(
        {
          followers: { $in: [user._id] },
        },
        {
          avatar: 1,
          name: 1,
          role: 1,
        },
      )
      .skip(page * limit)
      .limit(+limit);
    return { followings, followingsCount, page: +page };
  }

  async UpdateUser(id: Types.ObjectId, data: UpdateUser): Promise<any> {
    const user = await this.userModel.findById(id);
    return this.userModel.findByIdAndUpdate(
      id,
      { name: data.name },
      {
        new: true,
        projection: projections.self,
      },
    );
  }

  async UpdateAvatar(id: Types.ObjectId, filename: string, avatar: any): Promise<any> {
    return this.userModel.findByIdAndUpdate(
      id,
      { avatar: filename },
      {
        new: true,
        projection: projections.self,
      },
    );
  }
}
