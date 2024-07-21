export const bundleCreatedTemplate = (username: string, commandId: string, url: string) => /* html */`
<p style="margin: 0 0 1rem;">Bonjour <b>${ username }</b>,</p>
<p style="margin: 0 0 1rem;">Nous vous informons qu'un colis pour votre commmande <strong>N°${commandId}</strong> a été créée.</p>
<p style="margin: 0 0 1rem;">Vous pouvez suivre l'avancement de votre commande et obtenir des informations détaillées sur celui-ci en cliquant sur le lien ci-dessous :</p>
<br>
<div style="text-align: center;">
	<a href="${ url }" class="button" style="display: inline-block; padding: 0.9375rem 1.5625rem; text-align: center; color: #ffffff; text-decoration: none; border-radius: 0.3125rem; background-color: #0a0a0a;">Voir ma commande</a>
</div>
`;
