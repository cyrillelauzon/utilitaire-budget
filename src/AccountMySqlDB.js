/*-------------------------------------------------------------------------
Class: AccountMySqlDB
Description: 
Encapsulation of mysql database access
-------------------------------------------------------------------------*/
const Util = require('./Util');
const Transaction = require('./Transaction');
const TransactionsMap = require('./TransactionsMap');
const AccountCsvExporter = require('./AccountCsvExporter');

const TEST_ENV = "_test";


module.exports = class AccountMySqlDB {

    connection;
    #transactionsTable;


    /**
     * @constructor
     * @descriptionCreates an instance of Util.
     */
    constructor(isTestEnv = false) {
        this.#transactionsTable = "transactions";
        if (isTestEnv) this.#transactionsTable += TEST_ENV;
    }

    /**
     * @description
     */
    async Connect() {

        var mysql = require('mysql');
        this.connection = mysql.createConnection({
            host: 'localhost',
            user: 'cyrillebudget',
            password: 'asv33Mtl06!',
            database: 'accountsbook',
            timezone: 'local'
        });

        return new Promise((resolve, reject) => {
            this.connection.connect((err) => {
                if (err) {
                    //TODO implement gracefull way to exit app if SQL connexion refused
                    console.error('error connecting: ' + err.stack);
                    reject();
                }

                console.debug('MySQL db connected as id ' + this.connection.threadId);
                resolve();
            });
        });
    }

    /**
     * @description
     */
    Disconnect() {
        return new Promise((resolve, reject) => {
            this.connection.end((err) => {
                if (err) {
                    console.error('error Disconnecting: ' + err.stack);
                    reject();
                }

                console.debug('MySQL disconnected ' + this.connection.threadId);
                resolve();
            });
        });
    }


    /**
     * @description Create accountBook database and transactions tables
     */
    CreateAccountBookDB() {
        /*this.connection.query('CREATE DATABASE AccountsBook', (error, results, fields) => {
        
                }); */
        /* this.connection.query('GRANT USER SELECT', (error, results, fields) => {
            
        }); */

    }


    /**
     * @description Backups all DB records to a CSV file
     * @param {*} fileName
     */
    async BackupDB(fileName) {
        let csvExporter = new AccountCsvExporter();
        let transactions = await this.SelectTransactions("*", "*", "*");
        csvExporter.ExportCsv(fileName, transactions);
    }

    /**
     * @description Add a transaction to DB
     * @param {Transaction} transaction
     */
    async AddTransaction(transaction) {
        var post = {
            _id: transaction.GetID(),
            date: transaction.GetDate(),
            description: transaction.GetDescription(),
            category: transaction.GetCategory(),
            amount: transaction.GetAmount(),
            balance: transaction.GetBalance(),
            owner: transaction.GetOwner(),
            isapproved: transaction.IsApproved()
        };


        return new Promise((resolve, reject) => {
            var query = this.connection.query('INSERT INTO transactions SET ?', post, (error, results, fields) => {
                if (error) {
                    reject(new Error("MySQL db: Could not add transaction to db" + error));
                }
                resolve();
            });

        }).catch((err) => {
            //console.error(err);
        });
    }

    /**
     * @description Select transactions from MySQL db based on filters
     * @param {*} description transaction description, * to omit
     * @param {*} year transaction year, * to omit
     * @param {*} month transaction month from 1 to 12, * to omit
     * @returns TransactionList object, TransactionListobject with no transactions if empty or errors
     */
    SelectTransactions(description, year, month) {
        var transactions = new TransactionsMap();

        return new Promise((resolve, reject) => {
            console.debug("MySQL: Reading entries from DB");

            //Function parameters validation:
            try {
                if (year !== "*") {
                    if (/^\d{4}$/.test(year) === false) throw new Error("year format is invalid");
                }

                if (month !== "*") {
                    if (/^\d{1,2}$/.test(month) === false) throw new Error("month format is invalid");
                    if (month < 1 || month > 12) throw new Error("month is an invalid number");
                }

            } catch (error) {
                console.debug("MySQL:" + error);
                reject(error);
                return transactions;
            }

            //Building the WHERE statement, even if not all parameters are defined
            //easy to add more params in the future
            //FIXME add SQL escaping for description
            var isFirst = true;
            let queryWHERE = "";
            if (month !== "*") queryWHERE += ` ${getWHERE()} Month(date)=${month}`;
            if (year !== "*") queryWHERE += ` ${getWHERE()} Year(date)=${year}`;
            if (description !== "*") queryWHERE += ` ${getWHERE()} description=${description}`;

            function getWHERE() {
                if (isFirst) {
                    isFirst = false;
                    return "WHERE";
                }
                return "&&";
            }

            //Assembles query string and make call to DB
            let strQuery = 'SELECT * FROM ' + this.#transactionsTable + queryWHERE + ' ORDER BY `_id` DESC ';
            var query = this.connection.query(strQuery, (error, results, fields) => {

                if (error) {
                    reject(new Error(`SQL query: ${strQuery}  ${error}`));
                    return transactions;    //Empty transactionslist        
                }

                console.debug(`MySQL: ${results.length} transactions found, reading from database completed `);
                console.debug(`SQL query: ${strQuery}`);

                transactions.BuildFromArray(results);
                resolve(transactions);
            });

        }).catch((err) => {
            console.error("MySql Error selecting transactions: " + err);
            return transactions;    //Empty transactionslist
        });
    }


    /**
     * @description
     * @param {Transaction} transaction
     */
    async UpdateTransaction(transaction) {
        console.log("MySql: Transaction to update: ");
        console.log(transaction);

        var update = {
            isapproved: transaction.IsApproved()
        };

        return new Promise((resolve, reject) => {
            var query = this.connection.query('UPDATE transactions SET ? WHERE _id = ?', [update, transaction.GetID()], (error, results, fields) => {
                if (error || results.affectedRows === 0) {
                    console.log("Error detected UPDATE transaction mysql");
                    reject(new Error("MySQL db: Could not add transaction to db"));
                    return;
                }
                resolve();
                console.log("MySQl transaction updated");
            });
        });
    }

    /**
     * @description
     * @param {*} category
     */
    async AddCategory(category) {
        console.log(`adding category to DB${category}`);
        console.log(`name:${category.name}`);
        console.log(`description:${category.description}`);
        console.log(`parent:${category.parent}`);


        return new Promise((resolve, reject) => {
            var query = this.connection.query('INSERT INTO categories SET ?', category, (error, results, fields) => {
                if (error) {
                    reject(new Error("MySQL db: Could not add category to db " + error));
                    return;
                }
                resolve(results.insertId);
                console.log("MySQl category added ");
            });
        });
    }

    /**
     * @description
     * @param {*} name
     */
    async SelectCategories(name) {

        return new Promise((resolve, reject) => {
            //Assembles query string and make call to DB
            let strQuery = 'SELECT * FROM categories ORDER BY `_id` DESC ';
            var query = this.connection.query(strQuery, (error, results, fields) => {

                if (error) {
                    reject(new Error(`SQL query: ${strQuery}  ${error}`));
                    return;
                }

                console.debug(`MySQL: ${results.length} categories found, reading from database completed `);
                console.debug(`SQL query: ${strQuery}`);

                resolve(results);
            });
        });
    }


}