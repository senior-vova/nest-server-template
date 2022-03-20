import { Prop, Schema } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { CreateSchema } from "src/helpers/functions";

export type TimeoutDocument = Timeout & Document;

export enum TimeoutType {
  FinishLesson = "finish_lesson",
}

@Schema()
export class Timeout {
  @Prop()
  name: string;

  @Prop()
  timeOut: number;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  type: string;

  @Prop({ type: Object })
  data: Record<string, any>;
}

export const TimeoutSchema = CreateSchema(Timeout);
