import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from "@nestjs/websockets";
import { Types } from "mongoose";
import { Socket } from "socket.io";
import { JWTService } from "nest-jwt-module";
import { SocketBaseClass, SocketUsers } from "./socket.base";
import { PaginationDto } from "src/helpers/dtos/data.dto";
import { NotificationsService } from "src/notification/notification.service";

@WebSocketGateway({ namespace: "nots" })
export class NotificationsEventsGateway extends SocketBaseClass {
  constructor(
    protected readonly jwtService: JWTService,
    private readonly notsService: NotificationsService,
  ) {
    super(jwtService, SocketUsers.getFunctions("not"));
  }

  @SubscribeMessage("get-notifications")
  async getNotifications(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: PaginationDto,
  ): Promise<any> {
    return await this.tryCatch(
      client.id,
      async (userId) => {
        const [nots, count, notSeenCount] = await this.notsService.getNotifications(userId, body);
        return Promise.resolve({ nots, count, page: +body.page, limit: +body.limit, notSeenCount });
      },
      { nots: [], count: 0, page: 0, limit: 5, notSeenCount: 0 },
    );
  }

  @SubscribeMessage("see-not")
  async seeNot(@ConnectedSocket() client: Socket, @MessageBody() data: any): Promise<any> {
    return await this.tryCatch(client.id, async (userId) => {
      const not = await this.notsService.seeNotification(data.notId);
      if (not) return Promise.resolve({ seen: true, id: not.id });
      else return Promise.resolve({ error: "Notification is not found" });
    });
  }

  @SubscribeMessage("see-all")
  async seeAll(@ConnectedSocket() client: Socket): Promise<any> {
    return await this.tryCatch(client.id, async (userId) => {
      await this.notsService.seeAllNotifications(userId);
      return Promise.resolve({ seen: true });
    });
  }
}
