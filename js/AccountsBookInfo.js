/*-------------------------------------------------------------------------
Class AccountInfo
Description: 
Regroup and read all of an AccountsBook metadata from json config files
-------------------------------------------------------------------------*/

const Util = require('./Util');


module.exports = class AccountsBookInfo {

    /**
     *Creates an instance of AccountCsvExporter.
     */
    constructor(configFileName) {
        this.info = Util.ReadJsonObject(configFileName);
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
    MapFieldNames(newDataRow, accountName) {
        let accountInfo = this.info[accountName];
        let mappedData = new Array;

        mappedData['Owner'] = this.GetOwner(accountName);
        mappedData['date'] = newDataRow[accountInfo['date']];
        mappedData['Description'] = newDataRow[accountInfo['Description']];
        mappedData['Category'] = newDataRow[accountInfo['Category']];
        mappedData['Amount'] = newDataRow[accountInfo['Amount']];
        mappedData['Deposit'] = newDataRow[accountInfo['Deposit']];
        mappedData['Withdraw'] = newDataRow[accountInfo['Withdraw']];
        mappedData['Balance'] = newDataRow[accountInfo['Balance']];

        return mappedData;
    }

    /**
     * @description
     * @param {string} accountName
     * @returns {string}
     */
    GetDelimiter(accountName) {
        return this.info[accountName]["csv-delimiter"];
    }

    /**
     * @description
     * @param {string} accountName
     * @returns {string}
     */
    GetOwner(accountName) {
        return this.info[accountName]["Owner"];
    }

}