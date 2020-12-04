/*-------------------------------------------------------------------------
Class: AccountCategories
Description: 
Utility class that formats categories into proper array with sub categories
-------------------------------------------------------------------------*/
const Util = require('./Util');
const Transaction = require('./Transaction');
const AccountMySqlDB = require('./AccountMySqlDB');

module.exports = class AccountCategories {


    #categories

    /**
     * @constructor
     * @description
     */
    constructor(entries) {
        this.#categories = this.BuildFromArray(entries);
    }
   


    /**
     * @description
     */
    BuildFromArray(entries) {

        let newCategories = new Array();
        if (Util.isNullOrUndefined(entries)) return newCategories;

        //Copying all entries into a category Map with _id as key
        let catMap = new Map();
        for (let entry of entries) {
            let newEntry = { ...entry };
            newEntry.child_categories = new Array();

            catMap.set(newEntry._id, newEntry);
        }


        for (let entry of entries) {
            try {
                //current entry is a child
                if (!Util.isNullOrUndefined(entry.parent_id)) {

                    //Adding reference to parent object:                    
                    catMap.get(entry.parent_id).child_categories.push(entry);

                    //Removing entry from Map because it has been moved to parent object
                    catMap.delete(entry._id);
                }
            }

            catch (err) {
                console.debug("Error adding new entry to categories object " + err);
            }
        }


        return Array.from(catMap.values());
    }



    /**
     * @description Extract private member data from categories
     * Return an array of transaction data. 
     * @returns {Array}
     */
    GetArray() {

        let categories = new Array();
        categories = [...this.#categories];

        return categories;
    }



}