import { spawn } from "child_process";
import { CronJob } from "cron";

interface CronDef {
	time: string
	command: string
}

const cronDefs: CronDef[] = [
	{
		time: "*/5 * * * *",
		command: "npm -w duplo run indexing:productSheet",
	},
	{
		time: "*/10 * * * *",
		command: "npm -w duplo run followBundle",
	},
	{
		time: "*/5 * * * *",
		command: "npm -w duplo run readNotifications",
	},
	{
		time: "*/5 * * * *",
		command: "npm -w duplo run indexing:commandItem",
	},
	{
		time: "*/5 * * * *",
		command: "npm -w duplo run notification:productPromotion",
	},
	{
		time: "*/5 * * * *",
		command: "npm -w duplo run notification:productRestock",
	},
	{
		time: "*/5 * * * *",
		command: "npm -w duplo run computeProductStock",
	},
	{
		time: "*/5 * * * *",
		command: "npm -w duplo run notification:newProductInCategory",
	},
	{
		time: "*/5 * * * *",
		command: "npm -w duplo run notification:productNoStock",
	},
	{
		time: "*/40 * * * *",
		command: "npm -w duplo run sendMail:productPromotion",
	},
	{
		time: "*/40 * * * *",
		command: "npm -w duplo run sendMail:productRestock",
	},
	{
		time: "*/40 * * * *",
		command: "npm -w duplo run sendMail:newProductInCategory",
	},
	{
		time: "*/40 * * * *",
		command: "npm -w duplo run sendMail:newsletter",
	},
];

cronDefs.map(
	def => CronJob.from({
		cronTime: def.time,
		start: true,
		onTick: () => {
			const commandArgs = def.command.split(" ");
			const command = commandArgs.shift() ?? "";
			spawn(
				command, 
				commandArgs, 
				{
					stdio: "inherit", 
					uid: 1000, 
					gid: 1000, 
					cwd: "..", 
					detached: true
				}
			);
		},
	})
);


