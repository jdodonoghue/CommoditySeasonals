function chooseType() {
    d3.select("#divChart").select("svg").remove();
    loadCommodities();
    document.getElementById("selCommodity").selectedIndex = 0;
}

function chooseCommodity() {
    var selType = document.getElementById("selType");
    var selCommodity = document.getElementById("selCommodity");

    d3.select("#divYears").html("");
    d3.select("#divChart").select("svg").remove();

    if (selType.value == "Individual") {
        if (selCommodity.value != "0") {
            getYears(selType.value, selCommodity.value);
        }
    }

    if (selType.value == "Spreads") {
        getYears(selType.value, selCommodity.value);
    }

    if (selType.value == "Continuous") {
        getYears(selType.value, selCommodity.value);
    }
}

function chooseChartType() {
    chartType = document.getElementById("selChartType").value;
    if (chartType == "Percentage") {
        yAxisLabelText = "Percent";
    } else {
        yAxisLabelText = "Close";
    }
    chooseCommodity();
}

function loadCommodities() {
    var selType = document.getElementById("selType");
    var selCommidity = document.getElementById("selCommodity");
    deleteOptions(selCommidity);

    if (selType.value == "Individual") {
        var indsymArray = JSON.parse(individualsymbols);
        addOption(selCommidity, "Select", "0");
        indsymArray.forEach(function (d) {
            addOption(selCommidity, d.longDesc, d.symbol);
        });
    }
    if (selType.value == "Spreads") {
        var sprsymArray = JSON.parse(spreadsymbols);
        addOption(selCommidity, "Select", "0");
        sprsymArray.forEach(function (d) {
            addOption(selCommidity, d.symbol1.longDesc, d.symbol1.short);
        });
    }
    if (selType.value == "Continuous") {
        var contsymArray = JSON.parse(continuoussymbols);
        addOption(selCommidity, "Select", "0");
        contsymArray.forEach(function (d) {
            addOption(selCommidity, d.longDesc, d.symbol);
        });
    }
}

function getYears(selTypeValue, symbolRoot) {

    var d = new Date();
    var yearStart = d.getFullYear() - 5;

    symbolList = [];
    d3.select("#divYears").html("");

    symbolList.push(selTypeValue);
    var dataYears = buildYearList();
    dataYears.forEach(function (d) {
        var shortyear = d.substring(2, 4);
        var longyear = d;

        var newInput = document.createElement("input");
        newInput.id = "chk" + shortyear;
        newInput.name = "yearcheck";
        newInput.type = "checkbox";
        newInput.value = shortyear;
        
        //newInput.checked = true;

        newInput.addEventListener("click", handleYearClick);

        var newlabel = document.createElement("Label");
        newlabel.setAttribute("for", newInput.id);
        newlabel.innerHTML = longyear;

        document.getElementById("divYears").appendChild(newInput);
        document.getElementById("divYears").appendChild(newlabel);

        if (longyear > yearStart) {
            newInput.checked = true;
            newInput.disabled = false;
        }
        else {
            newInput.checked = false;
            newInput.disabled = true;
            newInput.class = "readonly";
        }

        symbolList.push(symbolRoot + d.shortyear);
    });

    buildSymbolList();
}

function buildYearList() {
    var years = [];
    var d = new Date();
    var n = d.getFullYear();
    var yearDisplay = 15;
    for (var i = 0; i < yearDisplay; i++) {
        var n = d.getFullYear() - i;
        years.push(n.toString());
    }

    return years.reverse();
}

function buildSymbolList() {
    d3.select("#divChart").select("svg").remove();
    if (selType.value == "Individual") {
        buildIndividualURL();
    }

    if (selType.value == "Spreads") {
        buildSpreadsURL();
    }

    if (selType.value == "Continuous") {
        buildContinuousContractsURL();
    }
}

function handleYearClick(obj) {
    buildSymbolList();
}

function GetBeginDate(root) {
    var stdArray = JSON.parse(individual);
    var output = "";
    stdArray.forEach(function (d) {
        if (root == d.symbolroot) {
            output = d.beginmonth + d.beginday;
            return false;
        }
    });
    return output;
}

function GetEndDate(root) {
    var stdArray = JSON.parse(individual);
    var output = "";
    stdArray.forEach(function (d) {
        if (root == d.symbolroot) {
            output = d.endmonth + d.endday;
            return false;
        }
    });
    return output;
}

function buildIndividualURL() {
    var symbolRoot = document.getElementById("selCommodity").value;
    var symbolList = [];
    var month = symbolRoot.substr(symbolRoot.length - 1, 1);
    var bd = GetBeginDate(month);
    var ed = GetEndDate(month);

    var interval = "Weekly";
    symbolList.push(interval);

    d3.select("#divYears").selectAll("input")
        .each(function () {
            if (this.checked == true) {
                var year = this.value;
                var by = year - 1;
                var label = symbolRoot + year;
                symbolList.push(symbolRoot + year + "|" + label + "|" + "1" + by + bd + "|" + "1" + year + ed);
            }
        });

    var ext = symbolList.join(",");

    getData(ext);
}

function buildSpreadsURL() {
    var symbolRoot2 = "";
    var symbolRoot = document.getElementById("selCommodity").value;
    var sprArray = JSON.parse(spreads);
    var symbolList = [];
    var month = symbolRoot.substr(symbolRoot.length - 1, 1);

    var bd = GetBeginDate(month);
    var ed = GetEndDate(month);

    sprArray.forEach(function (d) {
        if (symbolRoot == d.symbolroot1) {
            symbolRoot2 = d.symbolroot2;
            month2 = d.symbolroot2.substr(symbolRoot2.length - 1, 1);
            return false;
        }
    });

    var interval = "Weekly";
    symbolList.push(interval);

    d3.select("#divYears").selectAll("input")
        .each(function () {
            if (this.checked == true) {
                var year = this.value;
                var by = year - 1;
                var label = symbolRoot + year + "-" + symbolRoot2 + year;
                symbolList.push(symbolRoot + year + "|" + label + "|" + "1" + by + bd + "|" + "1" + year + ed);
                symbolList.push(symbolRoot2 + year + "|" + label + "|" + "1" + by + bd + "|" + "1" + year + ed);
            }
        });

    var ext = symbolList.join(",");
    getData(ext);
}

function buildContinuousContractsURL() {
    var symbolRoot = document.getElementById("selCommodity").value;
    var symbolList = [];

    var bd = "0101";
    var ed = "1231";

    var interval = "Weekly";
    symbolList.push(interval);

    d3.select("#divYears").selectAll("input")
        .each(function () {
            if (this.checked == true) {
                var year = this.value;
                var by = year;
                var label = symbolRoot + year;
                symbolList.push(symbolRoot + "|" + label + "|" + "1" + by + bd + "|" + "1" + year + ed);
            }
        });

    var ext = symbolList.join(",");

    getData(ext);
}


