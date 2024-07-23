<script setup lang="ts">
const articles = [
	{
		title: "1. Introduction",
		content: `
			La présente Politique de Confidentialité décrit comment Mon Enorme Tronc (ci-après "le Site") collecte, 
			utilise et protège les informations personnelles des utilisateurs (ci-après "les Utilisateurs"). 
			En utilisant le Site, vous acceptez les pratiques décrites dans cette Politique de Confidentialité.
		`
	},
	{
		title: "2. Collecte des Informations",
		content: `
			Nous collectons des informations lorsque vous créez un compte via Google, 
			passez une commande ou interagissez avec le Site. Les informations collectées peuvent inclure votre nom, 
			adresse e-mail, adresse de livraison, et informations de paiement.
		`
	},
	{
		title: "3. Utilisation des Informations",
		content: "Les informations collectées sont utilisées pour :",
		list: [
			"Traiter vos commandes et gérer votre compte.",
			"Améliorer notre service client et répondre à vos demandes.",
			"Personnaliser votre expérience sur le Site.",
			"Envoyer des e-mails périodiques concernant votre commande ou d'autres produits et services."
		]
	},
	{
		title: "4. Paiement via Stripe",
		content: `
			Nous utilisons Stripe pour traiter les paiements. Stripe collecte et traite vos informations de paiement. 
			En utilisant notre Site pour effectuer des paiements, vous acceptez également 
			la politique de confidentialité de Stripe, disponible sur leur site officiel. 
			Nous ne stockons pas vos informations de carte de crédit sur nos serveurs.
		`
	},
	{
		title: "5. Protection des Informations",
		content: `
			Nous mettons en œuvre des mesures de sécurité pour protéger vos informations personnelles. 
			Vos informations personnelles sont contenues derrière des réseaux sécurisés et ne sont accessibles 
			qu'à un nombre limité de personnes qui ont des droits d'accès spéciaux à ces systèmes, 
			et sont tenues de garder ces informations confidentielles.
		`
	},
	{
		title: "6. Partage des Informations",
		content: `
			Nous ne vendons, n'échangeons, ni ne transférons vos informations personnelles 
			à des tiers sans votre consentement, sauf dans les cas suivants :
		`,
		list: [
			`
				Avec des partenaires de confiance qui nous aident à exploiter le Site, 
				à mener nos affaires ou à vous servir, tant que ces parties conviennent 
				de garder ces informations confidentielles.
			`,
			`
				Lorsque nous estimons que la divulgation est nécessaire pour se conformer à la loi, 
				appliquer les politiques de notre Site, ou protéger nos droits, notre propriété ou notre sécurité, 
				ainsi que ceux d'autres personnes.
	   		`
		]
	},
	{
		title: "7. Vos Droits",
		content: `
			Vous avez le droit d'accéder à vos données personnelles, de les rectifier ou de demander leur suppression. 
			Pour exercer ces droits, veuillez nous contacter à l'adresse suivante : 
            <a href="mailto:contact@monenormetroncs.fr" target="_blank" class="text-blue-500 underline">
              contact@monenormetroncs.fr
			</a>.
		`
	},
	{
		title: "8. Modifications de la Politique de Confidentialité",
		content: `
			Mon Enorme Tronc se réserve le droit de modifier cette Politique de Confidentialité à tout moment.
			Les modifications seront notifiées aux Utilisateurs et entreront en vigueur dès leur mise en ligne sur le Site.
		`
	},
	{
		title: "9. Contact",
		content: `
			Pour toute question concernant cette Politique de Confidentialité, veuillez nous contacter à l'adresse suivante : 
            <a href="mailto:contact@monenormetroncs.fr" target="_blank" class="text-blue-500 underline">
              contact@monenormetroncs.fr
			</a>.
		`
	}
];
</script>

<template>
	<div class="container flex flex-col gap-12 my-12 lg:my-16">
		<h1 class="mb-4 text-3xl font-bold">
			Politique de Confidentialité
		</h1>

		<div class="flex flex-col gap-12">
			<article
				v-for="(article, index) in articles"
				:key="index"
			>
				<h2 class="mb-4 text-2xl font-semibold">
					{{ article.title }}
				</h2>

				<p v-html="article.content" />

				<ul
					v-if="article.list"
					class="mt-2 ml-6 list-disc"
				>
					<li
						v-for="(item, idx) in article.list"
						:key="idx"
					>
						{{ item }}
					</li>
				</ul>
			</article>
		</div>
	</div>
</template>
