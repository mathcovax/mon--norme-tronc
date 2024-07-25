### Commande du projet

- Lancer le projet `npm run dev` (nécessite docker).

- Générer le client prisma `npm run generate:prisma`.

- Faire une migration Primas en DEV :

  - `npm run dev`
  - `npm run migrate:dev`

- Ouvrire les studio:
  - `npm run dev`
  - `npm run studio`

### Convention pour GIT

- Les noms des commits doivent être semblables à : `feat(${issueNumber}): subject`, `fix(${issueNumber}): subject`, `docs(${issueNumber}): subject` ...

- Les noms des branches doivent être semblables à : `feat/${issueNumber}`, `fix/${issueNumber}`, `docs/${issueNumber}` ...

### Convention pour DUPLO

- Tous les checkers doivent être créés dans le dossier `src/checkers`. Si vous importez un checker il faut utiliser le path `@checkers`.

- Toutes les `absractRoutes` et les `proccesses` concernant la sécurité (connexion, vérification supplémentaire...) doivent être créées dans le dossier `src/security`. Si vous importez depuis ce dossier, il faut utiliser le path `@security`.

- Si vous souhaitez créer un service, vous devez créer le fichier dans le dossier `src/services`. Les services doivent être des class avec des methods static. Si vous importez depuis ce dossier, il faut utiliser le path `@services`.

- Les noms des fichiers et des dossiers dans le dossier `src/routes` doivent être en `kebab-case`.

- Si vous avez une question et que Mathcovax n'est pas dispo, allez sur la [doc](https://github.com/duplojs/duplojs).

- Les variables d'ENV doivent être utiliées depuis la variable globale `ENV`.

- Les variables d'ENV sont des valeurs "sensibles" (mdp d'un compte ou autre). Définissez les dans le fichier `.env.local` qui est ignore par git.

### Convention pour VUE

- Le texte doit **impérativement** passer par i18n et non directement dans le markup.

- Les noms des composants doivent être en `PascalCase` et être minimum composés de 2 mots. Si vous n'en trouvez qu'un seul, vous pouvez le prefixer par `The`. Exemple : `Button` -> `TheButton`.

- Le dossier `src/components` contient uniquement des composants globaux. Ils ont pour but d'être flexibles et de pouvoir être utilisés à plusieurs endroits. Si vous souhaitez créer des composants qui ne seront utilisés qu'à un seul endroit, vous devez les créer dans le dossier `components` d'un domaine. Exemple de location du dossier composants d'un domaine : `src/domains/product/components`.

- Les noms des pages doivent être en `PascalCase` et être minimum composés de 2 mots. Si vous n'en trouvez qu'un seul, vous pouvez le sufixer par `Page`. Exemple : `Login` -> `LoginPage`.

- Les noms des layouts doivent être en `PascalCase` et être minimum composés de 2 mots. Si vous n'en trouvez qu'un seul, vous pouvez le sufixer par `Layout`. Exemple : `Base` -> `BaseLayout`.

- Les routes doivent être en `kebab-case`.

- Les arguments des routes doivent être en `camelCase`.

- La création d'un nouveau domain doit être disctuté en amont.

- Les pages doivent être systématiquement associées à un domaine. Exemple de location du dossier de pages d'un domaine : `src/domains/product/pages`.

- Le dossier `src/composables` contient uniquement des composables globaux. Ils ont pour but d'être flexibles et de pouvoir être utilisés à plusieurs endroits. Si vous souhaitez créer des composables qui ne seront utilisés qu'à un seul endroit, vous devez les créer dans le dossier `composables` d'un domaine. Exemple de location du dossier composables d'un domaine : `src/domains/product/composables`.

- Le dossier `src/stores` contient uniquement des stores globaux. Ils ont pour but d'être flexibles et de pouvoir être utilisés à plusieurs endroits. Si vous souhaitez créer un store qui ne sera utilisé que dans un seul domain, vous devez le créer dans le dossier `stores` d'un domaine. Exemple de location du dossier stores d'un domaine: `src/domains/product/stores`.

- Les noms des fichiers `typescript` doivent être en `camelCase`.

- Quand une fonction est bind a un event de component, la fonction doit être une `function`.

### Obtenir les Credentials Firebase

- Aller sur [cette page](https://console.firebase.google.com/u/0/project/mon-enorme-tronc).

- Une fois connecté, aller dans `⚙️` > `Paramètres du projet` > `Comptes de service`.

- Cliquer sur `Générer une nouvelle clé privée`, (cela vous téléchargera un fichier json).

- Placer le fichier json ici `duplo/firebase.credential.json`.

### Guide de survie duplojs

l'élément principale qui vous permettera de debug c'est le champ `info` dans le header.

Les différente info que vous pouvez rencontré qui son r'envoyer par duplojs:

- `INTERNAL_SERVER_ERROR` accompagner d'un status 500. Signifie qu'il y a ue une erreur pendant l'éxection des diférente étape de la route. Danse ce cas, il faut regader le body de la réponse, c'est ici que ce situe le détaile de l'erreur.
- pas d'info mais code 500L. Si vous faite n'impote quoi cela peux arrivé, bonne chance ! vous pouvez quand même le contenu du body.
- `NO_RESPONSE_SENT` acompagner d'un status 503. Signifie que vous n'avez pas envoyer de response. vérifier bien vos condition.
- `NOTFOUND` accompagner d'un status 404. signifi que la route n'est pas enregister dans le router. Vérifier que vous utilisais la bonne méthod et le bon path.
- `TYPE_ERROR...` accompagner d'un status 400. Signifi qu'un schema d'un de vos extract n'est pas valide. Vous pouvez véfifier le body pour avoir plus d'info.
- `WHAT_WAS_SENT_ERROR` accompagner d'une 500. Signifi que votre contra de sortie n'a pas étais respstecter. Vérifié les class `IHaveSentThis` de votre route. Vous pouvais regarder le body et les headers `catch-info`et `catch-code` pour avoir plus d'information.

**Toute ces régle sont valide pour les TU.**

#### Comment Obtenir un access-token:

Les acces-token son générer par notre back-end et serre a nous identifier. **A ne pas confondre avec le idToken de firebase**. L'idToken de firebase nous serre a certifier l'appartenance d'une address email a un utilisateur, avec cela nous povons le trouvez en base de donner pour l'authentifier.

la façon la plus simple pour obtenir un access-token est de vous rendre sur `/login` et de clicker sur le button "Se connecter avec Google". Si c'est la premier fois ou que votre base est vide, vous serrez rediriger vers le formulaire d'enregistrement. Compléter le. une fois rediriger vers `/`. Vous povez allez cherchez l'access-token dans votre localStorage. **Attention a ne pas le coller plus d'une fois, sinon cela ne fonctionera pas**. l'info associer a un access-token invalide est `access.token.invalid`.

#### Recource importante pouvant vous aider.

- Le studio prisma, lancer la commande `npm run studio` et rendez vous sur votre port `5555`. le studio est un DB viwer du point de vue de l'ORM. Il peut vous permettre de créer des entiter a la volez facilement.
- Les swagger, il suffit que duplo sois lancer. rendez vous sur `/api/swagger`. il vous permettera de visualisé toute les routes est leurs paramétre.
