import { mustBeConnected } from "@security/mustBeConnected";

/* METHOD : GET, PATH : /user/notifications */
export const GET = (method: Methods, path: string) =>
	mustBeConnected({ pickup: ["accessTokenContent"] })
		.declareRoute(method, path);
//recup la liste de mongo
