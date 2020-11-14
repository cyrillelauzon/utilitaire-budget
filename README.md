# Utilitaire de budget

## Description

Utilitaire sous Node.JS permettant d'importer des fichiers CSV d'états bancaires dans une base de données MySql.


## À Faire
- Implantation de la base de données MySQL
- Implantation du serveur REST avec Express.js
- Connecter le logiciel à une vue mensuelle des transactions. 
  - L'usager peut assigner des catégories de dépenses à chaque transaction.
  - Un résumé permet de voir l'argent dépensé par mois et par catégories.

## Fonctions vedettes

- Système de règles automatisées permettant d'affecter automatiquement des catégories données à certaines transactions bancaires (ex épicerie, finances...)
- Configuration du système à l'aide de fichiers JSON
- Sauvegarde des transactions dans une bd MySql

- Exportation des transactions bancaires consolidées vers un fichier CSV 
- Gestion intelligente des doublons de transactions.
- Tests unitaires réalisés avec Jest

