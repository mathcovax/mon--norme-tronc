import Duplo, { HttpMethods, zod } from "@duplojs/duplojs";
import duploHttpException from "@duplojs/http-exception";
import duploRoutesDirectory, { matchScriptFile } from "@duplojs/routes-directory";
import duploSwagger from "@duplojs/swagger";
import duploWhatWasSent from "@duplojs/what-was-sent";
import duploZodAccelerator, { ZodAcceleratorError } from "@duplojs/zod-accelerator/plugin";
import duploTypeGenerator from "@duplojs/to/plugin";
import duploMultipart from "@duplojs/multipart";
import "./env";

declare global {
    const duplo: typeof import("./main.js")["default"];
	const zod: typeof import("./main.js")["zod"];
	const multipart: typeof import("./main.js")["multipart"];
	type Methods = HttpMethods;
}

export default Duplo({
	port: ENV.PORT,
	host: ENV.HOST,
	environment: ENV.ENVIRONMENT,
	globals: true,
});

export {
	zod
};

//@ts-expect-error var 'global' cause type error.
export const multipart = global.multipart = duplo.use(
	duploMultipart,
	{ uploadFolder: "/tmp/duplojsUpload", maxSize: 5000000 }
);
duplo.use(
	duploSwagger,
	{
		disabledDoc: ENV.ENVIRONMENT !== "DEV",
		swaggerSpec: {
			basePath: "/api",
			consumes: [
				"application/json",
				"text/plain",
			],
		},
		globals: true,
	}
);
duplo.use(
	duploWhatWasSent, 
	{
		globals: true, 
		enabled: ENV.ENVIRONMENT === "DEV"
	}
);
duplo.use(duploHttpException, { globals: true });
duplo.use(
	duploZodAccelerator,
	{
		DEV: true,
		PROD: true
	}
);
duplo.use(duploTypeGenerator, { outputFile: "../vue/src/lib/duploTo/EnrichedDuploTo.d.ts" });

if (ENV.ENVIRONMENT === "DEV") {
	duplo.setDefaultErrorExtract((res, type, index, err: ZodAcceleratorError) => {
		throw new BadRequestHttpException(`TYPE_ERROR.${type}.${index}`, err.message);
	});
}
else {
	duplo.setDefaultErrorExtract((res, type, index) => {
		throw new BadRequestHttpException(`TYPE_ERROR.${type}.${index}`);
	});
}
duplo.use(
	duploRoutesDirectory, 
	{
		path: ["mocks", "providers"].map((path) => `src/${path}`),
		matchs: [matchScriptFile],
		ignores: ["**.test.ts"]
	}
).then(
	() => duplo.use(
		duploRoutesDirectory, 
		{
			path: ["routes"].map((path) => `src/${path}`),
			matchs: [matchScriptFile],
			ignores: ["**.test.ts"]
		}
	)
).then(() => {
	duplo.launch(() => { 
		console.log(`Ready on ${ENV.ENVIRONMENT}:${ENV.HOST}:${ENV.PORT}`); 
	});
});
