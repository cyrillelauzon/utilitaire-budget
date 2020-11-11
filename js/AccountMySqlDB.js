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
        this.Connect();
        this.CreateAccountBookDB();
    }

    /**
     * @description
     */
    Connect() {

        var mysql = require('mysql');
        this.connection = mysql.createConnection({
            host: 'localhost',
            user: 'cyrillebudget',
            password: 'asv33Mtl06!'
        });

        this.connection.connect((err) => {
            if (err) {
                console.error('error connecting: ' + err.stack);
                return;
            }

            console.log('connected as id ' + this.connection.threadId);
        });
    }

    /**
     * @description
     */
    Disconnect(){
        this.connection.end((err)=> {
            console.log('disconneted ' +  this.connection.threadId);
        });
    }


    /**
     * @description Create accountBook database and transactions tables
     */
    CreateAccountBookDB(){
/*         this.connection.query('CREATE DATABASE AccountsBook', (error, results, fields) => {

        }); */
        this.connection.query('GRANT USER SELECT', (error, results, fields) => {
            
        });

    }


    /**
     * @description Add a transaction to DB
     * @param {Transaction} transaction
     */
    AddTransaction(transaction){
        //console.log("Transaction added to db:");
        //console.log(transaction);
    }
    

}