/*-------------------------------------------------------------------------
Classe: BankAccount
Description: 
Simple wrapper class to regroup and enable the import of multiple CSV files using 
specific parameters for each account or account's owner
-------------------------------------------------------------------------*/


const Transaction = require('./Transaction');
const RuleParser = require('./RuleParser');
const CsvAccountImporter = require('./CsvAccountImporter');
const CsvAccountExporter = require('./CsvAccountExporter');



module.exports = class BankAccount {


    /**
     * @constructor
     * @descriptionCreates an instance of BankAccount.
     */
    constructor() {

        this.type = "type"; //personnel, celi, crédit...
        this.description = "description"; //Description de lutilisateur
        this.nom = "nom"; //nom du compte
        this.proprietaire = "proprietaire"; //proprio du compte
       
    //    this.transactions = new Map();
        this.accountImporter = new CsvAccountImporter("./config/rules.json", './config/accounts.json');
        //this.ruleParser = new RuleParser();
    }



    async ImportTransactionsCSV(nomFichier, accountName) {
        //await this.accountImporter.ImportTransactionsCSV(nomFichier, accountName);      
        await this.accountImporter.ImportTransactionsCSV("./import_csv/epargne.csv", "Compte chèque de Cyrille");
        await this.accountImporter.ImportTransactionsCSV("./import_csv/credit.csv", "Mastercard de Cyrille");

        this.ExportCSVTransactions("./testexport2.csv");

    }   


    /**
     * ExporterTransactionsCSV
     * @description Exporte transaction de la bd vers un fichier CSV
       Utilisation de csv-writer:
       https://stackabuse.com/reading-and-writing-csv-files-with-node-js/
     * 
     * @param {string} nomFichier
     */
    ExportCSVTransactions(nomFichier) {
        let csvExport = new CsvAccountExporter();
        csvExport.ExportCsv(nomFichier, this.accountImporter.transactions);
      }

   
}
