var XLSX = require("xlsx");
var workbook = XLSX.readFile("ct.xlsx");

let worksheet = workbook.Sheets[workbook.SheetNames[0]];

for (let index = 2; index < 7; index++) {
  const year = worksheet[`A${index}`].v;
  const state = worksheet[`B${index}`].v;
  console.log({ year: year, state: state });
}
