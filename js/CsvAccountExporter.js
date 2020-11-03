const Util = require('./Util');
const Transaction = require('./Transaction');
const RuleParser = require('./RuleParser');

module.exports = class CsvAccountExporter {

    /**
     *Creates an instance of CsvAccountExporter.
     */
    constructor(){

    }

    /**
     * @description
     * @param {*} nomFichier
     */
    ExportCsv(nomFichier, transactions){
        const createCsvWriter = require('csv-writer').createObjectCsvWriter;
        console.debug("csv file export: " + nomFichier);

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