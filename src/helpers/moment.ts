import * as moment from "moment";

export const ToMomemtDate = (date: string) => {
  return moment(date, "DD.MM.YYYY");
};

export const MomentDiffDay = (a: moment.Moment, b: moment.Moment) => {
  return a.diff(b, "day");
};

export const MomentDiffSecond = (a: moment.Moment, b: moment.Moment) => {
  return a.diff(b, "second");
};
