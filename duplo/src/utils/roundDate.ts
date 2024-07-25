export function roundDate(date: Date, fixed = 0): Date {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate(), fixed);
}
