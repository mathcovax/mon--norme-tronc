import type { parent_category } from "@prisma/client";
import { prisma } from "../prismaClient";
import { faker } from "@faker-js/faker";

export const makeParentCategory = (
	parent_category?: Partial<parent_category>
) =>
	prisma.parent_category.create({
		data: {
			name: parent_category?.name || `${faker.commerce.department()}${Date.now()}`
		}
	});

export const parentCategoryExist = (
	name: string
) => 
	prisma.parent_category.findFirst({
		where: {
			name,
		}
	});

export const addCategoryToParentCategory = (categoryName: string, parentCategoryName: string) => 
	prisma.category_to_parent_category.create({
		data: {
			categoryName,
			parentCategoryName,
		}
	});
