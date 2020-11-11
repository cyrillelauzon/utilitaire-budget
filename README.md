# Utilitaire de budget

## Description

Simple utilitaire en ligne de commande sous Node.JS permettant d'importer des fichiers CSV d'états bancaires dans une base de données MySql.


## À Faire
- Connecter le logiciel à une interface simple permettant d'importer des transactions et d'assigner un type de dépense pour chaque transaction.
- Exportation par la suite vers un fichier CSV correctement formaté pour permettre de gérer son budget plus facilement depuis Excel
- Conserver l'idée d'1 utilisateur et non de transfomer le systeme en site web complet multiusager


## Fonctions vedettes
- Gestion intelligente des doublons. Le logiciel fait la différence entre une transaction déjà importée et une transaction d'un même montant au même endroit dans la même journée. 
- Sauvegarde des transactions dans une bd MySql

