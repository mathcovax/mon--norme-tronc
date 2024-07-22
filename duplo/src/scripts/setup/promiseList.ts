export class PromiseList<U> {
	private queue: Promise<U>[] = [];

	constructor(
		private maxLength: number
	) {}

	append(...promises: Promise<U>[]) {
		this.queue.push(...promises);

		if (this.queue.length >= this.maxLength) {
			return this.clear();
		}
	}

	clear() {
		return Promise.all(this.queue)
			.then(result => {
				this.queue = [];
				return result;
			});
	}
}
