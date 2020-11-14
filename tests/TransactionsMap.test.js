// @ts-nocheck
const Transaction = require('../js/Transaction');
const TransactionsMap = require('../js/TransactionsMap');

var tr = new TransactionsMap();

//Valid executions and parameters
describe('TransactionsMap: Adding transactions', () => {

    var trA = new Transaction("2019-24-02", "YYYY-DD-MM",
        "test description", "test category", "", null, "test owner", "test tags", 99,
        -100);
        tr.Add(trA);

    it("TransactionMap should contain 1 element", () => {
        expect(tr.GetLength()).toBe(1);
    });

});

//Valid executions and parameters
describe('TransactionsMap: Adding transactions', () => {

    var trA = new Transaction("2019-24-02", "YYYY-DD-MM",
        "test description", "test category", "", null, "test owner", "test tags", 99,
        -100);
        tr.Add(trA);

    it("TransactionMap should contain 2 element", () => {
        expect(tr.GetLength()).toBe(2);
    });

});

//Valid executions and parameters
describe('TransactionsMap: Adding transactions', () => {

    var trA = new Transaction("2019-24-02", "YYYY-DD-MM",
        "test description", "test category", "", null, "test owner", "test tags", 99,
        -100);
        tr.Add(trA);

    it("TransactionMap should contain 2 element", () => {
        expect(tr.GetLength()).toBe(3);
    });

});