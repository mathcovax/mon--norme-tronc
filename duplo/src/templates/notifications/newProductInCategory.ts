export const newProductInCategoryTemplate = (username: string, url: string) => /* html */`
<p style="margin: 0 0 1rem;">Bonjour <b>${username}</b>,</p>
<p style="margin: 0 0 1rem;">Nous sommes ravis de vous annoncer l'arrivée d'un nouveau produit dans la catégorie que vous suivez !</p>
<p style="margin: 0 0 1rem;">Ne ratez pas cette opportunité unique de découvrir notre dernier produit :</p>
<br>
<div style="text-align: center;">
	<a href="${ url }" class="button" style="display: inline-block; padding: 0.9375rem 1.5625rem; text-align: center; color: #ffffff; text-decoration: none; border-radius: 0.3125rem; background-color: #0a0a0a;">Voir le produit</a>
</div>
`;
