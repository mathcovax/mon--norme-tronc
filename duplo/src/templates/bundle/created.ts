import { baseTemplate } from "../baseTemplate";

export const bundleCreatedTemplate = (username: string, idShip: string, commandId: string, url: string) => baseTemplate(/* html */`
<p style="margin: 0 0 1rem;">Bonjour <b>${ username }</b>,</p>
<p style="margin: 0 0 1rem;">Nous vous informons que le colis <strong>n°${idShip}</strong> pour votre commmande <strong>n°${commandId}</strong> a été créée.</p>
<p style="margin: 0 0 1rem;">Vous pouvez voir les détails de votre colis en cliquant sur le lien ci-dessous :</p>
<br>
<div style="text-align: center;">
	<a href="${ url }" class="button" style="display: inline-block; padding: 0.9375rem 1.5625rem; text-align: center; color: #ffffff; text-decoration: none; border-radius: 0.3125rem; background-color: #0a0a0a;">Voir mon colis</a>
</div>
`);
