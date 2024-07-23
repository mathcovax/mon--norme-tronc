<script setup lang="ts">
const articles = [
	{
		title: "Article 1 - Préambule",
		content: `
			Les présentes Conditions Générales d'Utilisation (CGU) ont pour objet de définir 
			les modalités et conditions d'utilisation de la plateforme e-commerce Mon Enorme Tronc (ci-après "le Site"), 
			ainsi que les droits et obligations des utilisateurs (ci-après "les Utilisateurs").
		`
	},
	{
		title: "Article 2 - Acceptation des CGU",
		content: `
			L'utilisation du Site implique l'acceptation pleine et entière des présentes CGU par l'Utilisateur. 
			En accédant au Site, l'Utilisateur reconnaît avoir pris connaissance des présentes CGU et s'engage
			 à les respecter. En cas de désaccord avec les CGU, l'Utilisateur est invité à ne pas utiliser le Site.
		`
	},
	{
		title: "Article 3 - Description des Services",
		content: `
			Mon Enorme Tronc est une marketplace permettant la vente de jouets sexuels 
			en matière entièrement naturelle. Les Utilisateurs peuvent acheter des produits via le Site. 
			Mon Enorme Tronc agit en tant qu'intermédiaire entre les vendeurs et les acheteurs.
		`
	},
	{
		title: "Article 4 - Inscription et Compte Utilisateur",
		sections: [
			{
				subtitle: "4.1 Création de Compte",
				text: `
					Pour accéder à certains services du Site, l'Utilisateur doit créer un compte 
					en utilisant son compte Google. En utilisant cette méthode de connexion, 
					l'Utilisateur autorise Mon Enorme Tronc à accéder à certaines informations de son compte Google, 
					telles que son adresse e-mail et son nom.
				`
			},
			{
				subtitle: "4.2 Confidentialité des Identifiants",
				text: `
					L'Utilisateur est responsable de la confidentialité de ses identifiants de connexion 
					et de toute activité sur son compte. Les informations de connexion sont stockées 
					dans le local storage du navigateur de l'Utilisateur. Mon Enorme Tronc ne pourra être tenue responsable 
					de toute utilisation non autorisée du compte de l'Utilisateur. Il est recommandé de se déconnecter 
					après chaque session d'utilisation, surtout sur un ordinateur public ou partagé.
				`
			}
		]
	},
	{
		title: "Article 5 - Conditions de Vente",
		sections: [
			{
				subtitle: "5.1 Produits",
				text: `
					Les produits disponibles sur le Site sont décrits avec la plus grande précision possible. 
					Toutefois, Mon Enorme Tronc ne garantit pas l'absence d'erreurs typographiques 
					ou autres dans les descriptions des produits.
				`
			},
			{
				subtitle: "5.2 Commandes",
				text: `
					Toute commande passée sur le Site implique l'acceptation des prix et descriptions 
					des produits disponibles à la vente. Mon Enorme Tronc se réserve le droit d'annuler ou de refuser 
					toute commande d'un Utilisateur avec lequel il existerait un litige.
				`
			},
			{
				subtitle: "5.3 Paiement",
				text: `
					Les paiements sont effectués via Stripe, une plateforme de paiement sécurisée. 
					L'Utilisateur garantit qu'il détient toutes les autorisations nécessaires 
					pour utiliser le mode de paiement choisi. En utilisant Stripe, l'Utilisateur accepte également 
					les conditions d'utilisation de Stripe, disponibles sur leur site officiel.
				`
			},
			{
				subtitle: "5.4 Livraison",
				text: `
					Les modalités de livraison sont précisées lors de la passation de la commande. 
					Mon Enorme Tronc n'est pas responsable des retards ou des problèmes de livraison imputables aux transporteurs.
				`
			},
			{
				subtitle: "5.5 Rétractation et Retours",
				text: `
					L'Utilisateur dispose d'un droit de rétractation de 14 jours à compter de la réception du produit, 
					conformément à la législation en vigueur. Les produits doivent être retournés dans leur état d'origine 
					et dans leur emballage intact.
				`
			}
		]
	},
	{
		title: "Article 6 - Obligations des Utilisateurs",
		sections: [
			{
				subtitle: "6.1 Utilisation du Site",
				text: `
					L'Utilisateur s'engage à utiliser le Site conformément aux lois et règlements en vigueur 
					et aux présentes CGU. Toute utilisation frauduleuse, abusive ou illicite du Site 
					entraînera la résiliation du compte de l'Utilisateur sans préjudice des dommages 
					et intérêts que Mon Enorme Tronc pourrait réclamer.
				`
			},
			{
				subtitle: "6.2 Contenu Utilisateur",
				text: `
					L'Utilisateur s'engage à ne pas publier de contenu illégal, offensant, diffamatoire, 
					obscène ou portant atteinte aux droits d'autrui. Mon Enorme Tronc se réserve le droit 
					de supprimer tout contenu qui ne respecterait pas ces critères.
				`
			}
		]
	},
	{
		title: "Article 7 - Propriété Intellectuelle",
		content: `
			Tous les éléments du Site (textes, images, logos, etc.) sont protégés par les lois 
			sur la propriété intellectuelle. Toute reproduction, représentation ou diffusion, en tout ou partie, 
			des éléments du Site est interdite sans l'autorisation préalable de Mon Enorme Tronc.
		`
	},
	{
		title: "Article 8 - Données Personnelles",
		content: `
			Les données personnelles collectées sur le Site sont traitées conformément 
			à notre Politique de Confidentialité. L'Utilisateur dispose d'un droit d'accès, 
			de rectification et de suppression de ses données personnelles.
		`
	},
	{
		title: "Article 9 - Responsabilité",
		sections: [
			{
				subtitle: "9.1 Fonctionnement du Site",
				text: `
					Mon Enorme Tronc met tout en œuvre pour assurer le bon fonctionnement du Site, 
					mais ne peut garantir une disponibilité continue et sans erreur du Site.
				`
			},
			{
				subtitle: "9.2 Limitation de Responsabilité",
				text: `
					Mon Enorme Tronc ne pourra être tenue responsable des dommages indirects 
					résultant de l'utilisation du Site, notamment des pertes de données, de revenus, 
					de profits ou des interruptions d'activité.
				`
			}
		]
	},
	{
		title: "Article 10 - Modification des CGU",
		content: `
			Mon Enorme Tronc se réserve le droit de modifier les présentes CGU à tout moment. 
			Les modifications seront notifiées aux Utilisateurs et entreront en vigueur dès leur mise en ligne sur le Site.
		`
	},
	{
		title: "Article 11 - Droit Applicable et Juridiction Compétente",
		content: `
			Les présentes CGU sont régies par le droit français. Tout litige relatif à l'exécution 
			ou à l'interprétation des présentes CGU sera soumis à la compétence exclusive des tribunaux français.
		`
	},
	{
		title: "Article 12 - Contact",
		content: `
			Pour toute question concernant les présentes CGU, 
			l'Utilisateur peut contacter Mon Enorme Tronc à l'adresse suivante : 
			<a href="mailto:contact@monenormetroncs.fr" target="_blank" class="text-blue-500 underline">
				contact@monenormetroncs.fr
			</a>
		`
	}
];
</script>

<template>
	<section class="container my-12 lg:my-16 flex flex-col gap-12">
		<h1 class="text-3xl font-bold mb-4">
			Conditions Générales d'Utilisation (CGU)
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

				<div
					v-if="article.sections"
					class="flex flex-col gap-4"
				>
					<div
						v-for="(section, idx) in article.sections"
						:key="idx"
					>
						<h3 class="text-xl font-semibold mb-2">
							{{ section.subtitle }}
						</h3>

						<p>{{ section.text }}</p>
					</div>
				</div>
			</article>
		</div>
	</section>
</template>
