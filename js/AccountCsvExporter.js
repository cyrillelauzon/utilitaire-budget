/*-------------------------------------------------------------------------
Class: AccountCsvExporter
Description: 
Exports an account book to a CSV file
-------------------------------------------------------------------------*/

const Util = require('./Util');
const Transaction = require('./Transaction');
const AccountRulesParser = require('./AccountRulesParser');
const transactionsMap = require('./TransactionsMap');

module.exports = class AccountCsvExporter {

    /**
     *Creates an instance of AccountCsvExporter.
     */
    constructor() {
        
    }

    /**
     * @description
     * @param {string} fileName
     * @param {transactionsMap} transactions
     */
    async ExportCsv(fileName, transactions) {
        const createCsvWriter = require('csv-writer').createObjectCsvWriter;
        console.debug("Exporting CSV file: " + fileName);

        //FEATURE Implement accountInfo Object to output correct column names
        const csvWriter = createCsvWriter({
            path: fileName,
            header: [{
                id: 'date',
                title: 'Date'
            },
            {
                id: 'description',
                title: 'Description'
            },
            {
                id: 'category',
                title: 'Categorie'
            },
            {
                id: 'amount',
                title: 'Montant'
            },
            {
                id: 'balance',
                title: 'Solde'
            }
            ]
        });
        
        await csvWriter.writeRecords(transactions.GetArray());
        console.log('The CSV file ' + fileName + ' was written successfully');
    }


  
}