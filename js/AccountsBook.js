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
    async ImportCSV(fileName, accountName) {


        //TODO Async: make sure await mechanism is functionnal for importing csv files
        await this.accountMySql.Connect();
        await this.accountImporter.Import(fileName, accountName, this.accountMySql);
        console.debug("Transaction imported: " + this.accountImporter.GetTransactions().GetLength());
        await this.accountMySql.Disconnect();

    }


    /**
     * @description
     */
    async SelectTransactions() {

        await this.accountMySql.Connect();

        let transactions = await this.accountMySql.SelectTransactions("");
        let csvExport = new AccountCsvExporter();
        csvExport.ExportCsv("./export_csv/testexport2.csv", transactions);

        await this.accountMySql.Disconnect();
    }







}
