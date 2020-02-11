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

        this.type = "type"; //personnel, celi, crédit...
        this.description = "description"; //Description de lutilisateur
        this.nom = "nom"; //nom du compte
        this.proprietaire = "proprietaire"; //proprio du compte

        //Création d'un schema de transaction Mangoose
        const mongooseDB = require('mongoose');
        const transactionSchema = new mongooseDB.Schema({
            _id: String,
            Date: {
                type: Date,
                required: true
            },
            Description: {
                type: String,
                required: true
            },
            Categorie: {
                type: String,
                required: true
            },
            Montant: {
                type: Number,
                required: true
            },
            Solde: {
                type: Number,
                required: true
            },
        })
        this.TransactionDB = mongooseDB.model('Transactions', transactionSchema);
        this.transactions = new Map();
        this.ImporterTransactionsCSV("./epargne.csv");



    }


    /**
     *ImporterTransactionCSV
     * @description Lit une liste de transactions à partir d'un fichier CSV donné en paramètre
     * et l'enregistre dans la base de données.
     * 
     * @param {string} nomFichierCsv
     */
    async ImporterTransactionsCSV(nomFichierCsv) {
        const csv = require('csv-parser');
        const fs = require('fs');

        console.log("Importation en cours fichier Csv: " + nomFichierCsv);

        const p = new Promise((resolve, reject) => {
            //Lecture du fichier csv 
            //ajout des transaction par rangées dans l'objet Map transactions afin de verifier les dupliqués
            fs.createReadStream(nomFichierCsv)
                .pipe(csv())
                .on('data', (row) => {

                    let transaction = this.CreerTransaction(0, row['Date'], row['Description'], row['Categorie'], row['Debit'], row['Credit'], row['Solde']);
                    this.AjouterTransactionMap(transaction);

                })
                .on('end', async () => {
                    console.log("Avant Ajouter transaction BD:");
                    await this.AjouterTransactionsBD();

                    this.ExporterTransactionsCSV("./Test.csv", this.transactions);
                    resolve(p);
                })
                .on('error', () => {
                    //TODO throw error?
                    reject(p);
                });
        });

        await p;
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
     * @returns 
     */
    CreerTransaction(compteur, date, description, categorie, debit, credit, solde) {

        //Colonnes débit et crédit sont combinées dans une colonne montant négatif ou positif
        const montant = credit > 0 ? credit : (-1 * debit);
        return this.CreerTransactionMontant(compteur, date, description, categorie, montant, solde);
    }

    /**
     * CreerTransactionMontant
     * @description Creer un objet transaction Mongoose en validant si l'objet n'est pas vide.
     * Validation des paramètres par schéma mongoose
     * 
     * @param {number} compteur
     * @param {Date} date
     * @param {string} description
     * @param {string} categorie
     * @param {number} montant
     * @param {number} solde
     * @returns
     * 
     */
    CreerTransactionMontant(compteur, date, description, categorie, montant, solde) {

        try {
            let transaction = new this.TransactionDB({
                _id: this.CreerIDTransaction(compteur, date, description, montant),
                Date: date,
                Description: description,
                Categorie: categorie,
                Montant: montant,
                Solde: solde
            })

            let err = transaction.validateSync();
            if (err) {
                // console.debug("Paramètre invalide CréerTransaction" + err);
                throw (new Error("CreerTransactionMontant: Paramètres invalides"));
            }

            return transaction;
        } catch (err) {
            return undefined;
        }

    }

    /**
     * CreerIDTransaction
     * @description Méthode utilitaire, crée un ID de transaction par concaténation des parametres suivants:
     * 
     * @param {number} compteur nombre entre 1 et 99 inclusivement
     * @param {Date} date
     * @param {string} description
     * @param {number} montant
     * @throws {InvalidArgumentException}
     * @returns {string} strID de transaction
     */
    CreerIDTransaction(compteur, date, description, montant) {
        if (compteur < 0 || compteur > 99 || isNaN(compteur) || compteur === null) {
            throw new Error("CreerIDTransaction: Nouvelle transaction avec compteur invalide");
        }

        let strCompteur = "";
        compteur < 10 ? strCompteur = "0" + String(compteur) : strCompteur = String(compteur);
        return strCompteur + String(date) + String(description) + String(montant);
    }


    /**
     * AjouterTransactionMap
     * @description Ajoute une nouvelle transaction lors de la lecture d'un fichier CSV
     * 
     * @param  transaction Nouvelle transaction à ajouter
     * @returns mise à jour de Map des transactions à écrire dans la BD
     */
    AjouterTransactionMap(transaction) {
        //Lors de l'importation du fichier CSV, si erreur lors de validation des données, ne pas ajouter ces transactions.
        if (transaction === undefined) {
            return;
        }

        let compteur = 0;
        //Vérification si on a affaire à une double ou multiple transaction d'un meme montant le meme jour, au meme lieu
        //Si oui: creer un nouveau _id unique pour cette transaction
        let strID = transaction._id;
        while (this.transactions.has(strID)) {
            compteur += 1;
            strID = this.CreerIDTransaction(compteur, transaction.Date, transaction.Description, transaction.Montant);
        }

        let nouvTransaction = this.CreerTransactionMontant(compteur, transaction.Date, transaction.Description, transaction.Categorie, transaction.Montant, transaction.Solde);
        this.transactions.set(strID, nouvTransaction);
    }


    /**
     * @description
     */
    async AjouterTransactionsBD() {

        //Connexion à MongoDB
        const mongooseDB = require('mongoose');
        try {

            await mongooseDB.connect('mongodb://localhost:27017/Budgets');
            console.log('Connecté à la base de données MongoDB');

            let it = this.transactions.values();
            let transactionIter = it.next();
            while (!transactionIter.done) {
                try {
                    await transactionIter.value.save();
                } catch (err) {
                    // console.debug("Erreur Ecriture bd: " + err);
                }

                transactionIter = it.next();
            }


        } catch (err) {
            console.error('Erreur Ajouter TransactionsBd', err);
        }
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