import { Prop, Schema } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { CreateSchema } from "src/helpers/functions";

export type NotificationDocument = Notification & Document;

@Schema()
export class Notification {
  @Prop()
  type: string;

  @Prop({ default: false })
  seen?: boolean;

  @Prop()
  userId: Types.ObjectId;

  @Prop()
  metaData: string;

  @Prop({ type: Object })
  data: Record<string, string | Types.ObjectId | number>;

  @Prop()
  date: Date;

  @Prop({ default: "" })
  link?: string;
}

export const NotificationSchema = CreateSchema(Notification);
