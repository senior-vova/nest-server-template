import { HttpService, Injectable } from "@nestjs/common";
import { MailMessages, MessagesTypesEnum } from "./mail.data";
import { ConfigService } from "@nestjs/config";
import {
  PepipostEndpoints,
  PepipostTemplateI,
  SendEmailBodyI,
  TemplatesNames,
} from "./pepipost.dto";

interface PromiseDataI {
  sended: boolean;
}

@Injectable()
export class MailService {
  private readonly mail: string;
  private readonly pepipostApiKey: string;
  private readonly pepipostConfigs: any;

  constructor(private readonly http: HttpService, private _configs: ConfigService) {
    this.pepipostApiKey = _configs.get("PEPIPOST_API_KEY");
    this.mail = _configs.get("MAIL");
    this.pepipostConfigs = {
      headers: {
        api_key: this.pepipostApiKey,
      },
    };
  }

  async sendMailMsg(email: string, type: string, data: string | number): Promise<PromiseDataI> {
    try {
      let html: string;
      let attributes: Record<string, any>;
      switch (type) {
        case MessagesTypesEnum.CODE:
          html = await this.getTemplate(TemplatesNames.CODE);
          attributes = { CODE: data, USER: email, MANUAL: "", DESC: "" };
          break;
        case MessagesTypesEnum.AUTH:
          html = await this.getTemplate(TemplatesNames.AUTH);
          attributes = { CODE: data, USER: email, MANUAL: "" };
          break;
        default:
          html = MailMessages.find((v) => v.type == type).html(data.toString());
          attributes = {};
          break;
      }
      const resp = await this.sendMail(type, email, html, attributes);
      // console.log(resp);
      return { sended: true };
    } catch (error) {
      console.log("Email error", error);
      return { sended: false };
    }
  }

  async sendMail(subject: string, toEmail: string, html: string, attributes: Record<string, any>) {
    try {
      const data: SendEmailBodyI = {
        from: {
          email: this.mail,
          name: "HiTutor",
        },
        subject: subject,
        content: [{ type: "html", value: html }],
        personalizations: [
          {
            attributes,
            to: [{ email: toEmail }],
          },
        ],
      };
      const resp = await this.http
        .post(PepipostEndpoints.SEND_MAIL, data, this.pepipostConfigs)
        .toPromise();
      return Promise.resolve(resp.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private async getTemplate(name: string): Promise<string> {
    try {
      const templates = await this.retrieveTemplates();
      const template = templates.find((t) => t.template_name == name);
      if (template) {
        const resp = await this.http
          .get(
            PepipostEndpoints.GET_TEMPLATE + `?template_id=${template.template_id}`,
            this.pepipostConfigs,
          )
          .toPromise();
        const data = resp.data?.data;
        if (data) return Promise.resolve(data.content[0].value);
      }
      return Promise.reject();
    } catch (error) {
      console.log("Get template error: ", error);
      return Promise.reject();
    }
  }

  private async retrieveTemplates(): Promise<Array<PepipostTemplateI>> {
    try {
      const templates = await this.http
        .get(PepipostEndpoints.RETRIEVE_TEMPLATES, this.pepipostConfigs)
        .toPromise();
      return Promise.resolve(templates.data["data"]);
    } catch (error) {
      console.log("Retrieve templates error: ", error);
      return Promise.resolve([]);
    }
  }
}
