export const welcomeTemplate = (username: string, url: string) => /* html */`
<p style="margin: 0 0 1rem;">Bonjour <b>${ username }</b>,</p>
<p style="margin: 0 0 1rem;">Nous sommes ravis de vous accueillir sur Mon Enorme Tronc et espérons que vous y trouverez votre bonheur ! 😊</p>
<p style="margin: 0 0 1rem;">Pour commencer, cliquez sur le bouton ci-dessous pour explorer notre site et découvrir nos produits uniques :</p>
<br>
<div style="text-align: center;">
	<a href="${ url }" class="button" style="display: inline-block; padding: 0.9375rem 1.5625rem; text-align: center; color: #ffffff; text-decoration: none; border-radius: 0.3125rem; background-color: #0a0a0a;">Découvrir MET</a>
</div>
`;
