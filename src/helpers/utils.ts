import { Request } from "express";
import { Types } from "mongoose";
import { UserDocument } from "src/models/users.model";

export interface RequestI extends Request {
  user?: {
    id?: Types.ObjectId;
  };
  userDoc?: UserDocument;
}
