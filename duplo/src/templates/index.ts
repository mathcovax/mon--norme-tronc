function getCurrentYear() {
	return new Date().getFullYear();
}

export const baseTemplate = (content: string) => /* html */`
<body bgcolor="#f0f0f0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" offset="0" style="padding: 4.375rem 0; font-family: Arial;">
  <table width="600" height="auto" align="center" cellpadding="0" cellspacing="0" style="border: 1px solid #dcdcdc; background-color: #fdfdfd;">
    <tr>
      <td width="600" height="auto" bgcolor="#000" border="0" style="display: block; margin: 0 auto; padding: 2.25rem 3rem;">
        <h1 style="margin: 0; text-align: left; font-size: 1.875rem; line-height: 2.25rem; font-weight: 700; color: #ffffff;">Mon Enorme Tronc (MET)</h1>
      </td>
    </tr>
    <tr>
      <td width="600" bgcolor="#fdfdfd" border="0" style="padding: 3rem; text-align: left; font-size: 0.875rem; line-height: 1.875rem; color: #737373;">
        ${ content }
      </td>
    </tr>
    <tr>
      <td width="600" border="0" style="opacity: 0.3; padding: 0 3rem 3rem; font-size: 0.75rem; line-height: 1.5625rem; text-align: center;">
        <p>&copy; ${ getCurrentYear() } Mon Enorme Tronc (MET). Tous droits réservés.</p>
      </td>
    </tr>
  </table>
</body>
`;
