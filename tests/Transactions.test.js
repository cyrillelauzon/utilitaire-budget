// @ts-nocheck
const Transaction = require('../js/Transaction');


/*-------------------------------------------------------------------------
    Test: Transaction object creation
    -------------------------------------------------------------------------*/
describe('Transaction creation', () => {

    it("Should create a transaction with correct parameters and this.amount when using deposit parameter", () => {
        const result = new Transaction("2019-02-24", "YYYY-MM-DD",
            "test description",
            "test category",
            10, 0,
            "test owner",
            "test tags",
            99, undefined);

        expect(result.GetDateString()).toEqual("2019-02-24");
        expect(result.GetDescription()).toBe("test description");
        expect(result.GetCategory()).toBe("test category");
        expect(result.GetAmount()).toBe(10);    //Tested value
        expect(result.GetOwner()).toBe("test owner");
        expect(result.GetTags()).toBe("test tags");
        expect(result.GetBalance()).toBe(99);
        expect(result.GetID()).toBe("2019-02-24test description1000");
    });

    it("Should create a transaction with correct this.amount when using withdraw parameter", () => {
        const result = new Transaction("2019-02-24", "YYYY-MM-DD",
            "test description",
            "test category",
            0, 10,
            "test owner",
            "test tags",
            99, undefined);

        expect(result.GetDateString()).toEqual("2019-02-24");
        expect(result.GetDescription()).toBe("test description");
        expect(result.GetCategory()).toBe("test category");
        expect(result.GetAmount()).toBe(-10);            //Tested value
        expect(result.GetOwner()).toBe("test owner");
        expect(result.GetTags()).toBe("test tags");
        expect(result.GetBalance()).toBe(99);
        expect(result.GetID()).toBe("2019-02-24test description-1000");
    });


});
