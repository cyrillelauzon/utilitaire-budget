// @ts-nocheck
const Transaction = require('../js/Transaction');



describe('General parameters object creation', () => {

});



//Valid executions and parameters
describe('Correct date object creation ', () => {

    it("Should create a transaction with correct date object (date format: YYYY-MM-DD)", () => {
        const result = new Transaction("2019-02-24", "YYYY-MM-DD",
            "test description", "test category", 10, 0, "test owner", "test tags", 99, undefined);

        expect(result.GetDateString()).toEqual("2019-02-24");
    });

    it("Should create a transaction with correct date object (date format: MM-DD-YYYY)", () => {
        const result = new Transaction("02-24-2019", "MM-DD-YYYY",
            "test description", "test category", 10, 0, "test owner", "test tags", 99, undefined);

        expect(result.GetDateString()).toEqual("2019-02-24");
    });

    it("Should create a transaction with correct date object and different date delimiters (delimiters: space and /)", () => {
        const result = new Transaction("24 2019/02", "DD-YYYY-MM",
            "test description", "test category", 10, 0, "test owner", "test tags", 99, undefined);

        expect(result.GetDateString()).toEqual("2019-02-24");
    });
});


describe('Date format errors validations', () => {
    it("Should throw an error for date not following date Format (date format: YYYY-MM-DD)", () => {
        expect(() => {
            const result = new Transaction("24-2019-02", "YYYY-MM-DD",
            "test description", "test category", 10, 0, "test owner", "test tags", 99, undefined);
        }).toThrow();
    });
    
    it("Should throw an error for repeating date format tokens (date format: YYYY-MM-MM)", () => {
        expect(() => {
            const result = new Transaction("24-2019-02", "YYYY-MM-MM",
            "test description", "test category", 10, 0, "test owner", "test tags", 99, undefined);
        }).toThrow();
    });

    it("Should throw an error for improper date Format delimiter (date format: YYYY/MM-DD)", () => {
        expect(() => {
            const result = new Transaction("24-2019-02", "YYYY/MM-DDD",
            "test description", "test category", 10, 0, "test owner", "test tags", 99, undefined);
        }).toThrow();
    });

    it("Should throw an error for invalid characters in date Format (date format: YYYY-MM-DT)", () => {
        expect(() => {
            const result = new Transaction("24-2019-02", "YYYY-MM-DT",
            "test description", "test category", 10, 0, "test owner", "test tags", 99, undefined);
        }).toThrow();
    });

    it("Should throw an error for improper date Format length (date format: YYYY-MM-DDD)", () => {
        expect(() => {
            const result = new Transaction("24-2019-02", "YYYY-MM-DDD",
            "test description", "test category", 10, 0, "test owner", "test tags", 99, undefined);
        }).toThrow();
    });
});


describe('Date strings errors validations', () => {
    it("Should throw an error for non-numeric characters in date (2019-3a-02)", () => {
        expect(() => {
            const result = new Transaction("2019-3a-02", "YYYY-MM-DD",
            "test description", "test category", 10, 0, "test owner", "test tags", 99, undefined);
        }).toThrow();
    });

    it("Should throw an error for improper date string length (2019-31-022)", () => {
        expect(() => {
            const result = new Transaction("2019-31-022", "YYYY-MM-DD",
            "test description", "test category", 10, 0, "test owner", "test tags", 99, undefined);
        }).toThrow();
    });

    it("Should throw an error for month out of bound (2019-32-02)", () => {
        expect(() => {
            const result = new Transaction("2019-32-02", "YYYY-MM-DD",
            "test description", "test category", 10, 0, "test owner", "test tags", 99, undefined);
        }).toThrow();
    });

    it("Should throw an error for day out of bound (2019-31-00)", () => {
        expect(() => {
            const result = new Transaction("2019-31-00", "YYYY-MM-DD",
            "test description", "test category", 10, 0, "test owner", "test tags", 99, undefined);
        }).toThrow();
    });


});



describe('Transaction amounts validations', () => {

});

describe('Transaction ID validations', () => {

});


describe('Transaction object cloning tests', () => {

});