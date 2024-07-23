<script setup lang="ts">
const articles = [
	{
		title: "1. Conditions de Retour",
		list: [
			{
				heading: "Période de Retour",
				content: "Vous pouvez retourner un produit dans un délai de 30 jours suivant la réception."
			},
			{
				heading: "État du Produit",
				content: `
					Les articles doivent être retournés dans leur état d'origine, non utilisés, et dans leur 
                  	emballage d'origine.
				`
			},
			{
				heading: "Exclusions",
				content: `
					Les produits personnalisés, les articles de vente finale, et les produits d'hygiène ne sont pas 
                  	éligibles pour un retour, sauf s'ils sont défectueux ou endommagés.
				`
			}
		]
	},
	{
		title: "2. Processus de Retour",
		orderedList: [
			{
				heading: "Demande de Retour",
				content: `
					Contactez notre service clientèle à 
					<a 
						href="mailto:contact@monenormetroncs.fr" 
                  		class="text-blue-500 underline"
					>
						contact@monenormetroncs.fr
					</a> 
					avec votre numéro de commande et la description du problème.
				`
			},
			{
				heading: "Autorisation de Retour",
				content: "Nous vous enverrons une autorisation de retour avec des instructions pour renvoyer le produit."
			},
			{
				heading: "Retour du Produit",
				content: `
					Emballez le produit et renvoyez-le à l'adresse fournie. Les frais de retour sont à votre charge sauf 
                  	en cas de produit défectueux.
				`
			}
		]
	},
	{
		title: "3. Remboursement",
		list: [
			{
				heading: "Traitement des Retours",
				content: `
					Après réception et inspection du produit, nous vous informerons de l'approbation ou du rejet du 
                  	remboursement.
				`
			},
			{
				heading: "Remboursement",
				content: `
					Si le retour est approuvé, nous procéderons au remboursement via le mode de paiement utilisé. Les 
                  	remboursements prennent généralement 5 à 10 jours ouvrables.
				`
			},
			{
				heading: "Échange",
				content: `
					Les échanges directs ne sont pas offerts. Pour obtenir un produit différent, retournez l'article et 
                  	passez une nouvelle commande.
				`
			}
		]
	},
	{
		title: "4. Produits Défectueux ou Endommagés",
		content: `
			Si vous recevez un produit défectueux ou endommagé, veuillez nous le signaler dans les 7 jours suivant la 
			réception pour organiser un retour ou un remplacement. Les frais de retour seront couverts par nous.
		`
	},
	{
		title: "5. Assistance Client",
		content: `
			Pour toute question ou assistance concernant les retours, veuillez contacter notre service clientèle à 
			<a 
				href="mailto:contact@monenormetroncs.fr" 
				class="text-blue-500 underline"
			>
            	contact@monenormetroncs.fr
			</a>. 
			Nous sommes disponibles pour vous aider.
		`
	}
];
</script>

<template>
	<section class="container my-12 lg:my-16 flex flex-col gap-12">
		<h1 class="text-3xl font-bold mb-4">
			Politique de Retours
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
					class="list-disc list-inside"
				>
					<li
						v-for="(item, idx) in article.list"
						:key="idx"
					>
						<strong>{{ item.heading }} :</strong> {{ item.content }}
					</li>
				</ul>

				<ol
					v-if="article.orderedList"
					class="list-decimal list-inside"
				>
					<li
						v-for="(item, idx) in article.orderedList"
						:key="idx"
					>
						<strong>{{ item.heading }} :</strong>

						<span v-html="item.content" />
					</li>
				</ol>
			</article>
		</div>
	</section>
</template>
