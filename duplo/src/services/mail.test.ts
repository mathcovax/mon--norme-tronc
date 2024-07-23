import { MockEnv } from "@test/mocks/env";
import { Transporter } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { Mail } from "./mail";

describe("Mail Service", () => {
	beforeEach(() => {
		MockEnv.reset();
	});

	it("verify good parameters to send in mail", async () => {
		MockEnv.set("MAIL_FROM", "test@test.test");
		MockEnv.set("ENVIRONMENT", "DEV");
		const mailData = {
			to: "test@met.com",
			subject: "test subject",
			html: "content test",
			attachments: []
		};
		const spy = vi.fn(async () => {/* intentionally empty */});
		Mail.transporter = { sendMail: spy } as unknown as Transporter<SMTPTransport.SentMessageInfo>;
		Mail.send(
			mailData.to, 
			mailData.subject, 
			mailData.html, 
			mailData.attachments
		);
		expect(spy).toBeCalledWith({
			from: ENV.MAIL_FROM,
			...mailData
		});
	});
});
