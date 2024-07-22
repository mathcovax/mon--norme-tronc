<script setup lang="ts">
import FaqAccordion from "../components/FaqAccordion.vue";

const faq = ref([
	{
		question: "Comment créer un compte sur Mon Enorme Troncs ?",
		answer: `Pour créer un compte sur Mon Enorme Troncs, connectez-vous avec votre compte Google. Cliquez sur le 
        bouton de connexion et suivez les instructions pour autoriser l'accès à certaines informations de votre 
        compte Google, telles que votre adresse e-mail et votre nom.`
	},
	{
		question: "Comment gérer la confidentialité de mes identifiants de connexion ?",
		answer: `Protégez la confidentialité de vos identifiants de connexion en ne les partageant pas et en évitant de les 
        stocker sur des appareils partagés. Nous vous recommandons également de vous déconnecter après chaque session, 
        surtout sur des ordinateurs publics ou partagés.`
	},
	{
		question: "Où sont stockées les informations de connexion ?",
		answer: `Vos informations de connexion sont stockées dans le local storage de votre navigateur. 
		Ce stockage sécurisé permet une connexion rapide lors de vos prochaines visites sur le site.`
	},
	{
		question: "Que faire si j'ai des problèmes pour me connecter ?",
		answer: `Si vous rencontrez des problèmes pour vous connecter, assurez-vous d'utiliser les bonnes informations de 
        votre compte Google. Si vous avez oublié les détails de connexion, utilisez la fonctionnalité 
		"Mot de passe oublié" de Google pour réinitialiser votre mot de passe ou récupérer votre compte.`
	},
	{
		question: "Comment mettre à jour mes informations de compte ?",
		answer: `Pour mettre à jour vos informations, connectez-vous avec votre compte Google. Ensuite,
		accédez à la section "Éditer mon profil" pour modifier vos informations personnelles,
		telles que votre adresse e-mail ou votre adresse de livraison.`
	},
	{
		question: "Comment supprimer mon compte Mon Enorme Troncs ?",
		answer: `Pour supprimer votre compte, allez dans "Éditer mon profil" et cliquez sur
		"Supprimer mon compte". Confirmez la suppression pour finaliser l'action.
		Notez que cette opération est irréversible et entraînera la perte de toutes vos données.`
	},
	{
		question: "Comment contacter le support pour des questions sur mon compte ?",
		answer: `Pour toute question ou assistance concernant votre compte, contactez-nous à l'adresse suivante : 
        contact@monenormetroncs.fr. Notre équipe du service clientèle est là pour vous aider.`
	}
]);
</script>

<template>
	<div class="container mx-auto p-6">
		<h1 class="text-3xl font-bold mb-4">
			Foire aux Questions - Compte Utilisateur
		</h1>

		<FaqAccordion
			v-for="(item, index) in faq"
			:key="index"
			:item="item"
		/>
	</div>
</template>
