
const Util = require('./Util');
let util = new Util;


module.exports = class RuleParser {

    /**
     * @constructor
     * @descriptionCreates an instance of RuleParser.
     */
    constructor() {
        //Read the parsing rules that will be applied sequentially by the parser
        this.parseRules = util.ReadJsonObject("./config/rules.json");
    }

    
    /**
     * @description Parse all the rules in the parser and apply them 
     *              to the bank account
     */
    ParseBankAccount() {

    }


    /**
     * @description Parse 1 indivudal rule and return the affected transaction
     */
    ParseRule(){

    }


}