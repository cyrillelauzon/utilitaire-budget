/*-------------------------------------------------------------------------
Classe: CompteBancaire
Description: 
Gestion des transactions bancaires 
-------------------------------------------------------------------------*/
module.exports = class CompteBancaire {

    /*-------------------------------------------------------------------------
    Méthode: constructor
    Description: 
    Lecture automatique de la liste des transactions dans le fichier CSV
	-------------------------------------------------------------------------*/
    constructor() {
        this.transactions = new Array();


        //Création d'un schema de transaction Mangoose
        const mongooseDB = require('mongoose');
        const transactionSchema = new mongooseDB.Schema({
            Clef: String,
            Date: Date,
            Description: String,
            Categorie: String,
            Debit: Number,
            Credit: Number,
            Solde: Number
        })

        this.TransactionDB = mongooseDB.model('Transactions', transactionSchema);

        this.ImporterTransactionCSV("./epargne.csv");
        this.ImprimerTransactions();

    }


    /*-------------------------------------------------------------------------
    Méthode: ImporterTransactionCSV
    Description: 
    Lit une liste de transactions à partir d'un fichier CSV donné en paramètre 
    et l'enregistre dans la base de données.
	-------------------------------------------------------------------------*/
    ImporterTransactionCSV(nomFichierCsv) {
        console.log("Importation en cours fichier Csv" + nomFichierCsv);

        /*https://stackabuse.com/reading-and-writing-csv-files-with-node-js/*/
        const csv = require('csv-parser');
        const fs = require('fs');

        //Connexion à MongoDB
        const mongooseDB = require('mongoose');
        mongooseDB.connect('mongodb://localhost:27017/Budgets')
            .then(() => console.log('connected to mongodb'))
            .catch(err => console.error('could not connect to mongodb', err));

        //Lecture du fichier csv et ajout des transaction par rangées dans la BD
        fs.createReadStream(nomFichierCsv)
            .pipe(csv())
            .on('data', (row) => this.AjouterTransaction(row, mongooseDB))
            .on('end', () => {
                console.log('CSV file successfully processed');
            });

    }

    /*-------------------------------------------------------------------------
    Méthode: AjouterTransaction
    Description: 
    Ajoute une transaction dans la bd
	-------------------------------------------------------------------------*/
    async AjouterTransaction(row, mongooseDB) {
        //let transaction = new Transaction(row['Date'], row['Description'], row['Categorie'], row['Debit'], row['Credit'], row['Solde']);
        //this.transactions.push(transaction);

        if (row['Date'] === null) return; //TODO vérifier que rangée n'est pas vide

        const transactionDB = new this.TransactionDB({
            Clef: row['Date'] + row['Solde'],
            Date: row['Date'],
            Description: row['Description'],
            Categorie: row['Categorie'],
            Debit: row['Debit'],
            Credit: row['Credit'],
            Solde: row['Solde']
        })
        try {
            const resultat = await transactionDB.save();
        } catch {
            console.log("erreur ajouterTransaction");

        }


        //   console.log("Nouvelle rangee" + resultat);

    }


    /*-------------------------------------------------------------------------
    Méthode: ImprimerTransactions
    Description: 
    Imprime la liste des transactions en mémoire sur la console
	-------------------------------------------------------------------------*/
    ImprimerTransactions() {
        /*      this.transactions.forEach(function (transaction) {
                 if (transaction !== null) {
                     transaction.Imprimer();
                 }
             }); */
    }
}


/*-------------------------------------------------------------------------
Classe: Transaction
Description: 
Classe utilitaire décrivant une transaction bancaire.
-------------------------------------------------------------------------*/
/* class Transaction {
    constructor(dateTransaction, description, categorie, debit, credit, solde) {
        this.key = dateTransaction + solde;
        this.dateTransaction = dateTransaction;
        this.description = description;
        this.categorie = categorie;
        this.debit = debit;
        this.credit = credit;
        this.solde = solde;
    }

    Imprimer() {
        console.log(`Transaction: ${this.key}, ${this.dateTransaction}, ${this.description}, ${this.categorie}, ${this.debit}, ${this.credit}, ${this.solde}`);
    }
} */