import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketServer,
} from "@nestjs/websockets";
import { isValidObjectId, Types } from "mongoose";
import { JWTService } from "nest-jwt-module";
import { Socket, Server } from "socket.io";
import { Compare, FindFieldCompare } from "src/helpers/functions";
import { ConnectedUserType, WebSocketResponseI } from "./socket.dto";

type SocketType = "not";

export class SocketUsers {
  public static users: ConnectedUserType[] = [];

  public static findUser(id: Types.ObjectId | string) {
    return FindFieldCompare(SocketUsers.users, "userId", id);
  }

  public static findSocket(socket: SocketType) {
    return (id: string) => {
      if (socket == "not") {
        return SocketUsers.users.find((u) => u.notSocket && Compare(u.notSocket.id, id));
      }
    };
  }

  public static connectedUser(socket: SocketType) {
    return (socketId: string) => {
      const user = SocketUsers.findSocket(socket)(socketId);
      if (!user) return undefined;
      else return user.userId;
    };
  }

  public static connectedUserSocket(socket: SocketType) {
    return (socketId: string): Socket | undefined => {
      const user = SocketUsers.findSocket(socket)(socketId);
      if (!user) return undefined;
      else return user.notSocket;
    };
  }

  public static joinUser(socketType: SocketType) {
    return (socket: Socket, id: Types.ObjectId): void => {
      const user = SocketUsers.findUser(id);
      if (socketType == "not") {
        if (user && user.notSocket) {
          SocketUsers.leaveUser(socketType)(user.notSocket.id);
        }
      }
      SocketUsers.addUser(socketType)(socket, id);
    };
  }

  public static addUser(socketType: SocketType) {
    return (socket: Socket, id: Types.ObjectId): void => {
      const user = SocketUsers.findUser(id);
      if (socketType == "not") {
        if (user) {
          SocketUsers.users = SocketUsers.users.map((u) =>
            Compare(u.userId, id) ? { ...u, notSocket: socket } : u,
          );
        } else {
          SocketUsers.users.push({
            userId: id,
            notSocket: socket,
          });
        }
      }
    };
  }

  public static leaveUser(socketType: SocketType) {
    return (socketId: string): void => {
      const user = SocketUsers.connectedUser(socketType)(socketId);
      const socket = SocketUsers.connectedUserSocket(socketType)(socketId);
      if (user) {
        const { notSocket } = FindFieldCompare(SocketUsers.users, "userId", user);
        if (socketType == "not") {
          // if (mainSocket) {
          //   SocketUsers.users = SocketUsers.users.map((u) =>
          //     Compare(u.userId, user) ? { ...u, notSocket: null } : u,
          //   );
          // } else {
          SocketUsers.users = SocketUsers.users.filter((u) => !Compare(u.userId, user));
          // }
        }
      }
      if (socket) {
        socket.rooms.clear();
      }
    };
  }

  public static getFunctions(socketType: SocketType) {
    return {
      connectedUser: SocketUsers.connectedUser(socketType),
      joinUser: SocketUsers.joinUser(socketType),
      leaveUser: SocketUsers.leaveUser(socketType),
    };
  }
}

export class SocketBaseClass implements OnGatewayDisconnect, OnGatewayConnection, OnGatewayInit {
  private connectedUser: (socketId: string) => Types.ObjectId | undefined;
  private joinUser: (socket: Socket, id: Types.ObjectId) => void;
  private leaveUser: (socketId: string) => void;
  constructor(
    protected readonly jwtService: JWTService,
    private readonly functions: {
      connectedUser: any;
      joinUser: any;
      leaveUser: any;
    },
  ) {
    this.connectedUser = functions.connectedUser;
    this.joinUser = functions.joinUser;
    this.leaveUser = functions.leaveUser;
  }

  @WebSocketServer()
  private server: Server;

  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.leaveUser(client.id);
    client.removeAllListeners();
  }

  async handleConnection(@ConnectedSocket() client: Socket) {
    try {
      const token = (client["token"] as string).replace("Bearer ", "");
      if (!token) {
        client.send({ connected: false, userId: null });
        return;
      }
      const jwtData = await this.jwtService.Verify(token);
      const data = jwtData.data;
      if (!data || !data?.["id"]) {
        client.disconnect(true);
      } else {
        const userId = Types.ObjectId(data["id"]);
        if (isValidObjectId(userId)) {
          this.joinUser(client, userId);
          client.send({ connected: true, userId: userId });
        } else {
          client.disconnect(true);
        }
      }
    } catch (error) {
      console.log(666, error);
      client.disconnect(true);
    }
  }

  afterInit() {
    this.server.use((socket, next) => {
      try {
        const auth = socket.handshake.auth;
        if (auth?.token) {
          socket["token"] = auth.token;
          next();
        } else {
          socket.disconnect(true);
        }
      } catch (error) {
        socket.disconnect(true);
      }
    });
  }

  protected emitServer(room: string, event: string, data: Record<string, unknown>): void {
    this.server.to(room).emit(event, data);
  }

  protected async tryCatch<T>(
    clientId: string,
    func: (user: Types.ObjectId) => Promise<WebSocketResponseI<T>>,
    returnOnCatch: any = { error: "Server Error" },
  ): Promise<any> {
    const userId = this.connectedUser(clientId);
    if (!userId) return Promise.resolve({ error: "User is not connected" });
    try {
      return await func(userId);
    } catch (error) {
      // console.log(error);
      return Promise.resolve(returnOnCatch);
    }
  }
}
