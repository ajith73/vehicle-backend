const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.sqlite');

db.serialize(() => {
  db.run("DROP TABLE IF EXISTS VehicleTypes");
  db.run("DROP TABLE IF EXISTS ServiceTypes");
  console.log("Dropped tables");
});
db.close();
