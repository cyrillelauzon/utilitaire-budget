# Utilitaire de budget

## Description

Simple utilitaire en ligne de commande sous Node.JS permettant d'importer des fichiers CSV d'états bancaires dans une base de données MongoDB.

## Fonctions vedettes
- Gestion intelligente des doublons. Le logiciel fait la différence entre une transaction déjà importée et une transaction d'un même montant au même endroit dans la même journée.
- Sauvegarde des transactions dans une bd MongoDB

## À Faire
- Connecter le logiciel à une interface simple permettant d'assigner un type de dépense pour chaque transaction.
- Exportation par la suite vers un fichier CSV correctement formaté pour permettre de gérer son budget plus facilement depuis Excel
