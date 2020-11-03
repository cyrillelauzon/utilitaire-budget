/*-------------------------------------------------------------------------
Classe: CsvAccountImporter
Description: 
Imports and sanitize a csv file containing banking transactions

//Utilise le RuleParser et rules.csv.
//Pour l'instant le fichiers categories n'a pas d'utilité
-------------------------------------------------------------------------*/


const Util = require('./Util');
const Transaction = require('./Transaction');
const RuleParser = require('./RuleParser');
const AccountsInfo = require('./AccountsInfo');

module.exports = class CsvAccountImporter {

    /**
     *Creates an instance of CsvAccountImporter.
     * @param {string} rulesFileName
     * @param {string} accountsFileName
     */
    constructor(rulesFileName, accountsFileName) {
        this.transactions = new Map();
        this.ruleParser = new RuleParser(rulesFileName);
        this.accountsInfo = new AccountsInfo(accountsFileName);
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
    async ImportTransactionsCSV(nomFichierCsv, accountName) {
        const csv = require('fast-csv');
        const fs = require('fs');

        console.log("Début d'importation du fichier Csv: " + nomFichierCsv);
        var accountImporter = this;
        var name = accountName;
        var nomFichier = nomFichierCsv;
        var delimitercsv = this.accountsInfo.accountsInfo[accountName]["csv-delimiter"];
        var a = "b";

        return new Promise((resolve, reject) => {

            fs.createReadStream(nomFichier)
                .pipe(csv.parse({ headers: true, delimiter: delimitercsv }))
                .on('error', (err) => {
                    reject();
                })
                .on('data', (row) => {

                    try {
                        //Processing of a new row of data 
                        let transaction = new Transaction();
                        let mappedRow = accountImporter.accountsInfo.MapFieldNames(row, name);
                        transaction.SetTransaction(mappedRow);

                        accountImporter.AddTransaction(transaction);

                    } catch (err) {
                        console.debug("Transaction lue dans fichier CSV est invalide: " + err);
                    }

                })
                .on('end', async (err) => {
                    console.debug("resolve p: " + err);
                    resolve();
             
                });
        }).catch(error => { console.log('caught promise', error.message); });
      

    }


    /**
     * @private AddTransaction
     * @description Member function that validates data before adding the transaction to map
     * 
     * @param {Transaction} transaction Nouvelle transaction à ajouter
     * @throws {Error} Si paramètre transaction est invalide
     */
    AddTransaction(transaction) {
        //Empty transactions are not added
        if (transaction === undefined) return;
        if (transaction.IsEmpty() === true) return;

        //Create a new transaction even if transaction is of same amount, day and description as an existing one
        //Use the counter to create a unique ID to the transaction
        let counter = 0;
        let strID = transaction.GetID();
        while (this.transactions.has(strID)) {
            counter += 1;
            strID = Transaction.BuildTransactionID(counter, transaction.date, transaction.Description, transaction.Amount);
        }

        //Create a new transaction that reflects the duplicate check
        let nouvTransaction = new Transaction();
        nouvTransaction.CopyTransaction(transaction);
        nouvTransaction.SetTransactionID(counter);

        //Parse new transaction to auto apply categories
        nouvTransaction = this.ruleParser.ParseTransaction(nouvTransaction);

        //Add transaction to map
        this.transactions.set(strID, nouvTransaction);
    }


    /**
     * @description
     * @returns
     */
    GetTransactionsArray() {
        return Array.from(this.transactions.values());
    }






}
