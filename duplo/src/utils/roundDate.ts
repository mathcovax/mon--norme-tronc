export function roundDate(date: Date, fixed: number): Date {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate(), fixed);
}
