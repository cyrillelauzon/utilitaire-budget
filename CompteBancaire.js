/*-------------------------------------------------------------------------
Classe: CompteBancaire
Description: 
<<<<<<< HEAD
Gestion d'un compte bancaire: ex compte personnel, carte de crédit

Permet de 
 
=======
Lecture d'un état de compte bancaire en format CSV et enregistrement
dans une bd mongoDB
>>>>>>> 37d80ff4241455b73fe6805c1edd87635fea8740
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
        /* const mongooseDB = require('mongoose');
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
        this.TransactionDB = mongooseDB.model('Transactions', transactionSchema); */
        this.transactions = new Map();
        //this.ImporterTransactionsCSV("./epargne.csv");
     //   this.ImporterTransactionsCSV("./patate.csv");
    }


    /**
     *ImporterTransactionCSV
     * @description Lit une liste de transactions à partir d'un fichier CSV donné en paramètre
     * et l'enregistre dans la base de données.
     * 
     * @param {string} nomFichierCsv
     * @throws Error si le fichier est invalide
     * @async
     */
    async ImporterTransactionsCSV(nomFichierCsv) {
        const csv = require('fast-csv');
        const fs = require('fs');

        console.log("Début d'importation du fichier Csv: " + nomFichierCsv);

        const p = new Promise((resolve, reject) => {
            //Lecture du fichier csv 
            //ajout des transaction par rangées dans l'objet Map transactions afin de verifier les dupliqués
            //TODO remplacer par fast-cvs
            fs.createReadStream(nomFichierCsv)
                .on('error', (err) => {
                    reject(p);
                    throw (new Error("ImporterTransactionsCSV::> " + err));

                })
                .on('data', (row) => {

                    try {
                        let transaction = this.CreerTransaction(0, row['Date'], row['Description'], row['Categorie'], row['Debit'], row['Credit'], row['Solde']);
                        this.AjouterTransactionMap(transaction);
                    } catch (err) {
                        console.debug("Transaction lue dans fichier CSV est invalide: " + err);
                    }

                })
                .on('end', async () => {

                    //await this.AjouterTransactionsBD();


                    this.ExporterTransactionsCSV("./Test.csv", this.transactions);
                    resolve(p);
                });
        });

        await p;
    }

    




    /**
     * CreerTransaction
     * @description méthode wrapper qui convertit le débit ou crédit
     * 
     * @param {number} compteur
     * @param {string} date
     * @param {string} description
     * @param {string} categorie
     * @param {number} debit
     * @param {number} credit
     * @param {number} solde
     * @throws {Error} Paramètre invalid
     * @returns {object} ou undefined si un paramètre est invalide
     * 
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
     * @param {string} date
     * @param {string} description
     * @param {string} categorie
     * @param {number} montant
     * @param {number} solde
     * @throws {Error} Paramètre invalide, s'ils ne répondent pas au schéma de validation.
     * @returns {object} nouvel objet transaction
     * 
     */
    CreerTransactionMontant(compteur, date, description, categorie, montant, solde) {

        //  try {
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
        //} catch (err) {
        //    return undefined;
        // }

    }

    /**
     * CreerIDTransaction
     * @description Méthode utilitaire, crée un ID de transaction par concaténation des parametres suivants:
     * 
     * @param {number} compteur nombre entre 1 et 99 inclusivement
     * @param {string} date
     * @param {string} description
     * @param {number} montant
     * @throws {Error} si le compteur est invalide
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
     * @throws {Error} Si paramètre transaction est invalide
     */
    AjouterTransactionMap(transaction) {
        //Lors de l'importation du fichier CSV, si erreur lors de validation des données, ne pas ajouter ces transactions.
        if (transaction === undefined) {
            throw (new Error("AjouterTransactionMap::Objet transaction est vide"));
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
            console.debug('AjouterTransactionsBD::Connecté à la base de données MongoDB');

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
            console.error('Connexion impossible à la BD', err);
        }
    }



    /**
     * ExporterTransactionsCSV
     * @description Exporte transaction de la bd vers un fichier CSV
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
            .then(() => console.log('The CSV file ' + nomFichier + ' was written successfully'));
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
