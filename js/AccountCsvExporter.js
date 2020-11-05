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

        var mapAsc = new Map([...transactions.entries()].sort());


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
            .writeRecords(Array.from(mapAsc.values()))
            .then(() => console.log('The CSV file ' + nomFichier + ' was written successfully'));
    }

}