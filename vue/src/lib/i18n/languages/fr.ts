export default {
	page: {
		[routerPageName.EDITO_HOME]: {
			heroTitle: "Faites vous\u00A0plaisir tout en restant naturel",
			heroSubtitle: "Des produits naturels et bio pour prendre soin de vous.",
			sectionNewTitle: "Nouveautés",
			sectionBestSellerTitle: "Meilleures ventes",
			sectionPackTitle: "Notre pack Plaisir",
			button: {
				discover: "Découvrir",
				more: "Voir plus",
			}
		},
		[routerPageName.AUTH_LOGIN]: {
			title: "Connexion",
			subtitle: "Connectez-vous pour accéder à votre compte.",
		},
		[routerPageName.AUTH_REGISTER]: {
			title: "Première visite ?",
			subtitle: "Créez un compte pour accéder à nos services.",
		},
		[routerPageName.ADMIN_PANEL_ORGANIZATIONS]: {
			form: {
				name: {
					label: "Nom de l'organisation",
				},
				owner: {
					label: "Propriétaire de l'organisation",
					textButton: "Trouver un propriétaire",
					placeholder: "{'owner.bg@gmail.com...'}",
					emptyLabel: "Aucun propriétaire."
				},
			},
			table: {
				searchPlaceholder: "Chercher une organization",
				col: {
					name: "Nom",
					active: "Actif",
					actions: "Actions"
				},
				action: {
					activate: "Activer",
					suspend: "Suspendre",
				}
			},
		},
		[routerPageName.ADMIN_PANEL_USERS]: {
			form: {
				primordialRole: {
					label: "Role Primordial",
				},
				muted: {
					label: "Rendre muet",
				},
			},
			table: {
				searchPlaceholder: "Chercher une email",
				searchPlaceholderRole: "Chercher par role",
			},
			btnClear: "Clear"
		},
		[routerPageName.CONTENT_PANEL_CATEGORIES]: {
			form: {
				oldName: {
					label: "Nom actuel : {currentName}"
				},
				name: {
					label: "Nom de la catégorie",
				},
				disabled: {
					desc: "Désactiver la catégorie"
				},
				submit: "Valider",
			},
			table: {
				searchPlaceholder: "Chercher une categorie",
				col: {
					name: "Nom",
					disabled: "Active"
				},
			}
		},
		[routerPageName.ORGANIZATION_MANAGE_USER]: {
			table: {
				searchPlaceholder: "Chercher une email",
			},
		},
		notFound: {
			title: "404 - Page introuvable",
			description: "La page que vous cherchez n'existe pas.",
			buttonText: "Retourner à l'accueil"
		},
	},
	layout: {
		default: {
			header: {
				home: "Accueil",
				bestSeller: "Meilleures ventes",
				new: "Contact",
				products: "Produits",
				dropdownAccount: {
					myAccount: "Mon compte",
					settings: "Paramètres",
					support: "Support",
					login: "Connexion",
					logout: "Déconnexion"
				},
			},
			footer: {
				slogan: "Le plaisir au naturel.",
				helpNav: {
					title: "Aide",
					clientSupport: "Support client",
					deliveryDetails: "Détails de livraison",
					generalConditions: "Conditions générales",
					confidentialityPolicy: "Politique de confidentialité",
				},
				faqNav: {
					title: "FAQ",
					account: "Compte",
					orders: "Commandes",
					payements: "Paiements",
				},
				pageNav: {
					title: "Pages",
					home: "Accueil",
					bestSeller: "Meilleures ventes",
					new: "Contact",
					products: "Produits",
				},
				copyrights: "Tous droits réservés."
			}
		},
		organization: {
			title: "Mon organisation",
			nav: {
				dashboard: "Tableau de bord",
				orders: "Commandes",
				products: "Produits",
				users: "Utilisateurs",
				analytics: "Analytiques",
			},
		}
	},
	role: {
		CUSTOMER: "Client",
		MODERATOR: "Modérateur",
		CONTENTS_MASTER: "Géstionaire",
		ADMIN: "Administrateur"
	},
	organizationRole: {
		STORE_KEEPER: "Magasinier",
		PRODUCT_SHEET_MANAGER: "Gestionaire de fiche produit",
		ACCOUNTANT: "Comptable",
		OWNER: "Propriétaire"
	},
	toast: {
		default: "Info",
		error: "Erreur",
		seccess: "Succès",
	},
	form: {
		submit: "Valider",
		rule: {
			required: "Champ obligatoire",
			maxLength: "Doit faire au maximum {value} caractères",
			minLength: "Doit faire au moins {value} caractères",
			invalidEmail: "Cette email est invalide.",
			minAge: "Vous devez avoir au moins {value} ans",
		}
	},
	label: {
		id: "ID",
		email: "Email",
		lastname: "Nom",
		firstname: "Prénom",
		birthDate: "Date de naissance",
		address: "Adresse",
		addressDefault: "Chercher votre adresse",
		empty: "Aucun résultat",
		terms: "J'accepte les conditions générales d'utilisation",
		user: "Utilisateur",
		role: "Rôle",
	},
	placeholder: {
		address: "Cherchez votre adresse",
		search: "Chercher",
	},
	button: {
		register: "S'inscrire",
		login: "Se connecter avec Google",
		validate: "Valider",
		cancel: "Annuler",
		close: "Fermer",
		save: "Enregister",
		send: "Envoyer",
		add: "Ajouter",
		clear: "Effacer",
		remove: "Retirer",
		delete: "Supprimer",
	},
	response: {
		organization: {
			alreadyExist: "Une organisation avec ce nom éxiste déjà.",
			created: "L'organisation a correctement étais créer.",
			edited: "L'organisation a correctement étais éditer",
			hasAlreadyUser: "Cette utilisateur est déja dans l'organization.",
			user: {
				add: "L'utilisateur a correctement étais ajouter.",
				edited: "L'utilisateur a correctement étais modifier.",
				deleted: "L'utilisateur a correctement étais supprimé."
			}
		},
		user: {
			edited: "L'utilisateur a bien été modifier.", 
			notfound: "Utilisateur introuvable.",
			alreadyOwner: "l'utilisateur est déjà owner d'une organisation."
		},
		category: {
			alreadyExist: "Le nom de catégory est déjà utilisais",
			created: "La catégory a correctement étais créer.",
			edited: "La catégory a correctement étais modifier.",
			notfound: "La catégorie n'existe pas",
		},
		product_sheet: {
			notfound: "la fiche produit n'existe pas",
		}
	}
};
