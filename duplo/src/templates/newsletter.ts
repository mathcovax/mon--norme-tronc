export const newsletterTemplate = (object: string, content: string) => /* html */`
<p style="margin: 0 0 1rem;">
	<h2 style="margin: 0; text-align: left; font-size: 1.5rem; line-height: 2rem; font-weight: 700; color: #ffffff;">${ object }</h2>
</p>
<div>
	${ content }
</div>
`;
