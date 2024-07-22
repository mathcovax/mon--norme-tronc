import "../setup";
import { FindSlice } from "@utils/findSlice";
import { mongoose } from "../setup/mongoose";
import { LastTime } from "../setup/lastTime";
import { PromiseList } from "../setup/promiseList";
import { Mail } from "@services/mail";
import { newsletterTemplate } from "@/templates/newsletter";

const newLastIndexing = new Date();
const lastTime = new LastTime("sendMailNewsletter");
const lastSendNewsletterMail = await lastTime.get();

const usersGenerator = FindSlice(
	50,
	(slice, size) => prisma.user.findMany({
		where: {
			emailNotifcationsNewsletter: true,
			deleted: false
		},
		select: {
			id: true,
			email: true,
			firstname: true,
		},
		skip: slice * size,
		take: size
	})
);

const newslettersGenerator = FindSlice(
	50,
	(slice, size) => prisma.newsletter.findMany({
		where: {
			sendAt: { gte: lastSendNewsletterMail }
		},
		skip: slice * size,
		take: size
	})
);

const promiseList = new PromiseList(1000);

for await (const user of usersGenerator) {
	for await (const newsletter of newslettersGenerator) {
		await promiseList.append(
			Mail.send(
				user.email,
				newsletter.object,
				newsletterTemplate(
					newsletter.object,
					newsletter.content
				)
			)
		);
	}
}

await promiseList.clear();
await lastTime.set(newLastIndexing);

mongoose.connection.close();

console.log("Finish sendMail:newsletter");
