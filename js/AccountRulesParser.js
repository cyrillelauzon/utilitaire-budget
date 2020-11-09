/*-------------------------------------------------------------------------
Class: AccountRulesParser
Description: 
Modify transactions using a sets of rules defined in config/rules.json
If the rule is found in the json file and the transaction meets the conditions,
the rule is applied to the transaction. Handy to autoapply categories based on description field.
ex: apply grocery category to all transactions made at grocery store
    apply Salary category only if transaction amount is > 0

Priority is defined by order in which each rule appears in the conf file
starting from top to bottom of file.
-------------------------------------------------------------------------*/
const Util = require('./Util');
const Transaction = require('./Transaction');

module.exports = class AccountRulesParser {


    #parseRules;
    
    /**
     * @constructor
     * @descriptionCreates an instance of AccountRulesParser.
     */
    constructor(rulesFileName) {

        //Read the parsing rules conf files 
        this.#parseRules = Util.ReadJsonObject(rulesFileName);
    }


    /**
     * @description Parse 1 indivudal rule and return the affected transaction
     * @paran {transaction}
     * @returns {transaction}
     */
    ParseTransaction(transaction) {
        for (let rule of this.#parseRules['rules']) {
            if (rule['Description'] === transaction['Description']) {
                if (this.#ParseConditions(transaction, rule)) {
                    transaction['Category'] = rule['Category'];
                }
            }
        }
        return transaction;
    }


    /**
     * @description returns true if rule meets all defined conditions to be applied
    * @param {Transaction} transaction
    * @param {Array} rule
     * @returns {boolean}
     */
    #ParseConditions(transaction, rule) {
        const conditions = rule['Conditions'];

        if (typeof conditions === 'object' && conditions !== null) {

            //isIncome field is defined:
            if (conditions['isIncome'] !== undefined) {
                //Condition: IsIncome must be true
                if (conditions['isIncome'] === true) {
                    const isIncome = transaction.IsIncome();
                    if (!isIncome) return false;
                }

                //Condition: IsIncome must be false
                if (conditions['isIncome'] === false) {
                    const isIncome = transaction.IsIncome();
                    if (isIncome) return false;
                }
            }

            //if defined: Transaction amount must not be lower then low field
            if (conditions['Low'] !== undefined) {
                const lowestAmount = conditions['Low'];
                if (transaction.GetAmount() < lowestAmount) return false;
            }

            //if defined: Transaction amount must not be higher then high field
            if (conditions['High'] !== undefined) {
                const highestAmount = conditions['High'];
                if (transaction.GetAmount() > highestAmount) return false;
            }
        }

        return true;
    }



}