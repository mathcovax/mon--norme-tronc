export const bundleArrivedTemplate = (username: string, commandId: string, url: string) => /* html */`
<p style="margin: 0 0 1rem;">Bonjour <b>${ username }</b>,</p>
<p style="margin: 0 0 1rem;">Nous vous informons que votre colis pour votre commmande <strong>N°${commandId}</strong> est arrivé.</p>
<p style="margin: 0 0 1rem;">Vous pouvez voir votre commande en cliquant sur le lien ci-dessous :</p>
<br>
<div style="text-align: center;">
	<a href="${ url }" class="button" style="display: inline-block; padding: 0.9375rem 1.5625rem; text-align: center; color: #ffffff; text-decoration: none; border-radius: 0.3125rem; background-color: #0a0a0a;">Voir ma commande</a>
</div>
<br>
<p style="margin: 0 0 1rem;">Nous vous remercions d'avoir commandé chez nous, amusez-vous bien avec votre nouveau jouet.</p>
`;
