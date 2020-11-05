/*-------------------------------------------------------------------------
Class Util
Description: 
Misc helper functions regrouped in static methods
-------------------------------------------------------------------------*/

module.exports = class Util {

    /**
     * @constructor
     * @descriptionCreates an instance of Util.
     */
    constructor() {
    }


    /**
     * @description Read a JSON object from file
     * @param {string} filename
     * @returns {object}
     */
    static ReadJsonObject(filename){
        const fs = require('fs');
        var jobj = undefined;
                    
        try {
            let jsonString = fs.readFileSync(filename, 'utf8');
            jobj = JSON.parse(jsonString)
        }
        catch(err){
            console.log("Error reading file from disk:", err)
        }

        return jobj;
    }

}