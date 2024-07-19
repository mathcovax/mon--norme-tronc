import nodemailer from "nodemailer";
import { Attachment } from "nodemailer/lib/mailer";

export class Mail {
	private static transporter = nodemailer.createTransport(
		ENV.ENVIRONMENT === "DEV"
			? {
				host: "maildev",
				port: 1025,
				secure: false,
			}
			: {
				host: "smtp-relay.brevo.com",
				port: 587,
				secure: false,
				auth: {
					user: ENV.BREVO_USER,
					pass: ENV.BREVO_KEY,
				}
			}
	);

	public static send(to: string, subject: string, content: string, attachments?: Attachment[]) {
		return this.transporter.sendMail({
			from: ENV.MAIL_FROM,
			to,
			subject,
			html: content,
			attachments,
		});
	}
}
