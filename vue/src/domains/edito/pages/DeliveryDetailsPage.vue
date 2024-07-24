<script setup lang="ts">
const { EDITO_RETURN_POLICY } = routerPageName;

const articles = [
	{
		title: "1. Frais de Livraison",
		content: `
			Les frais de livraison sont directement inclus dans le prix de votre commande.
		`
	},
	{
		title: "2. Délais de Traitement",
		content: `
			Les commandes sont traitées et expédiées sous 1 à 2 jours ouvrables. Vous recevrez un e-mail de confirmation 
            d'expédition avec un numéro de suivi dès que votre commande aura été expédiée.
		`
	},
	{
		title: "3. Suivi de Commande",
		content: `
			Une fois votre commande expédiée, vous pouvez suivre son statut grâce au numéro de suivi fourni dans l'e-mail 
            de confirmation d'expédition. Vous pouvez également suivre votre commande 
			en vous connectant à votre compte sur notre site.
		`
	},
	{
		title: "4. Problèmes de Livraison",
		content: `
			Si vous rencontrez des problèmes avec la livraison de votre commande, veuillez nous contacter 
			à l'adresse suivante : 
			<a 
				href="mailto:contact@monenormetroncs.fr" 
				target="_blank" 
				class="text-blue-500 underline"
			>
				contact@monenormetroncs.fr
			</a>. 
			Nous ferons de notre mieux pour résoudre le problème dans les plus brefs délais.
		`
	},
	{
		title: "5. Adresse de Livraison",
		content: `
			Veuillez vous assurer que l'adresse de livraison fournie lors de la commande est correcte et complète. Nous ne 
            pouvons pas être tenus responsables des colis non livrés en raison d'une adresse incorrecte ou incomplète.
		`
	},
	{
		title: "6. Modifications de la Commande",
		content: `
			Si vous devez modifier les détails de votre commande (adresse de livraison, mode de livraison, etc.), veuillez 
			nous contacter dès que possible. Nous ferons de notre mieux pour apporter les modifications demandées avant que 
			votre commande ne soit expédiée.
		`
	},
	{
		title: "7. Retours et Échanges"
	},
	{
		title: "8. Contact",
		content: `
			Pour toute question concernant la livraison, veuillez nous contacter à l'adresse suivante : 
            <a 
				href="mailto:contact@monenormetroncs.fr" 
				target="_blank" 
				class="text-blue-500 underline"
			>
				contact@monenormetroncs.fr
			</a>.
		`
	}
];
</script>

<template>
	<div class="container flex flex-col gap-12 my-12 lg:my-16">
		<h1 class="mb-4 text-3xl font-bold">
			Détails de Livraison
		</h1>

		<div class="flex flex-col gap-12">
			<article
				v-for="(article, index) in articles"
				:key="index"
			>
				<h2 class="mb-4 text-2xl font-semibold">
					{{ article.title }}
				</h2>

				<p
					v-if="article.content"
					v-html="article.content"
				/>

				<p v-if="article.title.includes('Retours et Échanges')">
					Pour les informations sur les retours et les échanges, veuillez consulter notre 
					<RouterLink
						:to="{ name: EDITO_RETURN_POLICY }"
						class="text-blue-500 underline"
					>
						Politique de Retours
					</RouterLink>.
				</p>
			</article>
		</div>
	</div>
</template>
