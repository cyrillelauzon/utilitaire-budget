/*-------------------------------------------------------------------------
Classe: CompteBancaire
Description: 
Gestion d'un compte bancaire: ex compte personnel, carte de crédit

    //TODO Méthodes à réaliser

    //ExportTransactionsCSV
    //reinit bd  //pour débogage
    //Vérifier espaces vides
    //Refactoriser ImportTransactionCSV pour ajouter une map de transactions en parametre, 
    //et créer nouvelle fonction ajouterBD qui prend cette map en parametre

    //Fonctions Bancaires
    //OvrirCompte
    //Support Multi-comptes dans objet CompteBancaire (voir ou gestionnaire comptes)
    //Tous les comptes vers une nouvelle table
    //GetSolde()

    //GetTransactionsMensuelles()
    //GetTransactions()

-------------------------------------------------------------------------*/
module.exports = class CompteBancaire {

    /*-------------------------------------------------------------------------
    Méthode: constructor
    Description: 
    Lecture automatique de la liste des transactions dans le fichier CSV
	-------------------------------------------------------------------------*/
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
        let transactions = this.ImporterTransactionsCSV("./epargne.csv")
    }


    /*-------------------------------------------------------------------------
    Méthode: ImporterTransactionCSV
    Description: 
    Lit une liste de transactions à partir d'un fichier CSV donné en paramètre 
    et l'enregistre dans la base de données.
	-------------------------------------------------------------------------*/
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

    /*-------------------------------------------------------------------------
    Méthode: LireFichierCSV
    Description: 
    Lit un fichier CSV et store les résultats dans un objet map de transactions
	-------------------------------------------------------------------------*/
    async LireFichierCSV(nomFichierCsv) {
        let transactions = new Map();
        /*https://stackabuse.com/reading-and-writing-csv-files-with-node-js/*/
        const csv = require('csv-parser');
        const fs = require('fs');

        const p = new Promise((resolve, reject) => {
            //Lecture du fichier csv 
            //ajout des transaction par rangées dans transactions afin de verifier les dupliqués
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


    /*-------------------------------------------------------------------------
    Méthode: CreerTransaction
    Description: 
    Creer un objet transaction Mongoose en validant si l'objet n'est pas vide.
    //TODO Validation des données
	-------------------------------------------------------------------------*/
    CreerTransaction(compteur, date, description, categorie, debit, credit, solde) {

        //Colonnes débit et crédit sont combinées dans une colonne montant négatif ou positif
        const montant = credit > 0 ? credit : (-1 * debit);
        return this.CreerTransactionMontant(compteur, date, description, categorie, montant, solde);
    }

    /*-------------------------------------------------------------------------
    Méthode: CreerTransaction
    Description: 
    Creer un objet transaction Mongoose en validant si l'objet n'est pas vide.
    //TODO Validation des données
	-------------------------------------------------------------------------*/
    CreerTransactionMontant(compteur, date, description, categorie, montant, solde) {

        //Validation des données:
        /*  if (isNaN(compteur) || isNaN(Date.parse(date)) || isNaN(montant) || isNaN(solde)) {
            throw new Error("CreerTransaction: Paramètres invalides");
        }
 */
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

    /*-------------------------------------------------------------------------
    Méthode: CreerIDTransaction
    Description: 
	-------------------------------------------------------------------------*/
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


    /*-------------------------------------------------------------------------
        Méthode: AjouterTransaction
        Description: 
        Ajoute une transaction dans la bd
    	-------------------------------------------------------------------------*/
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
            transaction = this.CreerTransaction(compteur, transaction.Date, transaction.Description, transaction.Categorie, transaction.Montant, transaction.Solde);
        }

        //Ajout dans une pile pour verifier si transaction n'existe pas deja
        return transactions.set(transaction._id, transaction);
    }

    /*-------------------------------------------------------------------------
        Méthode: AjouterTransaction
        Description: 
        Ajoute une transaction dans la bd
    	-------------------------------------------------------------------------*/
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


    /*-------------------------------------------------------------------------
        Méthode: ExporterTransactionsCSV
        Description: 
        Exportation d'une map de transactions vers un fichier CSV
        Utilisation de csv-writer
        https://stackabuse.com/reading-and-writing-csv-files-with-node-js/
    	-------------------------------------------------------------------------*/
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


    /*-------------------------------------------------------------------------
        Méthode: ImprimerTransactions
        Description: 
        Imprime la liste des transactions en mémoire sur la console
    	-------------------------------------------------------------------------*/
    ImprimerTransactions(transactions) {
        transactions.forEach(function (transaction) {
            if (transaction !== null) {
                console.log("Transaction: " + transaction);
            }
        });
    }
}