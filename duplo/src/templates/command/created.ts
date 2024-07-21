export const createdCommandTemplate = (username: string, commandId: string, url: string) => /* html */`
<p style="margin: 0 0 1rem;">Bonjour <b>${ username }</b>,</p>
<p style="margin: 0 0 1rem;">Votre commande N°${ commandId } a été créée avec succès.</p>
<p style="margin: 0 0 1rem;">Vous pouvez suivre l'avancement de votre commande en cliquant sur le lien ci-dessous :</p>
<br>
<div style="text-align: center;">
	<a href="${ url }" class="button" style="display: inline-block; padding: 0.9375rem 1.5625rem; text-align: center; color: #ffffff; text-decoration: none; border-radius: 0.3125rem; background-color: #0a0a0a;">Voir ma commande</a>
</div>
`;
