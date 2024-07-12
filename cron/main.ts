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
		time: "*/5 * * * *",
		command: "npm -w duplo run followBundle",
	},
	{
		time: "*/5 * * * *",
		command: "npm -w duplo run readNotifications",
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


