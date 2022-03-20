import { Prop, raw, Schema } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { CreateSchema } from "src/helpers/functions";

export type UserDocument = User & Document;

interface PrivateTechnicalInfoI {
  attempts?: number;
  fpCode?: number | null;
  isActive?: boolean;
  isBlock?: boolean;
  blockedTime?: Date;
  stripeCustomerId?: string;
}

export enum RoleEnum {
  ADMIN = "admin",
  USER = "user",
}

@Schema({})
export class User {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  password?: string;

  @Prop(
    raw({
      attempts: { type: Number, default: 0 },
      fpCode: { type: Number || null },
      isActive: { type: Boolean, default: false },
      isBlock: { type: Boolean, default: false },
      blockedTime: { type: Date, default: null },
      stripeCustomerId: { type: String, default: "" },
    }),
  )
  privateInfo: Record<keyof PrivateTechnicalInfoI, any>;

  @Prop(
    raw({
      country: { type: String, default: "" },
      city: { type: String, default: "" },
    }),
  )
  location?: Record<string, string>;

  @Prop(
    raw({
      fb: { type: String, default: "" },
      insta: { type: String, default: "" },
      email: { type: String, default: "" },
      tg: { type: String, default: "" },
      website: { type: String, default: "" },
    }),
  )
  social?: Record<string, string>;

  @Prop({ default: "" })
  avatar?: string;

  @Prop({ default: [], type: Array, ref: () => User })
  followers?: Types.ObjectId[];

  @Prop({ default: "student" })
  role?: string;

  @Prop({ default: 0 })
  balance?: number;
}

const UserSchema = CreateSchema(User, false, true).index({
  name: "text",
});

export { UserSchema };
