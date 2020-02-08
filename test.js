let mymap = new Map();

mymap.set("1", "clé1");

if (mymap.has("1")) {
    console.log("has1");
    mymap.set("2", "clé2");
}


mymap.forEach((valeur, clé) => {
    console.log(clé + " = " + valeur);
});