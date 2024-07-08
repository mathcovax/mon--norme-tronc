<script setup lang="ts">
import FAQAccordion from "../components/FAQAccordion.vue";

const faq = ref([
	{
		question: "Comment créer un compte sur Mon Énorme Troncs ?",
		answer: `
			Pour créer un compte sur Mon Énorme Troncs, vous devez utiliser votre compte Google.
			Cliquez sur le bouton de connexion et suivez les instructions pour autoriser l'accès
			à certaines informations de votre compte Google, telles que votre adresse e-mail et votre nom.
		`
	},
	{
		question: "Comment gérer la confidentialité de mes identifiants de connexion ?",
		answer: `
			Il est essentiel de maintenir la confidentialité de vos identifiants de connexion.
			Assurez-vous de ne pas les partager avec d'autres personnes et évitez de les stocker sur des appareils partagés.
			De plus, il est recommandé de vous déconnecter après chaque session d'utilisation,
			surtout sur un ordinateur public ou partagé.
		`
	},
	{
		question: "Où sont stockées les informations de connexion ?",
		answer: `
			Les informations de connexion sont stockées dans le local storage de votre navigateur.
			Ce stockage sécurisé permet une connexion rapide lors de vos visites ultérieures sur le site.
		`
	},
	{
		question: "Comment mettre à jour mes informations de compte ?",
		answer: `
			Pour mettre à jour vos informations de compte, connectez-vous à votre compte via votre compte Google.
			Vous pouvez ensuite modifier vos informations personnelles telles que
			votre adresse e-mail, votre adresse de livraison, etc.
		`
	},
	{
		question: "Comment supprimer mon compte Mon Énorme Troncs ?",
		answer: `
			Si vous souhaitez supprimer votre compte, veuillez nous contacter à l'adresse suivante : 
			contact@monenormetroncs.fr. Nous vous assisterons dans le processus de suppression de votre compte
			et la suppression de vos informations personnelles conformément à notre Politique de Confidentialité.
		`
	},
	{
		question: "Comment puis-je contacter le support si j'ai d'autres questions sur mon compte ?",
		answer: `
			Pour toute autre question ou assistance supplémentaire concernant votre compte,
			n'hésitez pas à nous contacter à l'adresse suivante : contact@monenormetroncs.fr.
			Notre équipe du service clientèle se fera un plaisir de vous aider.
		`
	}
]);
</script>

<template>
	<section class="container my-12 lg:my-16">
		<h1 class="text-3xl lg:text-5xl mb-12 font-bold">
			Foire Aux Questions (FAQ) - Compte
		</h1>

		<div class="flex flex-col gap-8">
			<FAQAccordion
				v-for="(item, index) in faq"
				:key="index"
				:item="item"
			/>
		</div>
	</section>
</template>
