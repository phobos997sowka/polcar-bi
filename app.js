const textarea = document.getElementById("inputData");
const analyzeButton = document.getElementById("analyzeButton");
const searchInput = document.getElementById("searchInput");

const tbody = document.querySelector("#deliveryTable tbody");

const deliveryCount = document.getElementById("deliveryCount");
const positionCount = document.getElementById("positionCount");
const pieceCount = document.getElementById("pieceCount");
const priorityCount = document.getElementById("priorityCount");

const prevPage = document.getElementById("prevPage");
const nextPage = document.getElementById("nextPage");
const pageInfo = document.getElementById("pageInfo");

let deliveries = [];

let filteredDeliveries = [];

let currentPage = 1;

const rowsPerPage = 20;

let supplierChart = null;

let statusChart = null;

analyzeButton.addEventListener("click", parseData);

searchInput.addEventListener("input", filterTable);

prevPage.addEventListener("click", () => {

if(currentPage>1){

currentPage--;

renderTable();

}

});

nextPage.addEventListener("click",()=>{

const max=Math.ceil(filteredDeliveries.length/rowsPerPage);

if(currentPage<max){

currentPage++;

renderTable();

}

});

function parseData(){

const raw=textarea.value.trim();

if(raw===""){

alert("Wklej dane z Cerbera");

return;

}

const lines=raw.split(/\r?\n/);

const headers=lines[0].split("\t");

deliveries=[];

for(let i=1;i<lines.length;i++){

const cols=lines[i].split("\t");

if(cols.length<5){

continue;

}

deliveries.push({

numer:cols[0]||"",

dostawca:cols[1]||"",

transport:cols[2]||"",

dataPrzyjazdu:cols[3]||"",

dataMagazyn:cols[4]||"",

plan:cols[5]||"",

odpowiedzialny:cols[6]||"",

dni:parseInt(cols[7])||0,

pozycje:parseInt(cols[8])||0,

dniMozliwe:parseInt(cols[9])||0,

sztuk:parseInt(cols[10])||0,

przestoj:cols[11]||"",

przyjetych:cols[12]||"",

rozlozonych:cols[13]||"",

przekazanie:cols[14]||"",

symbol:cols[15]||"",

stan:cols[16]||"",

uwagi:cols[17]||"",

priorytet:parseInt(cols[18])||0,

dostawcy:cols[19]||"",

typ:cols[20]||""

});

}

filteredDeliveries=[...deliveries];

currentPage=1;

updateKPIs();

renderTable();

drawSupplierChart();

drawStatusChart();

}
