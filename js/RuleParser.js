
const Util = require('./Util');
let util = new Util;
const Transaction = require('./Transaction');

module.exports = class RuleParser {

    /**
     * @constructor
     * @descriptionCreates an instance of RuleParser.
     */
    constructor() {
        //Read the parsing rules that will be applied sequentially by the parser
        this.parseRules = util.ReadJsonObject("./config/rules.json");
    }

    

/*     ParseBankAccount(transactions) {

        for(let rule of this.parseRules['rules']){
            
            console.log("New rule: " + rule['Description'])
            for(let transaction of transactions){

                console.log("Testing transaction " + rule['Description'] + "Transaction: " + transaction['Description'])
                if(rule['Description']===transaction['Description']){
                    transaction['Category'] = rule['Category'];
                }
            }  
        }
          
    }
 */

    /**
     * @description Parse 1 indivudal rule and return the affected transaction
     * @paran {transaction}
     * @returns {transaction}
     */
    ParseTransaction(transaction){
        for(let rule of this.parseRules['rules']){
            if(rule['Description']===transaction['Description']){
                transaction['Category'] = rule['Category'];
            }
        }
        return transaction;
    }


}