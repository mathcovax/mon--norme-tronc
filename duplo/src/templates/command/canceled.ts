import { baseTemplate } from "../baseTemplate";

export const canceledCommandTemplate = (username: string, commandId: string, url: string) => baseTemplate(/* html */`
<p style="margin: 0 0 1rem;">Bonjour <b>${ username }</b>,</p>
<p style="margin: 0 0 1rem;">Nous vous informons que votre commande <strong>n°${commandId}</strong> a été annulée.</p>
<p style="margin: 0 0 1rem;">Vous pouvez voir votre commande annulée ici :</p>
<br>
<div style="text-align: center;">
	<a href="${ url }" class="button" style="display: inline-block; padding: 0.9375rem 1.5625rem; text-align: center; color: #ffffff; text-decoration: none; border-radius: 0.3125rem; background-color: #0a0a0a;">Voir ma commande</a>
</div>
`);
