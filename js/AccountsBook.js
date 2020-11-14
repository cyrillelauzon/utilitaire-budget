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

        this.accountImporter = new AccountCsvImporter("./config/rules.json", './config/accounts.json');

        this.accountMySql = new AccountMySqlDB();
    }



    /**
     * @description
     * @param {string} fileName
     * @param {string} accountName
     */
    async ImportTransactionsCSV(fileName, accountName) {
        
        await this.accountMySql.Connect();

        //await this.accountImporter.ImportTransactionsCSV(fileName, accountName);      
        await this.accountImporter.ImportTransactionsCSV("./import_csv/epargne.csv", "Compte chèque de Cyrille", this.accountMySql);
        await this.accountImporter.ImportTransactionsCSV("./import_csv/credit.csv", "Mastercard de Cyrille", this.accountMySql);


        let transactions = await this.accountMySql.SelectTransactions();
        console.log("transaction are read from database: " + transactions);

        let csvExport = new AccountCsvExporter();
        csvExport.ExportCsv("./testexport2.csv", transactions);

        this.accountMySql.Disconnect();
    }


}
