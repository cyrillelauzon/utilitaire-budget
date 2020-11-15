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
     * @description Will select a range of transaction from DB based on filters
     * @param {string} description
     */
    SelectTransactions(description) {

        var transactions = new TransactionsMap();
        return new Promise((resolve, reject) => {

            console.debug("MySQL: Reading entries from DB");

            var query = this.connection.query('SELECT * FROM '+ this.#transactionsTable+' WHERE description=? ORDER BY `_id` DESC ', [description], (error, results, fields) => {
                if (error) reject(new Error("MySql error reading query " + error));

                console.log("MySQL: Reading from database completed ");

                transactions.BuildFromArray(results)
                resolve(transactions);
            });

        }).catch((err) => {
            console.error("MySql error in SELECT transaction " + err);
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
            var query = this.connection.query('INSERT INTO transactions SET ?',  post, (error, results, fields) => {
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