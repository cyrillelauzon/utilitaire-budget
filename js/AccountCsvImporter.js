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
    #failedRows;

    /**
     *Creates an instance of AccountCsvImporter.
     * @param {string} rulesFileName
     * @param {string} accountsFileName
     */
    constructor(rulesFileName, accountsFileName) {

        this.#transactions = new TransactionsMap();
        this.#failedRows = new Array();

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
     * @description returns Rows that could not be read from last import
     * @returns {Array<String>}
     */
    GetFailedRows() {
        return this.#failedRows;
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

        const readstream = fs.createReadStream(fileNameCsv);
        const readstreamCSV = readstream.pipe(csv.parse({ headers: true, delimiter: this.accountsInfo.GetDelimiter(accountName) }));
        for await (const row of readstreamCSV) {

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
                this.#failedRows.push(row);
                //console.debug("Transaction from CSV file "+ fileNameCsv +" is invalid // " + err);
                //console.debug("Imported row content: ");
                //console.debug(row);
            }

        }

        console.debug("Transaction completed import " + fileNameCsv);
        console.debug("Number of transactions in map " + this.#transactions.GetLength());
    }

}
