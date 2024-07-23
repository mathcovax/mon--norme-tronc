<script setup lang="ts">
const { EDITO_RETURN_POLICY } = routerPageName;
</script>

<template>
	<div class="container my-12 lg:my-16 flex flex-col gap-12">
		<h1 class="text-3xl font-bold mb-4">
			Détails de Livraison
		</h1>

		<div class="flex flex-col gap-12">
			<article>
				<h2 class="text-2xl font-semibold mb-4">
					1. Modes de Livraison
				</h2>

				<p>Nous offrons plusieurs modes de livraison pour répondre à vos besoins :</p>

				<ul class="list-disc mt-2 ml-6">
					<li>Livraison standard : 3-5 jours ouvrables</li>

					<li>Livraison express : 1-2 jours ouvrables</li>

					<li>Livraison internationale : 7-14 jours ouvrables</li>
				</ul>
			</article>

			<article>
				<h2 class="text-2xl font-semibold mb-4">
					2. Frais de Livraison
				</h2>

				<p>Les frais de livraison varient en fonction du mode de livraison choisi et de la destination. Les frais exacts seront calculés et affichés au moment de la validation de votre commande.</p>
			</article>

			<article>
				<h2 class="text-2xl font-semibold mb-4">
					3. Délais de Traitement
				</h2>

				<p>Les commandes sont traitées et expédiées sous 1 à 2 jours ouvrables. Vous recevrez un e-mail de confirmation d'expédition avec un numéro de suivi dès que votre commande aura été expédiée.</p>
			</article>

			<article>
				<h2 class="text-2xl font-semibold mb-4">
					4. Suivi de Commande
				</h2>

				<p>Une fois votre commande expédiée, vous pouvez suivre son statut grâce au numéro de suivi fourni dans l'e-mail de confirmation d'expédition. Vous pouvez également suivre votre commande en vous connectant à votre compte sur notre site.</p>
			</article>

			<article>
				<h2 class="text-2xl font-semibold mb-4">
					5. Livraison Internationale
				</h2>

				<p>Nous livrons dans de nombreux pays à travers le monde. Les délais de livraison et les frais d'expédition varient en fonction de la destination. Veuillez noter que des frais de douane et des taxes peuvent s'appliquer pour les livraisons internationales, et ils sont à la charge du destinataire.</p>
			</article>

			<article>
				<h2 class="text-2xl font-semibold mb-4">
					6. Problèmes de Livraison
				</h2>

				<p>
					Si vous rencontrez des problèmes avec la livraison de votre commande, veuillez nous contacter à l'adresse suivante : <a
						href="mailto:contact@monenormetroncs.fr"
						target="_blank"
						class="text-blue-500 underline"
					>contact@monenormetroncs.fr</a>. Nous ferons de notre mieux pour résoudre le problème dans les plus brefs délais.
				</p>
			</article>

			<article>
				<h2 class="text-2xl font-semibold mb-4">
					7. Adresse de Livraison
				</h2>

				<p>Veuillez vous assurer que l'adresse de livraison fournie lors de la commande est correcte et complète. Nous ne pouvons pas être tenus responsables des colis non livrés en raison d'une adresse incorrecte ou incomplète.</p>
			</article>

			<article>
				<h2 class="text-2xl font-semibold mb-4">
					8. Modifications de la Commande
				</h2>

				<p>Si vous devez modifier les détails de votre commande (adresse de livraison, mode de livraison, etc.), veuillez nous contacter dès que possible. Nous ferons de notre mieux pour apporter les modifications demandées avant que votre commande ne soit expédiée.</p>
			</article>

			<article>
				<h2 class="text-2xl font-semibold mb-4">
					9. Retours et Échanges
				</h2>

				<p>
					Pour les informations sur les retours et les échanges, veuillez consulter notre <RouterLink
						:to="{ name: EDITO_RETURN_POLICY }"
						class="text-blue-500 underline"
					>
						Politique de Retours
					</RouterLink>.
				</p>
			</article>

			<article>
				<h2 class="text-2xl font-semibold mb-4">
					10. Contact
				</h2>

				<p>
					Pour toute question concernant la livraison, veuillez nous contacter à l'adresse suivante : <a
						href="mailto:contact@monenormetroncs.fr"
						target="_blank"
						class="text-blue-500 underline"
					>contact@monenormetroncs.fr</a>.
				</p>
			</article>
		</div>
	</div>
</template>
