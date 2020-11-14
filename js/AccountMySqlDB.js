/*-------------------------------------------------------------------------
Class: AccountMySqlDB
Description: 
Encapsulation of mysql database access
-------------------------------------------------------------------------*/
const Util = require('./Util');
const Transaction = require('./Transaction');

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

        return new Promise((resolve, reject) => {

            console.debug("MySQL: Reading entries from DB");

            var query = this.connection.query('SELECT * FROM `transactions` ORDER BY `_id` DESC ', (error, results, fields) => {
                if (error) reject(new Error("MySql error reading query " + error));

                resolve(this.BuildTransactionsMap(results));
            });

        });
    }


    /**
     * @description build a map of transaction objects using MySql results read from database
     * @param {*} results
     */
    BuildTransactionsMap(results) {

        console.debug("MySQL: Building Map<string, Transaction> of fetched queries");
        let transactionsMap = new Map();
        for (const entry of results) {
            try {
                let counter = 0;

                let newTransaction = new Transaction(entry.date, "",
                    entry.description, entry.category,
                    undefined, undefined, "", "", entry.balance, entry.amount, counter);

                //check for duplicates and update counter:
                let strID = newTransaction.GetID();
                while (transactionsMap.has(strID)) {
                    counter += 1;
                    newTransaction.SetID(counter);
                    strID = newTransaction.GetID();
                }

                transactionsMap.set(newTransaction.GetID(), newTransaction);

            }
            catch (err) {
                console.debug("MySQL: Error adding new entry to transactionsMap " + err);
            }

        }
        return transactionsMap;
    }

    /**
     * @description Add a transaction to DB
     * @param {Transaction} transaction
     * //TODO Implement function as Promise? 
     */
    AddTransaction(transaction) {
        //console.log("Transaction added to db:");
        //console.log(transaction);

        //TODO integrate this into transaction.GetDateString 
        //TODO read date from DB and create transaction object
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