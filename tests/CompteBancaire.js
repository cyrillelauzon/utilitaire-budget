// @ts-nocheck
/* const AccountsBook = require('../AccountsBook');

let bankAccount = new AccountsBook;

 */
/*-------------------------------------------------------------------------
    Test: ImportTransactionsCSV
    -------------------------------------------------------------------------*/
/* describe('ImportTransactionsCSV', () => {

    it("Devrait lancer une exception pour un fichier inexistant", () => {
        expect(() => {
            bankAccount.ImportTransactionsCSV("Mauvais nom de fichier");
        }).toThrow();
    });


});



 */

/*-------------------------------------------------------------------------
    Test: CreerTransaction
    -------------------------------------------------------------------------*/
/* describe('CreerTransaction', () => {
    it("Devrait creer un objet transaction avec des parametres valides", () => {
        const resultat = bankAccount.CreerTransaction(0, "2019-02-24", "Transaction Test", "Categorie", 1, 0, 10);

        expect(resultat._id).toBe("002019-02-24Transaction Test-1");
        expect(resultat.Date).toEqual(new Date("2019-02-24"));
        expect(resultat.Description).toBe("Transaction Test");
        expect(resultat.Categorie).toBe("Categorie");
        expect(resultat.Montant).toBe(-1);
        expect(resultat.Solde).toBe(10);
    });

    it("Devrait lancer une exception pour une date invalide", () => {
        expect(() => {
            bankAccount.CreerTransaction(1, "Pas une date", "", "", 1, 0, 1)
        }).toThrow();
    });

    it("Devrait lancer une exception pour compteur invalide", () => {
        expect(() => {
            bankAccount.CreerTransaction("", "2019-02-04", "", "", 1, 0, 1)
        }).toThrow();
    });

    it("Devrait lancer une exception pour un débit invalide", () => {
        expect(() => {
            bankAccount.CreerTransaction(1, "2019-02-04", "", "", null, 0, 1)
        }).toThrow();
    });

    it("Devrait lancer une exception pour un crédit invalide", () => {
        expect(() => {
            bankAccount.CreerTransaction(1, "2019-02-04", "", "", 0, undefined, 1)
        }).toThrow();
    });

    it("Devrait lancer une exception pour un solde invalide", () => {
        expect(() => {
            bankAccount.CreerTransaction(1, "2019-02-04", "", "", 0, 1, null)
        }).toThrow();
    });

}); */