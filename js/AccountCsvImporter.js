/*-------------------------------------------------------------------------
Class: AccountCsvImporter
Description: 
Imports and sanitize a csv file containing banking transactions
-------------------------------------------------------------------------*/


const Util = require('./Util');
const Transaction = require('./Transaction');
const AccountRulesParser = require('./AccountRulesParser');
const AccountsBookInfo = require('./AccountsBookInfo');
const { rejects } = require('assert');

module.exports = class AccountCsvImporter {

    /**
     *Creates an instance of AccountCsvImporter.
     * @param {string} rulesFileName
     * @param {string} accountsFileName
     */
    constructor(rulesFileName, accountsFileName) {
        this.transactions = new Map();
        this.ruleParser = new AccountRulesParser(rulesFileName);
        this.accountsInfo = new AccountsBookInfo(accountsFileName);
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

        console.log("Importing CSV File: " + nomFichierCsv);

        var accountName = accountName;
        var nomFichierCsv = nomFichierCsv;
        return new Promise((resolve, reject) => {

            fs.createReadStream(nomFichierCsv)
                .pipe(csv.parse({ headers: true, delimiter: this.accountsInfo.GetDelimiter(accountName) }))
                .on('error', (err) => {
                    reject();
                })
                .on('data', (row) => {
                    
                    //Processing of a new row of data 
                    try {
   
                        let mappedRow = this.accountsInfo.MapFieldNames(row, accountName);
                        let transaction = new Transaction(mappedRow['date'],
                            this.accountsInfo.GetDateFormat(accountName),
                            mappedRow['description'],
                            mappedRow['category'],
                            mappedRow['withdraw'],
                            mappedRow['deposit'],
                            mappedRow['owner'],
                            mappedRow['tags'],
                            mappedRow['balance']);

                        this.#AddTransaction(transaction);

                    } catch (err) {
                        console.debug("Transaction lue dans fichier CSV est invalide: " + err);
                    }

                })
                .on('end', async () => {
                    resolve();

                });
        }).catch(error => { console.log('Error importing CSV file: ', error.message); });

    }


    /**
     * @private AddTransaction
     * @description Member function that validates data before adding the transaction to map
     * 
     * @param {Transaction} transaction Nouvelle transaction à ajouter
     * @throws {Error} Si paramètre transaction est invalide
     */
    // @ts-ignore
    #AddTransaction(transaction) {
        //Empty transactions are not added
        if (transaction === undefined) return;
        if (transaction.IsEmpty() === true) return;

        //Create a new transaction even if transaction is of same amount, day and description as an existing one
        //Use the counter to create a unique ID to the transaction
        let counter = 0;

        //Create a new transaction object that reflects the duplicate check
        let nouvTransaction = transaction.Clone();
        nouvTransaction.SetID(counter);
        let strID = nouvTransaction.GetID();

        while (this.transactions.has(strID)) {
            counter += 1;
            nouvTransaction.SetID(counter);
            strID = nouvTransaction.GetID();
        }

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
