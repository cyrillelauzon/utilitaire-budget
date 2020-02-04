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
        this.ImporterTransactionCSV("./epargne.csv");
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

        fs.createReadStream(nomFichierCsv)
            .pipe(csv())
            .on('data', (row) => {
                let transaction = new Transaction(row['Date'], row['Description'], row['Categorie'], row['Debit'], row['Credit'], row['Solde']);
                this.transactions.push(transaction);

            })
            .on('end', () => {
                console.log('CSV file successfully processed');
                this.ImprimerTransactions();
            });

    }

    /*-------------------------------------------------------------------------
    Méthode: ImprimerTransactions
    Description: 
    Imprime la liste des transactions en mémoire sur la console
	-------------------------------------------------------------------------*/
    ImprimerTransactions() {
        this.transactions.forEach(function (transaction) {
            if (transaction !== null) {
                transaction.Imprimer();
            }
        });
    }
}


/*-------------------------------------------------------------------------
Classe: Transaction
Description: 
Classe utilitaire décrivant une transaction bancaire.
-------------------------------------------------------------------------*/
class Transaction {
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
}
md