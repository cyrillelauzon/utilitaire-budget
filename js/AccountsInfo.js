/*-------------------------------------------------------------------------
Class AccountInfo
Description: 
Regroup and read from bank account's metadata from config files
-------------------------------------------------------------------------*/

const Util = require('./Util');


module.exports = class AccountsInfo {

    /**
     *Creates an instance of CsvAccountExporter.
     */
    constructor(configFileName){
        this.accountsInfo = Util.ReadJsonObject(configFileName);
    }


    /**
     * @description Map the names of data columns of any CSV file so they match
     * the unified column names used by the csv importer.
     * Copy the corresponding row of data into a new data array
     *
     * Mappings are defined in config/accounts.json
     * 
     * @param {Array} newDataRow
     * @param {string} accountName
     */
    MapFieldNames(newDataRow, accountName){
        let accountInfo = this.accountsInfo[accountName];        
        let mappedData = new Array;

        mappedData['date'] = newDataRow[accountInfo['date']];
        mappedData['Description'] = newDataRow[accountInfo['Description']];
        mappedData['Category'] = newDataRow[accountInfo['Category']];
        mappedData['Amount'] = newDataRow[accountInfo['Amount']];
        mappedData['Deposit'] = newDataRow[accountInfo['Deposit']];
        mappedData['Withdraw'] = newDataRow[accountInfo['Withdraw']];
        mappedData['Balance'] = newDataRow[accountInfo['Balance']];

        return mappedData;
    }

    
}