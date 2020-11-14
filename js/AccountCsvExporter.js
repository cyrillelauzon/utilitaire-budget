/*-------------------------------------------------------------------------
Class: AccountCsvExporter
Description: 
Exports an account book to a CSV file
-------------------------------------------------------------------------*/

const Util = require('./Util');
const Transaction = require('./Transaction');
const AccountRulesParser = require('./AccountRulesParser');

module.exports = class AccountCsvExporter {

    /**
     *Creates an instance of AccountCsvExporter.
     */
    constructor() {
        
    }

    /**
     * @description
     * @param {string} fileName
     * @param {Map<Transaction>} transactionsMap
     */
    async ExportCsv(fileName, transactionsMap) {
        const createCsvWriter = require('csv-writer').createObjectCsvWriter;
        console.debug("Exporting CSV file: " + fileName);

        //TODO Implement accountInfo Object to output correct column names
        const csvWriter = createCsvWriter({
            path: fileName,
            header: [{
                id: 'date',
                title: 'Date'
            },
            {
                id: 'Description',
                title: 'Description'
            },
            {
                id: 'Category',
                title: 'Categorie'
            },
            {
                id: 'Amount',
                title: 'Montant'
            },
            {
                id: 'Balance',
                title: 'Solde'
            }
            ]
        });

        let transactions = this.GetMapEntries(transactionsMap);
        await csvWriter.writeRecords(transactions);
        console.log('The CSV file ' + fileName + ' was written successfully');
    }


    /**
     * @description Extract private member data from transaction liste
     * Return an array of transaction data. 
     * @param {Map<Transaction>} transactionsMap
     * @returns {Array}
     */
    GetMapEntries(transactionsMap){

        let transactions = new Array();
        
        for (const [key, value] of transactionsMap.entries()) {
            let newEntry = { 
                date: value.GetDateString(),
                Description: value.GetDescription(),
                Category: value.GetCategory(),
                Amount: value.GetAmount(),
                Balance: value.GetBalance()                
            };            
            
            transactions.push(newEntry);
          }
                
        return transactions;
    }

}