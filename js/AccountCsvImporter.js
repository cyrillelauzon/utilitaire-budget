/*-------------------------------------------------------------------------
Class: AccountCsvImporter
Description: 
Imports and sanitize a csv file containing banking transactions
-------------------------------------------------------------------------*/


const Util = require('./Util');
const Transaction = require('./Transaction');
const AccountRulesParser = require('./AccountRulesParser');
const AccountsBookInfo = require('./AccountsBookInfo');
const AccountMySqlDB = require('./AccountMySqlDB');
const { rejects } = require('assert');

module.exports = class AccountCsvImporter {

    /**
     *Creates an instance of AccountCsvImporter.
     * @param {string} rulesFileName
     * @param {string} accountsFileName
     */
    constructor(rulesFileName, accountsFileName) {

        //TODO use get method
        this.transactions = new Map();

        this.ruleParser = new AccountRulesParser(rulesFileName);
        this.accountsInfo = new AccountsBookInfo(accountsFileName);
    }

    /**
    *ImporterTransactionCSV
    * @description Lit une liste de transactions à partir d'un fichier CSV donné en paramètre
    * et l'enregistre dans la base de données.
    * 
    * @param {string} fileNameCsv
    * @param {AccountMySqlDB} sqlDB
    * @throws Error si le fichier est invalide
    * @async
    */
    async ImportTransactionsCSV(fileNameCsv, accountName, sqlDB) {
        const csv = require('fast-csv');
        const fs = require('fs');

        console.log("Importing CSV File: " + fileNameCsv);

        var accountName = accountName;
        var fileNameCsv = fileNameCsv;
        return new Promise((resolve, reject) => {

            fs.createReadStream(fileNameCsv)
                .pipe(csv.parse({ headers: true, delimiter: this.accountsInfo.GetDelimiter(accountName) }))
                .on('error', (err) => {
                    reject();
                })
                .on('data', (row) => {
                    //Processing of a new row of data 
                    try {
                        let mappedCols = this.accountsInfo.MapFieldNames(row, accountName);
                        let transaction = new Transaction(mappedCols['date'],
                            this.accountsInfo.GetDateFormat(accountName),
                            mappedCols['description'],
                            mappedCols['category'],
                            mappedCols['withdraw'],
                            mappedCols['deposit'],
                            mappedCols['owner'],
                            mappedCols['tags'],
                            mappedCols['balance']);

                        this.#AddTransaction(transaction, sqlDB);

                    } catch (err) {
                        //TODO add failed to read row to an array for summary
                        console.debug("Read transaction from CSV file is invalid " + err);
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
     * @param {AccountMySqlDB} sqlDB
     * @throws {Error} Si paramètre transaction est invalide
     */
    // @ts-ignore
    #AddTransaction(transaction, sqlDB) {
        //Empty transactions are not added
        if (transaction === undefined) return;
        if (transaction.IsEmpty() === true) return;

        //Create a new transaction even if transaction is of same amount, day and description as an existing one
        //Use the counter to create a unique ID to the transaction
        let counter = 0;

        //Create a new transaction object that reflects the duplicate check
        let newTransaction = transaction.Clone();
        newTransaction.SetID(counter);
        let strID = newTransaction.GetID();

        while (this.transactions.has(strID)) {
            counter += 1;
            newTransaction.SetID(counter);
            strID = newTransaction.GetID();
        }

        //Parse new transaction to auto apply categories
        newTransaction = this.ruleParser.ParseTransaction(newTransaction);

        //Add transaction to map and db
        this.transactions.set(strID, newTransaction);
        sqlDB.AddTransaction(newTransaction);
    }


    /**
     * @description
     * @returns
     */
    GetTransactionsArray() {
        return Array.from(this.transactions.values());
    }






}
