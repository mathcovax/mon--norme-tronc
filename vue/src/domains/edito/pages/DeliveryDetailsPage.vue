<script setup lang="ts">
const { EDITO_RETURN_POLICY } = routerPageName;

const articles = [
	{
		title: "1. Modes de Livraison",
		content: "Nous offrons plusieurs modes de livraison pour répondre à vos besoins :",
		list: [
			"Livraison standard : 3-5 jours ouvrables",
			"Livraison express : 1-2 jours ouvrables",
			"Livraison internationale : 7-14 jours ouvrables"
		]
	},
	{
		title: "2. Frais de Livraison",
		content: `
			Les frais de livraison varient en fonction du mode de livraison choisi et de la destination. Les frais exacts 
            seront calculés et affichés au moment de la validation de votre commande.
		`
	},
	{
		title: "3. Délais de Traitement",
		content: `
			Les commandes sont traitées et expédiées sous 1 à 2 jours ouvrables. Vous recevrez un e-mail de confirmation 
            d'expédition avec un numéro de suivi dès que votre commande aura été expédiée.
		`
	},
	{
		title: "4. Suivi de Commande",
		content: `
			Une fois votre commande expédiée, vous pouvez suivre son statut grâce au numéro de suivi fourni dans l'e-mail 
            de confirmation d'expédition. Vous pouvez également suivre votre commande 
			en vous connectant à votre compte sur notre site.
		`
	},
	{
		title: "5. Livraison Internationale",
		content: `
			Nous livrons dans de nombreux pays à travers le monde. Les délais de livraison et les frais d'expédition varient 
			en fonction de la destination. Veuillez noter que des frais de douane et des taxes peuvent s'appliquer pour les 
			livraisons internationales, et ils sont à la charge du destinataire.
		`
	},
	{
		title: "6. Problèmes de Livraison",
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
		title: "7. Adresse de Livraison",
		content: `
			Veuillez vous assurer que l'adresse de livraison fournie lors de la commande est correcte et complète. Nous ne 
            pouvons pas être tenus responsables des colis non livrés en raison d'une adresse incorrecte ou incomplète.
		`
	},
	{
		title: "8. Modifications de la Commande",
		content: `
			Si vous devez modifier les détails de votre commande (adresse de livraison, mode de livraison, etc.), veuillez 
			nous contacter dès que possible. Nous ferons de notre mieux pour apporter les modifications demandées avant que 
			votre commande ne soit expédiée.
		`
	},
	{
		title: "9. Retours et Échanges"
	},
	{
		title: "10. Contact",
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
	<div class="container my-12 lg:my-16 flex flex-col gap-12">
		<h1 class="text-3xl font-bold mb-4">
			Détails de Livraison
		</h1>

		<div class="flex flex-col gap-12">
			<article
				v-for="(article, index) in articles"
				:key="index"
			>
				<h2 class="text-2xl font-semibold mb-4">
					{{ article.title }}
				</h2>

				<p
					v-if="article.content"
					v-html="article.content"
				/>

				<ul
					v-if="article.list"
					class="list-disc mt-2 ml-6"
				>
					<li
						v-for="(item, idx) in article.list"
						:key="idx"
					>
						{{ item }}
					</li>
				</ul>

				<p v-if="article.title === '9. Retours et Échanges'">
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
