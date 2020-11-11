/*-------------------------------------------------------------------------
Class: AccountsBook
Description: 
The object regroups all banking transactions for one user into a single collection
Delegates the book management to other subclasses (AccountCSvImporter, AccountMysqlDB, AccountRulesParser, AccountsBookinfo...etc)
-------------------------------------------------------------------------*/


const Transaction = require('./Transaction');
const AccountRulesParser = require('./AccountRulesParser');
const AccountCsvImporter = require('./AccountCsvImporter');
const AccountCsvExporter = require('./AccountCsvExporter');
const AccountMySqlDB = require('./AccountMySqlDB');



module.exports = class AccountsBook {


    /**
     * @constructor
     * @descriptionCreates an instance of AccountsBook.
     */
    constructor() {

        this.type = "type"; //personnel, celi, crédit...
        this.description = "description"; //Description de lutilisateur
        this.nom = "nom"; //nom du compte
        this.proprietaire = "proprietaire"; //proprio du compte

        //    this.transactions = new Map();
        this.accountImporter = new AccountCsvImporter("./config/rules.json", './config/accounts.json');
        //this.ruleParser = new AccountRulesParser();

       this.accountMySql = new AccountMySqlDB();
    }



    async ImportTransactionsCSV(nomFichier, accountName) {
        //await this.accountImporter.ImportTransactionsCSV(nomFichier, accountName);      
        await this.accountImporter.ImportTransactionsCSV("./import_csv/epargne.csv", "Compte chèque de Cyrille", this.accountMySql.AddTransaction);
        await this.accountImporter.ImportTransactionsCSV("./import_csv/credit.csv", "Mastercard de Cyrille", this.accountMySql.AddTransaction);

        this.ExportCSVTransactions("./testexport2.csv");
        this.accountMySql.Disconnect();
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
        let csvExport = new AccountCsvExporter();
        csvExport.ExportCsv(nomFichier, this.accountImporter.transactions);
    }


}
