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
const AccountCategories = require('./AccountCategories');



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
    async SelectTransactions(description, year, month) {

        await this.accountMySql.Connect();

        /* console.debug("***************Begin importing************");

        await this.ImportCSV("./import_csv/epargne.csv", "Compte chèque de Cyrille");
        await this.ImportCSV("./import_csv/credit.csv", "Mastercard de Cyrille");

        console.debug("***************Importing done************"); */

        let transactions = await this.accountMySql.SelectTransactions(description, year, month);
        await this.accountMySql.Disconnect();
        return transactions;

        //       let csvExport = new AccountCsvExporter();
        //        csvExport.ExportCsv("./export_csv/testexport2.csv", transactions);

    }

    /**
     * @description
     * @param {*} transactionData
     */
    async UpdateTransaction(transactionData) {
        await this.accountMySql.Connect();

        try {
            let transaction = new Transaction(transactionData);
            await this.accountMySql.UpdateTransaction(transaction);

        } catch (error) {
            console.log("Error updating transaction:");
            console.log(error);
            throw new Error("Error updating transaction");
        }
        finally {
            await this.accountMySql.Disconnect();
        }
    }

    /**
     * @description
     * @param {*} category
     */
    async AddCategory(category) {
        await this.accountMySql.Connect();

        try {
           const idNewCategory = await this.accountMySql.AddCategory(category);
           return idNewCategory;

        } catch (error) {
            console.log(error);
            throw new Error("Error adding category");
        }
        finally {
            await this.accountMySql.Disconnect();
        }
    }

    /**
     * @description
     * @param {*} name
     * @returns
     */
    async SelectCategories(name) {
        await this.accountMySql.Connect();

        try {
           const catList = await this.accountMySql.SelectCategories(name);
           const categoriesFormat = new AccountCategories(catList);
           return categoriesFormat.GetArray();

        } catch (error) {
            console.log(error);
            throw new Error("Error selecting categories");
        }
        finally {
            await this.accountMySql.Disconnect();
        }
    }



}
