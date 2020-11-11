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
     * @param {*} nomFichier
     */
    ExportCsv(nomFichier, transactions) {
        const createCsvWriter = require('csv-writer').createObjectCsvWriter;
        console.debug("csv file export: " + nomFichier);

        //TODO use DB to export transactions by month or selected period and keep map of transaction as exchange format
     //   var mapAsc = new Map([...transactions.entries()].sort());
/*         let arrTransactions
        for(let transaction of transactions){
            
        } */


        const csvWriter = createCsvWriter({
            path: nomFichier,
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

        csvWriter
            .writeRecords(Array.from(transactions.values()))
            .then(() => console.log('The CSV file ' + nomFichier + ' was written successfully'));
    }

}