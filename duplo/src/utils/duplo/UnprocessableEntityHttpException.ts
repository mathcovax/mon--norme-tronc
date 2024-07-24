import { HttpException } from "@duplojs/http-exception";

export class UnprocessableEntityHttpException extends HttpException {
	constructor(info?: string, body?: unknown) {
		super(UnprocessableEntityHttpException.code, info, body);
	}

	static readonly code = 422;
}

declare global {
    const UnprocessableEntityHttpException: 
		typeof import("./UnprocessableEntityHttpException.js")["UnprocessableEntityHttpException"];
}

//@ts-expect-error var 'global' cause type error.
global.UnprocessableEntityHttpException = UnprocessableEntityHttpException;
