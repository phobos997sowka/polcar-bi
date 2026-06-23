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
function updateKPIs() {

    deliveryCount.innerText = deliveries.length;

    let totalPositions = 0;
    let totalPieces = 0;
    let highPriority = 0;

    deliveries.forEach(item => {

        totalPositions += item.pozycje;

        totalPieces += item.sztuk;

        if (item.priorytet >= 30) {

            highPriority++;

        }

    });

    positionCount.innerText = totalPositions.toLocaleString("pl-PL");

    pieceCount.innerText = totalPieces.toLocaleString("pl-PL");

    priorityCount.innerText = highPriority;

}

function filterTable() {

    const text = searchInput.value.toLowerCase();

    filteredDeliveries = deliveries.filter(item =>

        item.numer.toLowerCase().includes(text) ||

        item.dostawca.toLowerCase().includes(text) ||

        item.transport.toLowerCase().includes(text) ||

        item.uwagi.toLowerCase().includes(text) ||

        item.stan.toLowerCase().includes(text)

    );

    currentPage = 1;

    renderTable();

    drawSupplierChart();

    drawStatusChart();

}

function renderTable() {

    tbody.innerHTML = "";

    const start = (currentPage - 1) * rowsPerPage;

    const end = start + rowsPerPage;

    const page = filteredDeliveries.slice(start, end);

    page.forEach(item => {

        const tr = document.createElement("tr");

        let priorityClass = "priorityLow";

        if (item.priorytet >= 30) {

            priorityClass = "priorityHigh";

        }
        else if (item.priorytet >= 20) {

            priorityClass = "priorityMedium";

        }

        tr.innerHTML = `

<td>${item.numer}</td>

<td>${item.dostawca}</td>

<td>${item.transport}</td>

<td>${item.pozycje}</td>

<td>${item.sztuk.toLocaleString("pl-PL")}</td>

<td class="${priorityClass}">${item.priorytet}</td>

<td>${item.stan}</td>

<td>${item.typ}</td>

<td>${item.uwagi}</td>

`;

        tbody.appendChild(tr);

    });

    updatePagination();

}

function updatePagination() {

    const maxPages = Math.max(
        1,
        Math.ceil(filteredDeliveries.length / rowsPerPage)
    );

    pageInfo.innerText = currentPage + " / " + maxPages;

    prevPage.disabled = currentPage === 1;

    nextPage.disabled = currentPage === maxPages;

}

function sortByPriority() {

    filteredDeliveries.sort((a, b) => b.priorytet - a.priorytet);

    renderTable();

}

function sortByPieces() {

    filteredDeliveries.sort((a, b) => b.sztuk - a.sztuk);

    renderTable();

}

function sortByPositions() {

    filteredDeliveries.sort((a, b) => b.pozycje - a.pozycje);

    renderTable();

}

function showOnlyHighPriority() {

    filteredDeliveries = deliveries.filter(item => item.priorytet >= 30);

    currentPage = 1;

    renderTable();

}

function resetFilters() {

    filteredDeliveries = [...deliveries];

    searchInput.value = "";

    currentPage = 1;

    renderTable();

    drawSupplierChart();

    drawStatusChart();

}
