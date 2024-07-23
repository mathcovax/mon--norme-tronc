<script setup lang="ts">
const cgvArticles = [
	{
		title: "1. Préambule",
		content: `
			Les présentes Conditions Générales de Vente (ci-après "CGV") ont pour objet de définir les conditions dans 
			lesquelles les entreprises (ci-après "Entreprises Vendeuses") utilisent la plateforme MET 
			(ci-après "la Plateforme") pour vendre des produits de divertissement sexuel pour adultes
			aux clients (ci-après "Clients"). En utilisant la Plateforme, les Entreprises Vendeuses acceptent
			sans réserve les présentes CGV.
		`
	},
	{
		title: "2. Identité de la Plateforme",
		content: `
			La plateforme MET est exploitée par MET, société par actions simplifiée (SAS) au capital de [insérer capital], 
			dont le siège social est situé [adresse]. MET est immatriculée au Registre du Commerce et des Sociétés de [ville] 
			sous le numéro [numéro]. La société est représentée par [nom du représentant légal], en qualité de [titre].
			Cette structure juridique est similaire à d'autres plateformes en ligne opérant dans des secteurs réglementés, 
			telles que Vinted pour la vente de vêtements de seconde main, LeBonCoin pour les petites annonces diverses, 
			et ManoMano pour la vente de produits de bricolage. Ces plateformes, tout comme MET, sont régies par des cadres 
			légaux stricts visant à assurer la conformité aux réglementations nationales 
			et à garantir la sécurité des transactions. Pour toute question relative à la société MET ou à ses activités, 
			vous pouvez nous contacter à l'adresse suivante : 
			<a 
				href="mailto:support@mon-enorme-tronc.fr" 
				class="text-blue-500 underline"
				target="_blank"
				>
					support@mon-enorme-tronc.fr
				</a>.
		`
	},
	{
		title: "3. Objet",
		content: `
			Les présentes CGV régissent les conditions de vente des produits proposés par les Entreprises Vendeuses sur la 
            Plateforme, ainsi que les droits et obligations des parties dans ce cadre.
		`
	},
	{
		title: "4. Produits Proposés",
		subSections: [
			{
				subTitle: "4.1 Nature des Produits",
				content: `
					Les produits proposés à la vente sur la Plateforme MET sont exclusivement des produits 
					de divertissement sexuel pour adultes. Ces produits peuvent inclure, sans s'y limiter :
				`,
				list: [
					"Jouets intimes (vibromasseurs, godemichets, etc.)",
					"Produits de bien-être sexuel (lubrifiants, huiles de massage, etc.)",
					"Lingerie et vêtements érotiques",
					"Accessoires pour jeux de rôle et BDSM (menottes, fouets, etc.)",
					"Équipements et gadgets technologiques liés à l'intimité"
				],
				warning: `
					Il est expressément stipulé que les livres et les DVD 
					ne sont pas autorisés à la vente sur la Plateforme.
				`
			},
			{
				subTitle: "4.2 Conformité Légale et Réglementaire",
				content: `
					Tous les produits mis en vente sur la Plateforme doivent être conformes aux lois
					et réglementations en vigueur en France. En particulier, les produits doivent respecter :
				`,
				list: [
					"Les normes de sécurité et de santé applicables aux produits de consommation.",
					"Les réglementations spécifiques aux produits de divertissement sexuel pour adultes.",
					`
						Les règles de protection des consommateurs, incluant l'affichage clair des informations 
						relatives aux produits (composition, utilisation, avertissements, etc.)
					`
				],
				additionalContent: `
					Les Entreprises Vendeuses sont responsables de s'assurer que leurs produits sont conformes à ces 
					exigences. La Plateforme se réserve le droit de vérifier la conformité des produits à tout moment 
					et de retirer de la vente tout produit non conforme.
				`
			},
			{
				subTitle: "4.3 Taxation",
				content: `
					Tous les produits vendus sur la Plateforme doivent être taxés à 20% de TVA, conformément à la législation 
					fiscale française. Les Entreprises Vendeuses sont responsables de la collecte et du versement de la TVA. 
					La Plateforme fournira l'infrastructure nécessaire pour appliquer la TVA lors des transactions, mais il 
					est de la responsabilité des Entreprises Vendeuses de s'assurer de la conformité fiscale de leurs opérations.
				`
			},
			{
				subTitle: "4.4 Critères de Sélection des Produits",
				content: `
					Pour être éligibles à la vente sur la Plateforme, les produits doivent également répondre aux critères de 
                  	qualité et de sécurité définis par la Plateforme :
				`,
				list: [
					`
						<strong>Qualité des Matériaux :</strong> Les produits doivent être fabriqués 
						à partir de matériaux de haute qualité, hypoallergéniques et sûrs pour l’utilisation humaine.
					`,
					`
						<strong>Normes de Sécurité :</strong> Les produits doivent respecter les normes de sécurité applicables, 
						incluant mais non limitées aux certifications CE, RoHS, ou autres certifications pertinentes.
					`,
					`
						<strong>Emballage et Étiquetage :</strong> Les produits doivent être correctement emballés 
						pour éviter tout dommage pendant le transport et étiquetés avec toutes les informations nécessaires, 
						y compris les références des produits (référence article ou SKU).
					`,
					`
						<strong>Instructions d’Utilisation :</strong> Les produits doivent être accompagnés 
						de notices d’utilisation claires et précises, rédigées en français.
					`
				]
			},
			{
				subTitle: "4.5 Refus de Produits",
				content: "La Plateforme se réserve le droit de refuser la mise en vente de certains produits qui :",
				list: [
					"Violent les lois ou règlements français.",
					"Sont jugés inappropriés ou offensants par la Plateforme.",
					"Ne respectent pas les critères de qualité ou de sécurité définis par la Plateforme."
				],
				additionalContent: `
					En cas de refus, l'Entreprise Vendeuse sera informée par écrit des motifs de ce refus et pourra, 
					le cas échéant, corriger les points soulevés pour se conformer aux exigences de la Plateforme.
				`
			},
			{
				subTitle: "4.6 Mises à Jour et Modifications",
				content: `
					La Plateforme peut modifier à tout moment les critères de sélection des produits 
					et les exigences de conformité pour s'adapter aux évolutions législatives, réglementaires, 
					ou aux standards de qualité et de sécurité. Les Entreprises Vendeuses seront informées 
					de ces modifications et devront s’y conformer pour continuer à proposer 
					leurs produits sur la Plateforme.
				`
			}
		]
	},
	{
		title: "5. Utilisation de la Plateforme",
		content: "Les Entreprises Vendeuses doivent respecter les obligations suivantes :",
		list: [
			"Fournir des produits conformes aux lois et réglementations en vigueur.",
			"Assurer la livraison des produits uniquement en France, à partir d'entrepôts situés en France.",
			"Faire apparaître sur le colis le numéro de référence du produit (référence article ou SKU).",
			`
				Gérer les demandes de remboursement par les Clients à travers la Plateforme, 
				en utilisant la référence ou le SKU du produit concerné.
			`
		]
	},
	{
		title: "6. Processus de Vente",
		subSections: [
			{
				subTitle: "6.1 Publication des Produits",
				content: "L’Entreprise Vendeuse commence par publier ses produits sur la Plateforme MET. Ce processus inclut :",
				list: [
					`
						<strong>Création de Compte :</strong> L’Entreprise Vendeuse doit créer un compte sur la Plateforme 
						en fournissant toutes les informations requises (raison sociale, coordonnées, informations bancaires, etc.).
					`,
					`
						<strong>Ajout de Produits :</strong> L’Entreprise Vendeuse télécharge les descriptions, images, prix, 
						et toutes autres informations nécessaires pour chaque produit.
					`,
					`
						<strong>Vérification de Conformité :</strong> Les produits sont soumis à une vérification de conformité 
						par la Plateforme pour s'assurer qu'ils respectent les critères de qualité, 
						de sécurité et de légalité définis dans les CGV.
					`,
					`
						<strong>Publication :</strong> Une fois vérifiés et approuvés, 
						les produits sont mis en ligne et disponibles à la vente sur la Plateforme.
					`
				]
			},
			{
				subTitle: "6.2 Passage de Commande par le Client",
				content: `
					Lorsqu’un Client visite la Plateforme et choisit un produit, 
					le processus de commande suit les étapes suivantes :
				`,
				list: [
					`
						<strong>Sélection du Produit :</strong>
						Le Client sélectionne le produit souhaité et l'ajoute à son panier.
					`,
					`
						<strong>Validation du Panier :</strong> Le Client vérifie les articles dans son panier 
						et passe à la validation de la commande.
					`,
					`
						<strong>Création de Compte ou Connexion :</strong> Si le Client n'a pas encore de compte, 
						il doit en créer un ou se connecter à un compte existant.
					`,
					`
						<strong>Saisie des Informations :</strong> Le Client fournit les informations nécessaires 
						pour la livraison et le paiement.
					`,
					`
						<strong>Choix du Mode de Livraison :</strong> Le Client choisit parmi les options de livraison 
						proposées par l’Entreprise Vendeuse.
					`,
					`
						<strong>Confirmation et Paiement :</strong> Le Client confirme la commande et effectue le paiement 
						via le prestataire de service de paiement de la Plateforme (Stripe).
					`
				]
			},
			{
				subTitle: "6.3 Traitement de la Commande par l’Entreprise Vendeuse",
				content: `
					Une fois la commande passée, l’Entreprise Vendeuse reçoit une notification 
					et doit procéder au traitement de la commande :
				`,
				list: [
					`
						<strong>Préparation de la Commande :</strong> L’Entreprise Vendeuse prépare la commande 
						en fonction des détails fournis par le Client.
					`,
					`
						<strong>Emballez et Étiquetez :</strong> Les produits doivent être emballés de manière sûre 
						et étiquetés avec toutes les informations nécessaires, y compris 
						la référence produit (référence article ou SKU).
					`,
					`
						<strong>Expédition :</strong> L’Entreprise Vendeuse expédie la commande 
						selon le mode de livraison choisi par le Client. La livraison doit être effectuée 
						dans les délais indiqués lors de la commande.
					`,
					`
						<strong>Notification de Livraison :</strong> Une fois la commande expédiée, 
						l’Entreprise Vendeuse doit informer la Plateforme et le Client en fournissant 
						les détails de suivi de la livraison.
					`
				]
			}
		]
	},
	{
		title: "7. Livraison",
		content: "La livraison des produits est gérée par les Entreprises Vendeuses. Elles doivent :",
		list: [
			"Assurer la livraison dans les délais indiqués lors de la commande.",
			"Utiliser des services de livraison fiables et suivre les colis jusqu'à leur réception par le Client.",
			"Informer le Client en cas de retard ou de problème avec la livraison."
		]
	},
	{
		title: "8. Réclamations et Retours",
		content: `
			Les Clients peuvent formuler des réclamations et effectuer des retours conformément à la politique de retour 
			de la Plateforme. Les Entreprises Vendeuses doivent traiter ces demandes avec diligence 
			et dans les délais impartis.
		`
	},
	{
		title: "9. Responsabilité",
		content: `
			Les Entreprises Vendeuses sont responsables de la conformité des produits qu'elles vendent sur la Plateforme. 
			Elles garantissent que les produits sont exempts de défauts et conformes à la description fournie.
		`
	},
	{
		title: "10. Propriété Intellectuelle",
		content: `
			Les Entreprises Vendeuses garantissent que les produits qu'elles mettent en vente sur la Plateforme ne violent 
			pas les droits de propriété intellectuelle de tiers.
		`
	},
	{
		title: "11. Protection des Données",
		content: `
			Les données personnelles des Clients sont collectées et traitées conformément à la politique de confidentialité 
            de la Plateforme et aux réglementations en vigueur.
		`
	},
	{
		title: "12. Modification des CGV",
		content: `
			La Plateforme se réserve le droit de modifier les présentes CGV à tout moment. Les modifications seront notifiées 
            aux Entreprises Vendeuses et entreront en vigueur immédiatement.
		`
	},
	{
		title: "13. Loi Applicable et Juridiction",
		content: `
			Les présentes CGV sont régies par la loi française. Tout litige relatif à leur interprétation ou à leur exécution 
            sera soumis à la compétence des tribunaux de [ville].
		`
	},
	{
		title: "14. Dispositions Finales",
		content: `
			Si une disposition des présentes CGV est jugée invalide ou inapplicable, 
			les autres dispositions resteront en vigueur.
		`
	}
];
</script>

<template>
	<div class="p-8">
		<h1 class="text-4xl font-bold mb-6">
			Conditions Générales de Vente (CGV) de la Plateforme MET
		</h1>

		<section
			v-for="article in cgvArticles"
			:key="article.title"
			class="mb-8"
		>
			<h2 class="text-2xl font-semibold mb-4">
				{{ article.title }}
			</h2>

			<article>
				<p
					v-html="article.content"
					class="mb-4"
				/>

				<ul
					v-if="article.list"
					class="list-disc pl-5 mb-4"
				>
					<li
						v-for="item in article.list"
						:key="item"
					>
						{{ item }}
					</li>
				</ul>

				<div v-if="article.subSections">
					<div
						v-for="subSection in article.subSections"
						:key="subSection.subTitle"
						class="ml-6 mb-4"
					>
						<h3 class="text-xl font-semibold mb-2">
							{{ subSection.subTitle }}
						</h3>

						<p
							v-html="subSection.content"
							class="mb-2"
						/>

						<ul
							v-if="subSection.list"
							class="list-disc pl-5 mb-2"
						>
							<li
								v-for="item in subSection.list"
								:key="item"
								v-html="item"
							/>
						</ul>

						<p
							v-if="subSection.warning"
							class="text-red-500"
						>
							{{ subSection.warning }}
						</p>

						<p
							v-if="subSection.additionalContent"
							v-html="subSection.additionalContent"
						/>
					</div>
				</div>
			</article>
		</section>
	</div>
</template>
