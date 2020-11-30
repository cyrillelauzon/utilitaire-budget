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

        await this.accountMySql.Connect();
        await this.accountImporter.Import(fileName, accountName, this.accountMySql);
        await this.accountMySql.Disconnect();

    }


    /**
     * @description
     */
    async SelectTransactions(description, year,month) {

        await this.accountMySql.Connect();
        
        /* console.debug("***************Begin importing************");

        await this.ImportCSV("./import_csv/epargne.csv", "Compte chèque de Cyrille");
        await this.ImportCSV("./import_csv/credit.csv", "Mastercard de Cyrille");

        console.debug("***************Importing done************"); */
        
         let transactions = await this.accountMySql.SelectTransactions(description,year,month);
         await this.accountMySql.Disconnect();
         return transactions;
 
 //       let csvExport = new AccountCsvExporter();
//        csvExport.ExportCsv("./export_csv/testexport2.csv", transactions);
 
        
    }

    /**
     * @description
     * @param {*} transactionData
     */
    async UpdateTransaction(transactionData){
        await this.accountMySql.Connect();

        let transaction = new Transaction(transactionData.date, "YYYY-MM-DD", transactionData.description,"",0,10,"test","", 0, undefined,0,transactionData.isapproved);
        await this.accountMySql.UpdateTransaction(transaction);

        await this.accountMySql.Disconnect();

    }









}
