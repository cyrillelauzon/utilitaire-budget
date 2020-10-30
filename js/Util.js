
module.exports = class Util {

    /**
     * @constructor
     * @descriptionCreates an instance of Util.
     */
    constructor() {
    }


    ReadJsonObject(filename){
        const fs = require('fs');
        var jobj = undefined;
                    
        try {
            let jsonString = fs.readFileSync(filename, 'utf8');
            jobj = JSON.parse(jsonString)
        }
        catch(err){
            console.log("Error reading file from disk:", err)
        }

        console.log(jobj);
        return jobj;
    }

}