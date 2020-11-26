/*-------------------------------------------------------------------------
Class: AccountMySqlDB
Description: 
Encapsulation of mysql database access
-------------------------------------------------------------------------*/
const Util = require('./Util');
const Transaction = require('./Transaction');
const TransactionsMap = require('./TransactionsMap');

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
                    if (/^\d{2}$/.test(month) === false) throw new Error("month format is invalid");
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

                if (error){
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
     * @description Add a transaction to DB
     * @param {Transaction} transaction
     */
    async AddTransaction(transaction) {
        //console.log("Transaction added to db:");

        //var d = transaction.GetDate(); d.toISOString().split('T')[0] + ' ' + d.toTimeString().split(' ')[0];

        var post = {
            _id: transaction.GetID(),
            date: transaction.GetDate(),
            description: transaction.GetDescription(),
            category: transaction.GetCategory(),
            amount: transaction.GetAmount(),
            balance: transaction.GetBalance(),
            owner: transaction.GetOwner()
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




}