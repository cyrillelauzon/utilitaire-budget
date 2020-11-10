// @ts-nocheck
const Transaction = require('../js/Transaction');
const AccountRulesParser = require('../js/AccountRulesParser');

const parser = new AccountRulesParser(__dirname + "/rulestest.json");

//Valid executions and parameters
describe('RulesParser category assignation using rules.test.json', () => {
    
    it("Should assign a new category based on parser rules (new category assigned)", () => {
        const initialTransaction = new Transaction("2019-02-20", "YYYY-MM-DD",
            "test description", "test category", 10, 0, "test owner", "test tags", 99, 
            undefined);
        const result = parser.ParseTransaction(initialTransaction);
        expect(result.GetCategory()).toBe("new category assigned");
    });

    it("Should not assign a new category if no rule found for Description field(test category)", () => {
        const initialTransaction = new Transaction("2019-02-20", "YYYY-MM-DD",
            "test description do not touch", "test category", 10, 0, "test owner", "test tags", 99, 
            undefined);
        const result = parser.ParseTransaction(initialTransaction);
        expect(result.GetCategory()).toBe("test category");
    });

    it("Should assign a new category when isIncome condition met(new category with Income) and rules down the list should overwrite precedent rules", () => {
        const initialTransaction = new Transaction("2019-02-20", "YYYY-MM-DD",
            "test description", "test category", 0, 10, "test owner", "test tags", 99, 
            undefined);
        const result = parser.ParseTransaction(initialTransaction);
        expect(result.GetCategory()).toBe("new category with Income");
    });

    
  
});

