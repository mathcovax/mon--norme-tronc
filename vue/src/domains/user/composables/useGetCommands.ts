import type { Command } from "@/lib/utils";

export function useGetCommands() {
	const commands = ref<Command>([]);

	function getCommands() {
		return duploTo.enriched
			.get(
				"/commands",
			)
			.info("userCommands", (data) => {
				commands.value = data.map(c => {
					c.createdDate = new Date(c.createdDate).toLocaleDateString();
					return c;
				});
			});
	}

	getCommands();

	return {
		commands,
		getCommands
	};
}
