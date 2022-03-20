import { Module } from "@nestjs/common";
import { JWTModule } from "nest-jwt-module";

@Module({
  imports: [
    JWTModule.forRoot({
      secretKey: "3m2b0pu3jdg2c48j6e78",
      expiresIn: "30d",
    }),
  ],
  exports: [JWTModule],
})
export class JwtModule {}
