/*-------------------------------------------------------------------------
Class: AccountMySqlDB
Description: 
Encapsulation of mysql database access
-------------------------------------------------------------------------*/

module.exports = class AccountMySqlDB {

    /**
     * @constructor
     * @descriptionCreates an instance of Util.
     */
    constructor() {



    }

    Connect() {

        var mysql = require('mysql');
        var connection = mysql.createConnection({
            host: 'localhost',
            user: 'cyrillebudget',
            password: 'asv33Mtl06!'
        });

        connection.connect(function (err) {
            if (err) {
                console.error('error connecting: ' + err.stack);
                return;
            }

            console.log('connected as id ' + connection.threadId);

            connection.end(function (err) {
                console.log('disconneted ' + connection.threadId);
                // The connection is terminated now
            });
        });

    }

}