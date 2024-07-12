import "@/env";
import { zod } from "@duplojs/duplojs";
import { prisma } from "./prismaClient";

//@ts-expect-error var 'global' cause type error.
global.zod = zod;
//@ts-expect-error var 'global' cause type error.
global.prisma = prisma;

await import("../../mocks/laPoste");
