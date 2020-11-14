/*-------------------------------------------------------------------------
Class: AccountMySqlDB
Description: 
Encapsulation of mysql database access
-------------------------------------------------------------------------*/
const Util = require('./Util');
const Transaction = require('./Transaction');
const TransactionsMap = require('./TransactionsMap');


module.exports = class AccountMySqlDB {

    connection;

    /**
     * @constructor
     * @descriptionCreates an instance of Util.
     */
    constructor() {

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
            database: 'accountsbook'
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
        this.connection.end((err) => {
            console.log('disconneted ' + this.connection.threadId);
        });
    }


    /**
     * @description Create accountBook database and transactions tables
     */
    CreateAccountBookDB() {
        /*         this.connection.query('CREATE DATABASE AccountsBook', (error, results, fields) => {
        
                }); */
        /* this.connection.query('GRANT USER SELECT', (error, results, fields) => {
            
        }); */

    }


    /**
     * @description Will select a range of transaction from DB based on filters
     * TODO ex: by month, by tag, by category
     */
    SelectTransactions() {

        var transactions = new TransactionsMap();
        return new Promise((resolve, reject) => {

            console.debug("MySQL: Reading entries from DB");

            var query = this.connection.query('SELECT * FROM `transactions` ORDER BY `_id` DESC ', (error, results, fields) => {
                if (error) reject(new Error("MySql error reading query " + error));
                console.log("transaction are read from database: ");
                transactions.BuildFromArray(results)
                resolve(transactions);
            });

        });
    }



    /**
     * @description Add a transaction to DB
     * @param {Transaction} transaction
     * //TODO Implement function as Promise? 
     */
    AddTransaction(transaction) {
        //console.log("Transaction added to db:");
        //console.log(transaction);

        //TODO integrate this line into transaction.GetDateString 
        var d = transaction.GetDate(); d.toISOString().split('T')[0] + ' ' + d.toTimeString().split(' ')[0];

        var post = {
            _id: transaction.GetID(),
            date: d,
            description: transaction.GetDescription(),
            category: transaction.GetCategory(),
            amount: transaction.GetAmount(),
            balance: transaction.GetBalance(),
            owner: transaction.GetOwner()
        };

        var query = this.connection.query('INSERT INTO transactions SET ?', post, (error, results, fields) => {
            if (error) {
                //    throw new Error("MySQL db: Could not add transaction to db" + error);
            }
            // Neat!
        });

    }


   

}