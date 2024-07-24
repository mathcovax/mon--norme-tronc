<script setup lang="ts">
import FaqAccordion from "../components/FaqAccordion.vue";

const faq = [
	{
		question: "Quels modes de paiement acceptez-vous sur Mon Enorme Tronc ?",
		answer: `Nous acceptons les paiements par carte de crédit/débit via Stripe,
		une plateforme de paiement sécurisée.`
	},
	{
		question: "Est-il sécurisé de saisir mes informations de carte de crédit sur votre site ?",
		answer: `Oui, la sécurité de vos informations est notre priorité. Nous utilisons Stripe, une plateforme de paiement 
        sécurisée, pour traiter les paiements. Toutes les informations de paiement sont cryptées
		et sécurisées conformément aux normes de sécurité PCI-DSS.`
	},
	{
		question: "Puis-je enregistrer mes informations de carte de crédit pour les futures commandes ?",
		answer: `Nous ne conservons pas vos informations de carte de crédit sur nos serveurs.
		Cependant, vous pouvez utiliser Stripe pour enregistrer vos informations de paiement
		de manière sécurisée et simplifier les futurs achats.`
	},
	{
		question: "Pourquoi mon paiement a-t-il été refusé ?",
		answer: `Les paiements peuvent être refusés pour diverses raisons, y compris des problèmes de vérification par la 
        banque émettrice de votre carte, des informations incorrectes saisies lors du paiement,
		ou des restrictions de paiement spécifiques à votre carte.`
	},
	{
		question: "Puis-je payer en plusieurs fois ?",
		answer: `Actuellement, nous n'offrons pas d'options de paiement en plusieurs fois. Tous les paiements doivent être 
        effectués en totalité au moment de la commande.`
	},
	{
		question: "Comment puis-je obtenir une facture pour ma commande ?",
		answer: `Vous recevrez une confirmation de commande par e-mail après avoir passé votre commande.
		Cette confirmation de commande peut être utilisée comme facture pour vos dossiers personnels.`
	},
	{
		question: "Qui contacter si j'ai des questions ou des problèmes liés au paiement ?",
		answer: `Pour toute question ou problème lié au paiement, veuillez contacter notre équipe du service clientèle à 
        l'adresse suivante : contact@monenormetroncs.fr. Nous sommes là pour vous aider !`
	}
];

</script>

<template>
	<section class="container my-12 lg:my-16 flex flex-col gap-12">
		<h1 class="text-3xl font-bold mb-4">
			Foire aux Questions - Payements
		</h1>

		<div>
			<FaqAccordion
				v-for="(item, index) in faq"
				:key="index"
				:item="item"
			/>
		</div>
	</section>
</template>
