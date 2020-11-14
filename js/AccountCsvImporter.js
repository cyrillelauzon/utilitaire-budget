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
const TransactionsMap = require('./TransactionsMap');

module.exports = class AccountCsvImporter {

    #transactions;

    /**
     *Creates an instance of AccountCsvImporter.
     * @param {string} rulesFileName
     * @param {string} accountsFileName
     */
    constructor(rulesFileName, accountsFileName) {

        this.#transactions = new TransactionsMap();

        this.ruleParser = new AccountRulesParser(rulesFileName);
        this.accountsInfo = new AccountsBookInfo(accountsFileName);
    }

    /**
     * @description
     * @returns
     */
    GetTransactions() {
        return this.#transactions;
    }


    /**
    *Import
    * @description Lit une liste de transactions à partir d'un fichier CSV donné en paramètre
    * et l'enregistre dans la base de données.
    * 
    * @param {string} fileNameCsv
    * @param {string} accountName
    * @param {AccountMySqlDB} sqlDB
    * @throws Error si le fichier est invalide
    * @async
    */
    async Import(fileNameCsv, accountName, sqlDB) {
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

                        transaction = this.ruleParser.ParseTransaction(transaction);
                        this.#transactions.Add(transaction, sqlDB);

                    } catch (err) {
                        //TODO Add failed to read row to an array for summary
                        console.debug("Read transaction from CSV file is invalid " + err);
                    }

                })
                .on('end', async () => {
                    resolve();

                });
        }).catch(error => { console.log('Error importing CSV file: ', error.message); });

    }

}
