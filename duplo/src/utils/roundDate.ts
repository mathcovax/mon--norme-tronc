export function roundDate(date: Date) {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 1);
}
