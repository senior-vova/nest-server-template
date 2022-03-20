import { Types } from "mongoose";
import { Socket } from "socket.io";

export type ConnectedUserType = {
  userId: Types.ObjectId;
  notSocket: Socket;
};

export type WebSocketResponseI<T> = { error?: string } | void | T;
