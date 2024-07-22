import "../setup";
import { FindSlice } from "@utils/findSlice";
import { mongoose } from "../setup/mongoose";
import { PromiseList } from "../setup/promiseList";
import { Mail } from "@services/mail";
import { newsletterTemplate } from "@/templates/newsletter";

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

const newsletters = await prisma.newsletter.findMany({
	where: {
		sendAt: { gte: new Date() },
		isSent: false,
	},
});

if (newsletters.length === 0) {
	process.exit(0);
}

const promiseList = new PromiseList(1000);

for await (const user of usersGenerator) {
	await promiseList.append(
		...newsletters.map(
			newsletter => Mail.send(
				user.email,
				newsletter.object,
				newsletterTemplate(newsletter.object, newsletter.content)
			)
		)
	);
}

await promiseList.clear();

await Promise.all(
	newsletters.map(
		newsletter => prisma.newsletter.update({
			where: {
				id: newsletter.id
			},
			data: {
				isSent: true
			}
		})
	)
);


mongoose.connection.close();

console.log("Finish sendMail:newsletter");
