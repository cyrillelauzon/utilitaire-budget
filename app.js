require("./CompteBancaire.js");

const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const CompteBancaire = require("./CompteBancaire.js");
let compteTest = new CompteBancaire();



const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');

    let responseText = "Transactions";




    res.end(responseText);



});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});