



/*-------------------------------------------------------------------------
Classe: CompteBancaire
Description: 
Gestion d'un compte bancaire: ex compte personnel, carte de crédit

    //TODO Méthodes à réaliser

    //Ajouter Validateurs MongoDB
    
    //ExportTransactionsCSV---
    //reinit bd  //pour débogage
    //Vérifier espaces vides
    //Refactoriser ImportTransactionCSV pour ajouter une map de transactions en parametre, 
    //et créer nouvelle fonction ajouterBD qui prend cette map en parametre

    //Fonctions Bancaires---
    //OvrirCompte
    //Support Multi-comptes dans objet CompteBancaire (voir ou gestionnaire comptes)
    //Tous les comptes vers une nouvelle table
    //GetSolde()

    //Getter---
    //GetTransactionsMensuelles()
    //GetTransactions()

-------------------------------------------------------------------------*/

module.exports = class CompteBancaire {


    /**
     * @constructor
     * @descriptionCreates an instance of CompteBancaire.
     */
    constructor() {
        this.transactions = new Map();
        this.type = "type"; //personnel, celi, crédit...
        this.description = "description"; //Description de lutilisateur
        this.nom = "nom"; //nom du compte
        this.proprietaire = "proprietaire"; //proprio du compte

        //Création d'un schema de transaction Mangoose
        //NB: Montant négatif = Crédit, Montant Positif = Débit
        const mongooseDB = require('mongoose');
        const transactionSchema = new mongooseDB.Schema({
            _id: String,
            Date: Date,
            Description: String,
            Categorie: String,
            Montant: Number,
            Solde: Number
        })
        this.TransactionDB = mongooseDB.model('Transactions', transactionSchema);
        //  let transactions = this.ImporterTransactionsCSV("./epargne.csv")
    }


    /**
     *ImporterTransactionCSV
     * @description Lit une liste de transactions à partir d'un fichier CSV donné en paramètre
     * et l'enregistre dans la base de données.
     * 
     * @param {string} nomFichierCsv
     */
    async ImporterTransactionsCSV(nomFichierCsv) {
        console.log("Importation en cours fichier Csv: " + nomFichierCsv);
        let transactions = new Map();


        //Connexion à MongoDB
        const mongooseDB = require('mongoose');
        try {

            await mongooseDB.connect('mongodb://localhost:27017/Budgets');
            console.log('Connecté à la base de données MongoDB');

            transactions = await this.LireFichierCSV(nomFichierCsv);
            console.log('Fichier Csv Lu avec success Doit etre a la fin');

            this.ImprimerTransactions(transactions);
            this.EcrireTransactionsDB(transactions);


        } catch (err) {
            console.error('Erreur lecture TransactionsCsv', err);
        }
    }

    /**
     * LireFichierCSV
     * @description Lit un fichier CSV et store les résultats dans un objet map de transactions* 
     * https://stackabuse.com/reading-and-writing-csv-files-with-node-js
     * 
     * @param {string} nomFichierCsv
     * @returns {Map} Map des transactions
     */
    async LireFichierCSV(nomFichierCsv) {
        let transactions = new Map();

        const csv = require('csv-parser');
        const fs = require('fs');

        const p = new Promise((resolve, reject) => {
            //Lecture du fichier csv 
            //ajout des transaction par rangées dans l'objet Map transactions afin de verifier les dupliqués
            fs.createReadStream(nomFichierCsv)
                .pipe(csv())
                .on('data', (row) => {

                    let transaction = this.CreerTransaction(0, row['Date'], row['Description'], row['Categorie'], row['Debit'], row['Credit'], row['Solde']);
                    if (transaction !== undefined) {
                        transactions = this.AjouterTransaction(transactions, transaction);
                    }

                })
                .on('end', () => {
                    resolve(transactions);
                });
        });

        transactions = await p;
        return transactions;
    }

        /**
     * AjouterTransaction
     * @description Ajoute une nouvelle transaction lors de la lecture d'un fichier CSV
     * 
     * @param {*} transactions Map Courante 
     * @param {*} transaction Nouvelle transaction à ajouter
     * @returns {Map} mise à jour de Map des transactions à écrire dans la BD
     */
    AjouterTransaction(transactions, transaction) {
        let compteur = 0;
        let strID = transaction._id;
        let creerNouvelleTransaction = false;

        //Vérification si on a pas affaire à une double transaction d'un meme montant le meme jour
        while (transactions.has(strID) === true) {
            creerNouvelleTransaction = true;
            compteur += 1;
            strID = this.CreerIDTransaction(compteur, transaction.Date, transaction.Description, transaction.Montant);
        }

        if (creerNouvelleTransaction === true) {
            transaction = this.CreerTransactionMontant(compteur, transaction.Date, transaction.Description, transaction.Categorie, transaction.Montant, transaction.Solde);
        }

        //Ajout dans une pile pour verifier si transaction n'existe pas deja
        return transactions.set(transaction._id, transaction);
    }


    /**
     * EcrireTransactionsDB
     * @description 
     * 
     * @param {Map} transactions toutes les transactions candidates pour écriture dans la BD
     */
    async EcrireTransactionsDB(transactions) {
        try {
            //new promise
            //for each transactions  
            //await transaction.save();

            //await that we wrote everything
        } catch (erreur) {
            //console.error("erreur ajouterTransaction:" + erreur);
        }
    }

    /**
     * CreerTransaction
     * @description méthode wrapper qui convertit le débit ou crédit
     * 
     * @param {number} compteur
     * @param {Date} date
     * @param {string} description
     * @param {string} categorie
     * @param {number} debit
     * @param {number} credit
     * @param {number} solde
     * @returns {object}
     */
    CreerTransaction(compteur, date, description, categorie, debit, credit, solde) {

        //Validation des données:
        /*         if (isNaN(compteur) || isNaN(Date.parse(date)) || isNaN(debit) || isNaN(credit) || isNaN(solde)) {
                    throw new Error("CreerTransaction: Paramètres invalides");
                }

                if (compteur === null || debit === null || credit === null || solde === null) {
                    throw new Error("CreerTransaction: Paramètres nulls");
                } */


        //Colonnes débit et crédit sont combinées dans une colonne montant négatif ou positif
        const montant = credit > 0 ? credit : (-1 * debit);
        return this.CreerTransactionMontant(compteur, date, description, categorie, montant, solde);


    }

    /**
     * CreerTransactionMontant
     * @description Creer un objet transaction Mongoose en validant si l'objet n'est pas vide.
     * 
     * @param {number} compteur
     * @param {Date} date
     * @param {string} description
     * @param {string} categorie
     * @param {number} montant
     * @param {number} solde
     * @returns {object}
     * 
     */
    //TODO Réécrire avec Validators Mongoose
    CreerTransactionMontant(compteur, date, description, categorie, montant, solde) {

        let transaction = new this.TransactionDB({
            _id: this.CreerIDTransaction(compteur, date, description, montant),
            Date: date,
            Description: description,
            Categorie: categorie,
            Montant: montant,
            Solde: solde
        })

        return transaction;
    }

    /**
     * CreerIDTransaction
     * @description Crée un ID de transaction par concaténation des parametres suivants:
     * 
     * @param {number} compteur nombre entre 1 et 99 inclusivement
     * @param {Date} date
     * @param {string} description
     * @param {number} montant
     * @throws {InvalidArgumentException}
     * @returns {string} strID de transaction
     */
    CreerIDTransaction(compteur, date, description, montant) {
        if (compteur < 0) {
            throw new Error("CreerIDTransaction: Nouvelle transaction avec compteur négatif");
        }
        if (compteur > 99) {
            throw new Error("CreerIDTransaction: Nouvelle transaction avec compteur > 99");
        }

        let strCompteur = "";

        compteur < 10 ? strCompteur = "0" + String(compteur) : strCompteur = String(compteur);
        return strCompteur + String(date) + String(description) + String(montant);
    }



    /**
     * ExporterTransactionsCSV
     * @description Exporte transaction dans bd //TODO vers un fichier CSV
       Utilisation de csv-writer:
       https://stackabuse.com/reading-and-writing-csv-files-with-node-js/
     * 
     * @param {string} nomFichier
     * @param {Map} transactions
     */
    ExporterTransactionsCSV(nomFichier, transactions) {

        const createCsvWriter = require('csv-writer').createObjectCsvWriter;
        const csvWriter = createCsvWriter({
            path: nomFichier,
            header: [{
                    id: 'Date',
                    title: 'Date'
                },
                {
                    id: 'Description',
                    title: 'Description'
                },
                {
                    id: 'Categorie',
                    title: 'Categorie'
                },
                {
                    id: 'Montant',
                    title: 'Montant'
                },
                {
                    id: 'Solde',
                    title: 'Solde'
                }
            ]
        });
        //TODO réécrire fin de fonction avec des Promise et await
        csvWriter
            .writeRecords(Array.from(transactions.values()))
            .then(() => console.log('The CSV file was written successfully'));
    }

    /**
     * ImprimerTransactions
     * @description Imprime une liste de transactions vers la console
     * 
     * @param {Map} transactions
     */
    ImprimerTransactions(transactions) {
        transactions.forEach(function (transaction) {
            if (transaction !== null) {
                console.log("Transaction: " + transaction);
            }
        });
    }
}