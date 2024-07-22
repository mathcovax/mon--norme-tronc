<script setup lang="ts">
import FaqAccordion from "../components/FaqAccordion.vue";

const faq = ref([
	{
		question: "Comment passer une commande sur Mon Enorme Troncs ?",
		answer: `Pour passer une commande sur Mon Enorme Troncs, sélectionnez les produits que vous souhaitez acheter, 
        ajoutez-les à votre panier, puis suivez les instructions pour finaliser votre commande et effectuer le 
        paiement.`
	},
	{
		question: "Quels modes de paiement acceptez-vous ?",
		answer: `Nous acceptons les paiements par carte de crédit/débit via Stripe, une plateforme de paiement sécurisée. 
        Vous pouvez également utiliser des services de paiement en ligne disponibles selon votre région.`
	},
	{
		question: "Puis-je modifier ou annuler ma commande une fois qu'elle est passée ?",
		answer: `Malheureusement, une fois que votre commande est passée, vous ne pouvez pas la modifier directement 
        depuis notre site web. Si vous avez des questions ou avez besoin d'assistance, veuillez nous contacter 
        immédiatement pour voir comment nous pouvons vous aider.`
	},
	{
		question: "Comment suivre ma commande ?",
		answer: "Une fois votre commande expédiée, vous recevrez un e-mail de confirmation contenant un lien de suivi."
	},
	{
		question: "Que faire si je n'ai pas reçu ma commande ?",
		answer: `Si vous n'avez pas reçu votre commande dans les délais prévus, veuillez vérifier le statut de livraison 
        via le lien de suivi fourni dans l'e-mail de confirmation. Si vous avez besoin d'aide supplémentaire, contactez 
        notre service clientèle à l'adresse : contact@monenormetroncs.fr.`
	},
	{
		question: "Puis-je retourner ou échanger un produit ?",
		answer: `Nous acceptons les retours et les échanges dans certaines conditions. Consultez notre Politique de Retours 
        pour plus d'informations ou contactez notre équipe du service clientèle pour obtenir de l'aide.`
	},
	{
		question: "Comment puis-je contacter le service clientèle pour des questions sur ma commande ?",
		answer: `Pour toute question ou préoccupation concernant votre commande, veuillez contacter notre équipe du 
        service clientèle à l'adresse suivante : contact@monenormetroncs.fr. Nous sommes là pour vous aider !`
	}
]);
</script>

<template>
	<div class="container mx-auto p-6">
		<h1 class="text-3xl font-bold mb-4">
			Foire aux Questions - Commandes
		</h1>

		<FaqAccordion
			v-for="(item, index) in faq"
			:key="index"
			:item="item"
		/>
	</div>
</template>
