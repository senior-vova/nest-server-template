import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { SchedulerRegistry } from "@nestjs/schedule";
import * as moment from "moment";
import { Model } from "mongoose";
import { Timeout, TimeoutDocument, TimeoutType } from "../models/timeout.model";

@Injectable()
export class SchedulerService implements OnApplicationBootstrap {
  constructor(
    private readonly scheduler: SchedulerRegistry,
    @InjectModel(Timeout.name)
    private readonly timeoutModel: Model<TimeoutDocument>,
  ) {}

  public async addFinishLessonTask(lessonId: string): Promise<string> {
    try {
      const name = `${lessonId}-finish`;
      try {
        const taskExist = this.scheduler.getTimeout(name);
        if (taskExist) return Promise.resolve("Task is exist");
      } catch (error) {}
      const date = moment(new Date());
      const endTime = await this.eventService.getLessonFinishTime(lessonId);
      const milliseconds = endTime.diff(date, "milliseconds");
      const { _id: timeoutId } = await this.timeoutModel.create({
        name,
        timeOut: milliseconds,
        createdAt: new Date(),
        updatedAt: new Date(),
        type: TimeoutType.FinishLesson,
        data: { lessonId },
      });
      const minutes = endTime.diff(date, "minutes");
      const timeout = setTimeout(
        this.generateTask(TimeoutType.FinishLesson, { lessonId, timeoutId }),
        milliseconds,
      );
      this.scheduler.addTimeout(name, timeout);
      return Promise.resolve(`Task is created and will be run after ${minutes} minutes`);
    } catch (error) {
      console.log(666, error);
      return Promise.resolve(`Take error`);
    }
  }

  async onApplicationBootstrap() {
    const timeouts = await this.timeoutModel.find({});

    await Promise.all(
      timeouts.map(
        ({ _id, name, type, data, timeOut, updatedAt }) =>
          new Promise<void>(async (res) => {
            const nowDate = new Date();
            const timeOutDate = moment(updatedAt).add(timeOut, "milliseconds");
            if (timeOutDate.diff(moment(nowDate), "seconds") < 0) {
              const onTimeout = setTimeout(this.generateTask(type, data), 1000);
              this.scheduler.addTimeout(name, onTimeout);
            } else {
              const milliseconds = timeOutDate.diff(moment(nowDate), "milliseconds");
              const onTimeout = setTimeout(this.generateTask(type, data), milliseconds);
              this.scheduler.addTimeout(name, onTimeout);
              await this.timeoutModel.findByIdAndUpdate(_id, {
                timeOut: milliseconds,
                updatedAt: nowDate,
              });
            }
            res();
          }),
      ),
    );
  }

  private generateTask(type: string, data: Record<string, any>) {
    switch (type) {
      case TimeoutType.FinishLesson:
        return async () => {
          try {
            await this.timeoutModel.findByIdAndRemove(data.timeoutId);
            await this.eventService.finishLesson(data.lessonId);
            this.scheduler.deleteTimeout(data.name);
            console.log("Finish lesson and delete timeout");
          } catch (error) {}
        };
      default:
        return async () => {};
    }
  }
}
