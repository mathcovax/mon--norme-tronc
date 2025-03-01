import type { Bundle, CommandStatus, Facet, OrganizationRole, PrimordialRole, ProductReturn } from "@/lib/utils";

export default {
	page: {
		[routerPageName.EDITO_HOME]: {
			heroTitle: "Faites vous\u00A0plaisir tout en restant naturel",
			heroSubtitle: "Des produits naturels et bio pour prendre soin de vous.",
			sectionNewTitle: "Nouveautés",
			sectionWomanTitle: "Pour les femmes",
			sectionManTitle: "Pour les Hommes",
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
			seeCgu: "Voir les conditions générales d'utilisation",
		},
		[routerPageName.USER_EDIT_PROFIL]: {
			title: "Mon profil",
			btnPullData: "Récupérer mes données",
			btnDelete: "Supprimer le compte",
			deletePopup: {
				title: "Êtes vous sur de vouloir supprimer le compte.",
				content: "Cette action est irréversible et entraînera la perte de toutes vos données."
			}
		},
		[routerPageName.USER_ORGANIZATIONS]: {
			title: "Mes organisations",
			emptyTitle: "Vous n'avez pas encore d'organisation.",
			emptySubtitle: "Créez ou rejoignez une organisation pour commencer à vendre vos produits.",
			table: {
				searchPlaceholder: "Chercher une organization",
				col: {
					name: "Nom",
					label: "Label",
					actions: "Actions"
				},
				action: {
					goTo: "Aller à l'organisation",
				}
			},
		},
		[routerPageName.CATEGORIES_PAGE]: {
			title: "Catégories",
			emptyTitle: "Aucune catégorie n'a été trouvée.",
			emptySubtitle: "Revenez plus tard pour voir les nouveautés.",
			buttonBack: "Revenir à l'accueil",
		},
		[routerPageName.ORGANIZATION_MANAGE_PROMOTION]: {
			title: "Liste des promotions",
			table: {
				searchPlaceholder: "Chercher une promotion",
				percentage: "{value} %",
				col: {
					percentage: "Pourcentage (%)",
					startDate: "Date de début",
					endDate: "Date de fin",
					productSheetName: "Nom de la fiche produit",
					actions: "Actions"
				},
				action: {
					edit: "Editer",
					delete: "Supprimer",
				}
			},
			form: {
				title: "Créer une promotion",
				endDateGteStartDate: "La date de début doit être inférieure à la date de fin.",
				endDateEStartDate: "La date de début doit être différente de la date de fin.",
			},
			popup: {
				title: "Voulez-vous vraiment supprimer cette promotion ?",
				content: "Si vous validez, cette promotion sera retirée de votre produit."
			}
		},
		[routerPageName.CATEGORY_PAGE]: {
			emptyTitle: "Cette catégorie n'a pas encore de produits.",
			emptySubtitle: "Revenez plus tard pour voir les nouveautés.",
			buttonBack: "Revenir aux catégories",
			quantityProduct: "{count} produit(s) trouvé(s).",
			title: "{value}",
		},
		get [routerPageName.SEARCH_PAGE]() {
			return {
				...this[routerPageName.CATEGORY_PAGE],
				emptyTitle: "Aucun produit trouvé.",
				buttonBack: "Revenir aux catégories",
				title: "Resultat pour \"{value}\"",
			};
		},
		[routerPageName.PRODUCT_PAGE]: {
			addCartButton: "Ajouter au panier",
			label: {
				productDetails: "Détails du produit",
				comments: "Commentaires",
			},
			relatedProducts: "Produits similaires",
			noStock: "Plus de Stock.",
			lte10: "Plus que {value} !",
		},
		[routerPageName.EDITO_ORGANIZATION_INFO]: {
			label: {
				id: "ID",
				label: "Label",
				emailSupport: "Email de support",
				none: "Aucun",
			}
		},
		[routerPageName.USER_CART]: {
			title: "Mon panier",
			emptyTitle: "Votre panier est vide.",
			emptySubtitle: "Commencez à ajouter des produits pour les retrouver ici.",
			browseButton: "Parcourir les produits",
			orderButton: "Passer la commande",
			popup: {
				title: "Voulez-vous vraiment supprimer ce produit ?",
				content: "Si vous validez, ce produit sera retiré de votre panier."
			}
		},
		[routerPageName.USER_COMMANDS]: {
			title: "Vos commandes",
			searchPlaceholder: "Rechercher une commande",
			command: {
				label: {
					date: "COMMANDE EFFECTUÉE LE",
					total: "TOTAL",
					address: "LIVRAISON À",
					commandNumber: "N° DE COMMANDE",
				},
				price: "{value} €",
			},
			product: {
				quantity: "Quantité : {value}",
				processQuantity: "Quantité traitée : {value}",
				selledBy: "Vendu par : {value}",
				price: "Prix : {value} €",
				reBuy: "Acheter à nouveau",
			},
			noCommands: "Aucune commande.",
		},
		get [routerPageName.USER_COMMAND]() {
			return {
				title: "Détails de la commande",
				returnBack: "Retour",
				command: {
					label: {
						date: "Commandé le {value}",
						commandNumber: "N° de commande : { value }",
					},
					seeInvoice: "Voir la facture",
					deliveryAddress: "Adresse de livraison",
					recapCommand: "Récapitulatif de la commande",
					boughtProducts: "Produit(s) acheté(s) : {value}",
					totalPrice: "Montant total TTC : {value} €",
				},
				product: {
					...this[routerPageName.USER_COMMANDS].product,
					title: "Produit(s)",
				},
				bundle: {
					title: "Colis associé(s)",
					id: "identifiant du Paquet : {id}",
					carrierName: "Nom du transporteur : ",
					status: "Status : ",
					productsCount: "Nombre de produits dans le paquet : {value}",
				}
			};
		},
		[routerPageName.ORDER_PAGE]: {
			title: "Ma commande",
			stepTitle: {
				orderInfos: "Informations de la commande",
				cart: "Panier",
				payment: "Paiement",
				success: "Paiement réussi",
				failed: "Echec du paiement",
			},
			step: {
				successMessage: "Votre commande a bien été enregistrée.",
				failedMessage: "Votre commande n'a pas pu être enregistrée.",
				info: "Vos informations",
				cart: {
					title: "Votre panier",
					productName: "Nom du produit : {value}",
					price: "Prix : {value} €",
					quantity: "Quantité : {value}",
					total: "Prix total : {value} €",
				},
				success: "Paiement réussi",
				error: "Echec du paiement",
			}
		},
		[routerPageName.ADMIN_PANEL_HOME]: {
			title: "Bienvenue sur le panneau d'administration",
		},
		[routerPageName.ADMIN_PANEL_ORGANIZATIONS]: {
			title: "Liste des organisations",
			form: {
				title: "Créer une organisation",
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
				searchPlaceholder: "Chercher une organisation",
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
			title: "Liste des utilisateurs",
			form: {
				primordialRole: {
					label: "Rôle Primordial",
				},
				muted: {
					label: "Rendre muet",
				},
			},
			table: {
				searchPlaceholder: "Chercher un email",
				searchPlaceholderRole: "Chercher par rôle",
			},
			btnClear: "Effacer les filtres",
		},
		[routerPageName.ORGANIZATION_MANAGE_USER]: {
			title: "Gestion des utilisateurs",
			form: {
				title: "Ajouter un utilisateur",
			},
			table: {
				searchPlaceholder: "Chercher un email",
			},
		},
		[routerPageName.ORGANIZATION_GET_PRODUCT_SHEET]: {
			title: "Liste des fiches produits",
			searchPlaceholder: "Chercher un produit",
			price: "Prix",
		},
		[routerPageName.ORGANIZATION_EDIT_PRODUCT_SHEET]: {
			title: "Editer la fiche produit",
			shortDescription: "Description courte",
			price: "Prix",
			form: {
				placeholder: "Chercher des catégories",
				image: "Image du produit",
				addImage: "Ajouter une image",
				warehouseLabel: "Entrepôt",
				warehousePlaceholder: "Entrer un entrepôt",
				variationGroup: "Groupe de variation",
				variationName: "Nom de la variation",
				facet: {
					add: "Ajouter une Facet",
				}
			}
		},
		get [routerPageName.ORGANIZATION_CREATE_PRODUCT_SHEET]() {
			return {
				...this[routerPageName.ORGANIZATION_EDIT_PRODUCT_SHEET],
				title: "Créer une fiche produit",
			};
		},
		[routerPageName.ORGANIZATION_HOME]: {
			title: "Bienvenue sur le panneau de gestion de l'organisation",
		}, 
		[routerPageName.ORGANIZATION_EDIT]: {
			title: "Modification de l'organisation",
			form: {
				logo: "Logo",
				addLogo: "Ajouter un logo",
				organizationLabel: "Label de l'organisation",
				emailSupport: "Email de support",
			},
			label: {
				noLogo: "Vous n'avez pas de logo. Ajoutez-en un !"
			}
		},
		[routerPageName.ORGANIZATION_GET_WAREHOUSE]: {
			title: "Liste des entrepôts",
			searchPlaceholder: "Chercher un entrepôt",
			form: {
				title: "Créer un entrepôt",
			},
			placeholder: {
				name: "nom de l'entrepôt"
			}
		},
		[routerPageName.CONTENT_PANEL_HOME]: {
			title: "Bienvenue sur le panneau de gestion du contenu",
		},
		[routerPageName.CONTENT_PANEL_NAVIGATION_BAR]: {
			title: "Éléments de la barre de navigation",
			form: {
				title: "Ajouter un élément",
			},
			label: {
				priority: "Priorité",
				select: "Selectionner",
			},
			table: {
				linked: "Lier",
			},
			popup: {
				title: "Voulez-vous vraiment supprimer cet élément ?",
				content: "Si vous validez, cet élément de la barre de navigation sera supprimé définitivement."
			}
		},
		[routerPageName.CONTENT_PANEL_PARENT_CATEGORIES]: {
			title: "Liste des catégories parents",
			form: {
				title: "Créer une catégorie parent",
			},
			label: {
				name: "Nom de la catégorie parent",
				linkCategories: "Categories associées",
				placeholder: "Nom de la catégorie"
			},
			table: {
				name: "Nom de la catégorie parent",
				searchPlaceholder: "Chercher par le nom de la catégorie parent",
			}
		},
		[routerPageName.CONTENT_PANEL_CATEGORIES]: {
			title: "Liste des catégories",
			form: {
				title: "Créer une catégorie",
				oldName: {
					label: "Nom actuel : {currentName}"
				},
				name: {
					label: "Nom de la catégorie",
				},
				disabled: {
					desc: "Désactiver la catégorie"
				},
				selectImage: "Sélectionner une image",
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
		[routerPageName.CONTENT_PANEL_NEWSLETTERS]: {
			title: "Liste des newsletters",
			form: {
				title: "Créer une newsletter",
				label: {
					object: "Titre",
					content: "Contenu",
					sendAt: "Date d'envoi",
				}
			},
			table: {
				searchPlaceholder: "Chercher un titre",
				label: {
					title: "Titre",
					createdAt: "Date de création",
				},
			},
			popup: {
				title: "Voulez-vous vraiment supprimer cette newsletter ?",
				content: "Si vous validez, cette newsletter sera supprimée définitivement."
			}
		},
		notFound: {
			title: "404 - Page introuvable",
			description: "La page que vous cherchez n'existe pas.",
			buttonText: "Retourner à l'accueil"
		},
		[routerPageName.ORGANIZATION_MANAGE_PRODUCT]: {
			title: "Liste des produits",
			table: {
				ref: "Reférence",
				sku: "SKU",
				name: "Nom",
				quantity: "Stock",
				productSheetName: "Fiche Produit",
				lastEdit: "Modifié le",
				status: "Status",
				warehouseName: "Entrepôt"
			},
			form: {
				title: "Ajouter un produit",
				sku: "Référence",
				skuPlaceholder: "Entrer une référence",
				productSheetLabel: "Fiche produit",
				productSheetPlaceholder: "Entrer une fiche produit",
			},
			searchPlaceholder: "Chercher un produit",
			popupWrongMessage: "Êtes-vous sur de vouloir changer le status de cette réference ?"
		},
		[routerPageName.ORGANIZATION_COMMANDS]: {
			title: "Liste des commandes à traiter",
			table: {
				date: "Date de la commande",
				quantity: "Quantité de produits",
				id: "ID de la commande",
				quantityRest: "Produit à traiter",
				productSheetRef: "Référence du produit",
				productSheetName: "Nom du produit",
				image: "Image du produit",
			},
			cb: {
				textButton: "Sélectionner un entrepôt",
				placeholder: "Mon super entrepôt..."
			},
			form: {
				idShip: "idShip la poste",
				addItem: "Ajouter un produit dans le Bundle",
				butonSku: "Sélectionner un produit",
				placeholderSku: "Mon super SKU",
			}
		},
		[routerPageName.USER_BUNDLE]: {
			transport: "Transporteur du colis :",
			idShip: "Numéro de suivi : {value}",
			status: "Status du colis :",
			content: "Contenu du colis :",
			action: "Action en cours : {value}",
			carrierSite: "Voir le site du transporteur", 
			table: {
				image: "",
				name: "Nom",
				quantity: "quantité"
			}
		},
		[routerPageName.ORGANIZATION_PRODUCT_RETURN]: {
			label: {
				reason: "Raison"
			},
			button: {
				refund: "Remboursé",
				invalid: "Invalidé",
				putInWaiting: "Mettre en attente",
			}
		},
		[routerPageName.MODERATOR_PANEL_HOME]: {
			title: "Bienvenue sur le panneau de modération",
		},
		[routerPageName.MODERATOR_PANEL_CHECK_PRODUCT_SHEET_REVIEW]: {
			button: {
				delete: "Supprimer le commentaire",
				deleteAndMute: "Supprimer le commentaire & Mute l'utilisateur",
				check: "Valider le commentaire",
				refresh: "Retrouver un commentaire",
			},
			emptyReview: "Plus de commentaire à vérifier.",
		},
		[routerPageName.MODERATOR_PANEL_CHECK_PRODUCT_SHEET]: {
			button: {
				check: "Valider la fiche produit",
				refresh: "Retrouver une fiche produit",
			},
			emptyProductSheet: "Plus de fiche produit à vérifier.",
		},
		[routerPageName.ORGANIZATION_ANALYTICS]: {
			title: "Analytiques",
			select: {
				add: "Créer un graphique",
			},
			graphic: {
				value: "Valeur unique",
				line: "Graphique en ligne",
				bar: "Graphique en barre",
				pie: "Graphique en camembert",
				donut: "Graphique en donut",
				area: "Graphique en zone",
				top: "Top",
			},
			button: {
				save: "Enregistrer le style",
			},
			form: {
				title: "Créer un graphique : ",
				label: {
					facet: "Facet",
					productSheet: "Fiche produit",
					category: "Catégorie",
					categories: "Catégories",
					facets: "Facets",
					startDate: "Date de début",
					endDate: "Date de fin",
				},
				placeholder: {
					facet: "facet",
					productSheet: "fiche produit",
					category: "catégorie",
				},
				rule: {
					endDateEStartDate: "La date de début doit être différente de la date de fin.",
					endDateGteStartDate: "La date de début doit être inférieure à la date de fin.",
				},
				textButton: {
					category: "Trouver une catégorie",
					productSheet: "Trouver une fiche produit",
					facet: "Trouver un facet",
				}
			},
			text: {
				top: "Classement",
				deleteWidget: "Êtes-vous sur de vouloir supprimer ce widget ?",
				noData: "Vous n'avez configurez aucun widget.",
			}
		},
	},
	filters: {
		title: "Filtres",
		name: {
			price: "Prix",	
			color: "Couleur",
			size: "Taille",
			diameter: "Diamètre",
			target: "Cible",
			accessory: "Accessoire",
			material: "Matériau",
			stimulation: "Stimulation",
			promotion: "En promo",
			rate: "Avis", 
		},
		type: {
			range: {
				price: "{value} €"
			},
			radio: {
				undefined: "Aucun"
			}
		},
		values: {
			color: {
				red: "Rouge",
				blue: "Bleu",
				green: "Vert",
				yellow: "Jaune",
				black: "Noir",
				white: "Blanc",
			},
			size: {
				small: "Petit",
				medium: "Moyen",
				large: "Grand"
			},
			diameter: {
				"20mm": "20mm",
				"30mm": "30mm",
				"40mm": "40mm",
				"50mm": "50mm",
				"60mm": "60mm",
			},
			target: {
				man: "Homme",
				woman: "Femme",
				"man/woman": "Homme/Femme",
			},
			accessorie: {
				accessory: "Accessoires"
			},
			material: {
				wood: "Bois",
				plastic: "Plastique"
			},
			stimulation: {
				anal: "Anale",
				vaginal: "Vaginale",
				clitoral: "Clitorale",
				prostate: "Prostate"
			},
			rate: {
				5: "5 étoile",
				4: "4 étoile",
				3: "3 étoile",
			}
		}
	},
	layout: {
		default: {
			header: {
				home: "Accueil",
				bestSeller: "Meilleures ventes",
				new: "Contact",
				products: "Produits",
				dropdown: {
					myAccount: "Mon compte",
					myCommands: "Mes commandes",
					editProfil: "Editer mon profil",
					myOrganizations: "Mes organisations",
					support: "Support",
					management: "Gestion",
					admin: "Administration",
					moderator: "Modération",
					organizations: "Organisations",
					content: "Contenu",
					login: "Connexion",
					logout: "Déconnexion",
					notifications: {
						title: "Notification(s)",
						seeMore: "Voir plus",
						noNotifications: "Aucune notification.",
						links: {
							default: "Voir le produit",
							productNoStock: "Rajouter du stock",
						}
					},
				},
			},
			footer: {
				slogan: "Le plaisir au naturel.",
				helpNav: {
					title: "Aide",
					clientSupport: "Support client",
					deliveryDetails: "Détails de livraison",
					returnPolicy: "Politique de retour",
					generalConditions: "Conditions générales d'utilisation",
					termsOfSales: "Conditions générales de vente",
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
		admin: {
			hello: "Bonjour {value} ! Vous êtes",
			title: "Panneau d'administration",
			nav: {
				home: "Tableau de bord",
				organizations: "Organisations",
				users: "Utilisateurs",
			},
			dropdown: {
				management: "Gestion",
				admin: "Administration",
				organizations: "Mes organisations",
				content: "Gestion du contenu",
				backHome: "Retour à l'accueil",
				logout: "Déconnexion"
			}
		},
		organization: {
			title: "Mon organisation",
			nav: {
				"organization-panel": "Tableau de bord",
				"organization-panel-organization-edit": "Modifier l'organisation",
				"organization-commands": "Commandes",
				"organization-panel-manage-product": "Produits",
				"organization-panel-manage-promotion": "Promotions",
				"organization-panel-manage-user": "Utilisateurs",
				"organization-panel-get-warehouse": "Entrepôts",
				"organization-panel-get-product-sheet": "Fiches produits",
				"organization-product-return": "Retours Produits",
				"organization-panel-analytics": "Analytiques",
			},
		},
		content: {
			hello: "Bonjour {value} ! Vous êtes",
			title: "Gestion du contenu",
			nav: {
				dashboard: "Tableau de bord",
				navbar: "Barre de navigation",
				parentCategories: "Catégories parents",
				categories: "Catégories",
				newsletters: "Newsletters",
			},
			dropdown: {
				management: "Gestion",
				admin: "Administration",
				organizations: "Mes organisations",
				content: "Gestion du contenu",
				backHome: "Retour à l'accueil",
				logout: "Déconnexion"
			}
		},
		moderator: {
			nav: {
				"moderator-panel-home": "tableau de bord",
				"moderator-panel-check-product-sheet-review": "Check Commentaires",
				"moderator-panel-check-product-sheet": "Check Fiche Produit",
				"home": "Retour à l'accueil"
			}
		}
	},
	productStatus: {
		WRONG: "SUPPRIMÉ",
		IN_STOCK: "EN STOCK",
		SOLD: "VENDU",
		ORDER: "COMMANDÉ",
	},
	role: {
		CUSTOMER: "Client",
		MODERATOR: "Modérateur",
		CONTENTS_MASTER: "Gestionnaire",
		ADMIN: "Administrateur"
	} satisfies Record<PrimordialRole, string>,
	organizationRole: {
		STORE_KEEPER: "Magasinier",
		PRODUCT_SHEET_MANAGER: "Gestionaire de fiche produit",
		ACCOUNTANT: "Comptable",
		OWNER: "Propriétaire"
	} satisfies Record<OrganizationRole, string>,
	modal: {
		age: {
			title: "Vérification de l'âge",
			content: "Vous devez avoir plus de 18 ans pour accéder à ce site.",
			confirm: "J'ai plus de 18 ans",
			cancel: "Je suis mineur",
		},
	},
	toast: {
		default: "Info",
		error: "Erreur",
		seccess: "Succès",
	},
	form: {
		submit: "Valider",
		rule: {
			required: "Champ obligatoire.",
			positive: "Doit être un nombre positif.",
			max: "Ne doit pas dépasser {max}.",
			min: "Doit faire au moins {min}.",
			maxLength: "Doit faire au plus {value} caractères.",
			minLength: "Doit faire au moins {value} caractères.",
			invalidEmail: "Cet email est invalide.",
			minAge: "Vous devez avoir au moins {value} ans.",
			maxItems: "Vous pouvez selectionner au plus {value} éléments.",
			blobToLarge: "L'image est supérieure à {value} Mo.",
			minItems: "Vous devez selectionner minimum {value} éléments.",
			url: "Doit être sous la forme /path/to/page",
			minDate: "Doit être après le {value}.",
		}
	},
	label: {
		id: "ID",
		email: "Email",
		lastname: "Nom",
		firstname: "Prénom",
		birthDate: "Date de naissance",
		address: "Adresse",
		newsletter: "S'abonner à la newsletter",
		productStock: "Être notifié des restocks",
		promotions: "Être notifié des promotions",
		newProductsInCategory: "Être notifié des nouveaux produits",
		productSheet: "Fiche produit",
		percentage: "Pourcentage (%)",
		startDate: "Date de début",
		endDate: "Date de fin",
		delivreryAddress: "Adresse de livraison",
		addressDefault: "Chercher votre adresse",
		empty: "Aucun résultat",
		terms: "J'accepte les conditions générales d'utilisation",
		user: "Utilisateur",
		role: "Rôle",
		actions: "Actions",
		description: "Description",
		createdAt: "Date de création",
		updatedAt: "Date de modification",
		categories: "Catégories",
		image: "Image",
		type: "Type",
		title: "Titre",
		ref: "Référence",
		sku: "SKU",
		status: "status",
		reason: "Raison",
		pseudo: "Pseudo",
		content: "Contenu",
		rate: "Note"
	},
	placeholder: {
		address: "Chercher votre adresse",
		productSheet: "Chercher une fiche produit",
		search: "Chercher",
	},
	button: {
		register: "S'inscrire",
		login: "Se connecter avec Google",
		validate: "Valider",
		cancel: "Annuler",
		create: "Créer",
		close: "Fermer",
		save: "Enregister",
		send: "Envoyer",
		add: "Ajouter",
		search: "Rechercher",
		pay: "Payer",
		edit: "Modifier",
		retry: "Réessayer",
		clear: "Effacer",
		remove: "Retirer",
		delete: "Supprimer",
		back: "Retour",
		backToHome: "Retourner à l'accueil",
		seeMore: "Voir plus",
	},
	navigationItemType: {
		PARENT_CATEGORY: "Catégorie parent",
		CATEGORY: "Catégorie",
		LINK: "Lien",
	},
	facetType: {
		COLOR: "Couleur",
		SIZE: "Taille",
		DIAMETER: "Diamètre",
		TARGET: "Cible",
		ACCESSORY: "Accessoire",
		MATERIAL: "Matériau",
		STIMULATION: "Stimulation",
	} satisfies Record<Facet["type"], string>,
	carrierName: {
		LA_POSTE: "La poste"
	} satisfies Record<Bundle["carrierName"], string>,
	bundleStatus: {
		CREATED: "Créer",
		BACK: "Retour à l'entrepôt",
		BACK_DONE: "Arrivé a l'entrepôt",
		CARRIER_SUPPORTED: "Colis pris en charge par le transporteur.",
		CARRIER_PROCESS: "En cours de traitement par le transporteur",
		UNDELIVERABLE: "Non livrable",
		DONE: "livré",
		DONE_OFFICE: "livré au point relais",
	} satisfies Record<Bundle["status"], string>,
	commandStatus: {
		CANCELED: "Annulée",
		WAITING_PAYMENT: "En attente de paiement",
		IN_PROGRESS: "En cours de traitement",
		IN_DELIVERY: "En cours de livraison",
		DONE: "Livrée"
	} satisfies Record<CommandStatus, string>,
	productReturnStatus: {
		INVALID: "Retour produit invalide",
		REFUNDED: "produit remboursé.",
		WAITING_RETURN: "En attente du retour du produit.",
	} satisfies Record<ProductReturn["status"], string>,
	response: {
		organization: {
			alreadyExist: "Une organisation avec ce nom existe déjà.",
			created: "L'organisation a correctement été créée.",
			edited: "L'organisation a été modifiée avec succès.",
			hasAlreadyUser: "Cette utilisateur est déjà dans l'organisation.",
			user: {
				add: "L'utilisateur a correctement été ajouté.",
				edited: "L'utilisateur a correctement été modifié.",
				deleted: "L'utilisateur a correctement été supprimé."
			},
			image: {
				missing: "Aucune image n'a été sélectionnée.",
				edited: "L'image a été ajoutée à l'organisation avec succès."
			}
		},
		user: {
			edited: "L'utilisateur a bien été modifié.", 
			notfound: "Utilisateur introuvable.",
			alreadyOwner: "l'utilisateur est déjà propriétaire d'une organisation.",
			pullData: "Vos données vous seront envoyées par mail.",
			intervalPullData: "Vous devez attendre 30 minutes avant de redemander vos données.",
		},
		category: {
			alreadyExist: "Le nom de catégorie est déjà utilisé",
			created: "La catégorie a correctement été créée.",
			edited: "La catégorie a correctement été modifiée.",
			notfound: "La catégorie n'existe pas.",
		},
		productSheet: {
			notfound: "La fiche produit n'existe pas.",
			edited: "La fiche a correctement été éditée.",
			created: "La fiche a correctement été créée.",
			ref: {
				alreadyUse: "Cette Reférence est déjà utilisée."
			}
		},
		command: {
			notfound: "La commande n'existe pas.",
		},
		promotion: {
			created: "La promotion a correctement été créée.",
			deleted: "La promotion a correctement été supprimée.",
			date: {
				invalid: "La date de début doit être inférieure à la date de fin."
			}
		},
		warehouse: {
			notfound: "l'entrepôt n'existe pas.",
			edited: "l'entrepôt a correctement été édité",
			created: "l'entrepôt a correctement été créé"
		},
		parentCategory: {
			name: {
				alreadyUse: "Une catégorie parent avec ce nom existe déjà."
			},
			created: "La catégorie parent a correctement été créée.",
			edited: "La catégorie parent a correctement été modifiée.",
		},
		product: {
			notfound: "Le produit n'existe pas.",
			edited: "Le produit a correctement été modifié.",
			created: "Le produit a correctement été créé.",
			unavailable: "Le produit n'est pas disponible dans la quantité souhaitée.",
			sku: {
				alreadyUse: "Ce SKU est déjà utilisé.",
			},
			alreadyInRefundProcess: "Le produit est déjà dans un process de rembourcement",
			refound: "Le produit a bien été remboursé."

		},
		products: {
			unavailable: "Un ou plusieurs produits dans votre panier ne sont plus disponibles dans les quantités souhaitées.",
		},
		article: {
			created: "Les articles ont bien été ajoutés au panier.",
		},
		cart: {
			quantity: {
				limit: "Vous ne pouvez pas avoir plus de 15 fois le même produit dans votre panier."
			},
			article: {
				limit: "Vous ne pouvez pas avoir plus de 10 article dans votre panier."
			}
		},
		productReturn: {
			created: "Le retour a correctement été créé.",
			edited: "La modification a bien été prise en compte.",
		},
		productSheetReview: {
			created: "Commentaire envoyé.",
			deleted: "Commentaire supprimé.",
			edited: "Commentaire modifié.",
		},
		makeBundle: "Le bundle a correctement été créé.",
		TYPE_ERROR: "L'une des données envoyées est erronée. (Erreur provenant du site)",
		NOTFOUND: "La route utilisée n'existe pas. (Erreur provenant du site)",
		INTERNAL_SERVER_ERROR: "Le serveur a eu un problème. (Erreur provenant du site)",
		WHAT_WAS_SENT_ERROR: "Le serveur a renvoyé n'importe quoi. (Erreur provenant du site)",
	}
};
