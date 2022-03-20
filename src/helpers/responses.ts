import { HttpStatus } from "@nestjs/common";
import { Response } from "express";

export const ReturnError = (res: Response, error: string = "Server Error") => {
  return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    errMsg: error,
    data: null,
    metaData: null,
  });
};

export const ReturnBadRequest = (res: Response, error: string = "Wrong Params") => {
  return res
    .status(HttpStatus.BAD_REQUEST)
    .json({ errMsg: error || "Wrong Params", data: null, metaData: null });
};

export const ReturnOK = (
  res: Response,
  data: any = null,
  metaData: any = null,
  msg: string = "",
) => {
  return res.status(HttpStatus.OK).json({ errMsg: msg || "", data: data, metaData: metaData });
};

export const ReturnCreated = (
  res: Response,
  data: any = null,
  metaData: any = null,
  msg: string = "",
) => {
  return res.status(HttpStatus.CREATED).json({ errMsg: msg || "", data: data, metaData: metaData });
};

export const ReturnNotFound = (res: Response, msg: string = "Not Found") => {
  return res
    .status(HttpStatus.NOT_FOUND)
    .json({ errMsg: msg || "Not Found", data: null, metaData: null });
};

export const ReturnForbidden = (res: Response, msg: string = "Forbidden") => {
  return res
    .status(HttpStatus.FORBIDDEN)
    .json({ errMsg: msg || "Forbidden", data: null, metaData: null });
};

export const ReturnUnauthorized = (res: Response, msg: string = "Unauthorized") => {
  return res
    .status(HttpStatus.UNAUTHORIZED)
    .json({ errMsg: msg || "Unauthorized", data: null, metaData: null });
};
