import { ConfigModuleOptions } from "@nestjs/config/dist/interfaces";

const environment = process.env.NODE_ENV || "development";

export const config: ConfigModuleOptions = {
  isGlobal: true,
  envFilePath: `.env.${environment == "development" ? "dev" : environment}`,
};
