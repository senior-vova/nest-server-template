import { SchemaFactory } from "@nestjs/mongoose";
import { Schema, Types } from "mongoose";

export const Compare = (a: Types.ObjectId | string, b: Types.ObjectId | string): boolean => {
  return String(a) === String(b);
};

export const FindCompare = <T extends string | Types.ObjectId>(
  list: Array<T>,
  value: any,
): T | undefined => {
  return list.find((v) => Compare(v, value));
};

export const FindFieldCompare = <T>(list: Array<T>, field: keyof T, value: any): T | undefined => {
  return list.find((v) => Compare(String(v[field]), value));
};

export const CreateSchema = (
  schemaClass: any,
  setVersionKey: boolean = false,
  setTimestamps: boolean = false,
): Schema => {
  const schema = SchemaFactory.createForClass(schemaClass)
    .set("versionKey", setVersionKey)
    .set("timestamps", setTimestamps);
  return schema;
};

export const Random6Code = (): number => {
  return Math.floor(Math.random() * (999999 - 100000) + 100000);
};

export const Random6Code_V2 = (): string => {
  const numbers = "1234567890";
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const characters = numbers + letters;
  let lettersCount = 0;
  let numbersCount = 0;
  let code = "";
  while (lettersCount < 2 || numbersCount < 4) {
    let randomChar = characters[Math.floor(Math.random() * characters.length)] || "1";
    if (letters.includes(randomChar)) {
      if (lettersCount >= 2) {
        continue;
      } else {
        lettersCount++;
        code += randomChar;
      }
    } else {
      if (numbersCount >= 4) {
        continue;
      } else {
        numbersCount++;
        code += randomChar;
      }
    }
  }
  return code;
};

export const ToObjectId = (value: string): Types.ObjectId => {
  if (!value || !String(value).length) return "" as unknown as Types.ObjectId;
  return Types.ObjectId(String(value));
};
