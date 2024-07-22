<script setup lang="ts">
import OrganizationDropdown from "@/domains/navigation/components/AccountDropdown.vue";
import OrganizationMobileNavbar from "../components/OrganizationMobileNavbar.vue";
import { useOrganizationUserStore } from "../stores/organizationUser";

const organizationUserStore = useOrganizationUserStore();
</script>

<template>
	<header class="h-24 px-8 flex gap-4 items-center border-b bg-muted/40">
		<OrganizationMobileNavbar v-if="false" />

		<div class="w-full flex-1 text-center md:text-start">
			<span class=" text-xl">
				Bonjour {{ organizationUserStore.organizationUser?.firstname }} ! 
				Vous êtes 
				<strong>
					{{ $t(`organizationRole.${organizationUserStore.organizationUser?.organizationRole}`) }}
				</strong>.
			</span>
		</div>

		<OrganizationDropdown />
	</header>
</template>
