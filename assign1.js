let lat = 0;
let long = 0;

document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('#page2').style.display = "none";
    let map = document.querySelector('#companyMap #map');
    console.log(map.style);
    map.style.display = "none";
   // document.querySelector("#loadingAnimation2").style.display ="none";
    //setting timeout
    let credits = document.querySelector('#Credits #information');
    

    //check Local Storage
    let fetchedList = retrieveStorage();
    function retrieveStorage() {
        return JSON.parse(localStorage.getItem('companies'))
        || [];
    }
    function updateStorage() {
        localStorage.setItem('companies',
        JSON.stringify(fetchedList));
    }


    
    if (fetchedList.length == 0) {
        //fetch API;
        document.querySelector("#loadingAnimation").style.display ="block";
        let mainAPI = 'https://www.randyconnolly.com/funwebdev/3rd/api/stocks/companies.php';
        fetch(mainAPI)
        .then( response => response.json())
        .then( data => {
        fetchedList = data;
        
        document.querySelector("#aboutCompany").style.display ="block";
        document.querySelector("#loadingAnimation").style.display ="none";
        populateList(data)})
        .catch( error => console.error(error));
        updateStorage();  
    }else {
        console.log("This list already exists" + fetchedList)
    }
    
let input = document.querySelector('#companiesList #filter'); 
    input.addEventListener('change', e => {
        let filteredList = [];
        let keyword = e.target.value.toLowerCase();
            const filtered = fetchedList.filter( c => {
                let companySymbol = c.symbol.toLowerCase()  
                let found = companySymbol.includes(keyword);
                if (found) {
                    filteredList.push(c);
                } 
            });
            console.log(filteredList);
            populateList(filteredList);
        });
    let clear = document.querySelector('#companiesList #clear')
    clear.addEventListener('click', ()=>{
        populateList(fetchedList);
        let companyInfo = document.querySelector('#aboutCompany #companyInformation');
        companyInfo.innerHTML = '';
        map.style.display = "none";
        let tableElement = document.querySelector('#stockData #StockTable');
        tableElement.innerHTML = ''; 
        document.querySelector('#StockAverage #average').innerHTML = '';
            document.querySelector('#StockAverage #min').innerHTML = '';
            document.querySelector('#StockAverage #max').innerHTML = '';
    })

    function populateList(companies) {
        companies = companies.sort()
        let listElement = document.querySelector('#companiesList #companyNames');
        listElement.innerHTML = '';
        console.log(companies);
        for (let c of companies) {
            let item = document.createElement('li')
            item.textContent = c.symbol + ", "+c.name;
            listElement.appendChild(item);
        }
        addEventListeners();
    }

    function addEventListeners() {
       let companiesList = document.querySelectorAll('#companiesList #companyNames li');
       console.log(companiesList);
        companiesList.forEach(company => {
        company.addEventListener('click', e => {
            console.log(company);
            showInformation(company, e);
        })
    }) 
    }

    function showInformation(company, e) {
        let companyInfo = document.querySelector('#aboutCompany #companyInformation');
        //console.log(e.target.textContent);
        console.log(fetchedList);
        for (let company of fetchedList) {
           
            if ((company.symbol + ", " + company.name) == e.target.textContent) {
                console.log(company);
                console.log(companyInfo);
                let name = document.createElement('p');
                name.textContent = "Name: " + company.name;
                let symbol = document.createElement('p');
                symbol.textContent = "Symbol: " + company.symbol;
                let sector = document.createElement('p');
                sector.textContent = "Sector: "+company.sector;
                let industry = document.createElement('p');
                industry.textContent = "Industry: "+company.subindustry;
                let address = document.createElement('p');
                address.textContent = "Address: "+company.address;
                //let website = document.createElement('').url = company.address
                let exchange = document.createElement('p');
                exchange.textContent = "Exchange: "  +company.exchange;
                exchange.setAttribute('id', 'companyP');
                let description = document.createElement('p');
                description.textContent = "Company Description: "+company.description;
                description.setAttribute('id', 'companyDescription');
                let logo = document.createElement('img');
                logo.src = "logos/" + company.symbol + ".svg";
                logo.style.width = "100px";
                logo.style.height = "50px";

                
                companyInfo.innerHTML = '';
                companyInfo.appendChild(logo);
                companyInfo.appendChild(name);
                companyInfo.appendChild(symbol);
                companyInfo.appendChild(sector);
                companyInfo.appendChild(industry);
                companyInfo.appendChild(address);
                companyInfo.appendChild(exchange);
                companyInfo.appendChild(description);

                //let lat and long
                lat = company.latitude;
                console.log("lat " + lat);
                long = company.longitude;
                console.log("long " + long);
                map.style.display = "block";
                initMap();
            //fetch for stock data
             let stockUrl = "https://www.randyconnolly.com/funwebdev/3rd/api/stocks/history.php?symbol=" + company.symbol;
            console.log(stockUrl);
            stockHandler(stockUrl); 
            } else {
                continue
            }
        }
        
           
    }
    let stocks = []
    let lastAccessesdStock = stocks;
    function stockHandler(url) {
        
        console.log("im here");
        fetch(url)
        .then (response => response.json())
        .then (data => {
            console.log("im here too");
            data.forEach(s => stocks.push(s));
            lastAccessesdStock = stocks;
            document.querySelector('#StockAverage #average').innerHTML = '';
            document.querySelector('#StockAverage #min').innerHTML = '';
            document.querySelector('#StockAverage #max').innerHTML = '';
            populateTable();

        });
        
    }

    function populateTable () {
        let tableElement = document.querySelector('#stockData #StockTable');
        tableElement.innerHTML = ''; 
        let dateHead = document.createElement('th')
        dateHead.textContent = "Date";
        tableElement.appendChild(dateHead);

        let openHead = document.createElement('th')
        openHead.textContent = "Open";
        tableElement.appendChild(openHead);

        let closeHead = document.createElement('th')
        closeHead.textContent = "Close";
        tableElement.appendChild(closeHead);

        let lowHead = document.createElement('th')
        lowHead.textContent = "Low";
        tableElement.appendChild(lowHead);

        let highHead = document.createElement('th')
        highHead.textContent = "High";
        tableElement.appendChild(highHead);
        
        let volHead = document.createElement('th')
        volHead.textContent = "Volume";
        tableElement.appendChild(volHead);
        for (let stock of stocks) {



            
            let date= document.createElement('td')
            date.textContent = stock.date;
            let open = document.createElement('td');
            open.textContent = stock.open;
            let close = document.createElement('td');
            close.textContent = stock.open 
            let low = document.createElement('td');
            low.textContent = stock.low;
            let high = document.createElement('td');
            high.textContent = stock.high
            let volume = document.createElement('td');
            volume.textContent = stock.volume;

            

            let row = document.createElement('tr');


            row.appendChild(date);
            row.appendChild(open);
            row.appendChild(close);
            row.appendChild(low);
            row.appendChild(high);
            row.appendChild(volume);

            tableElement.appendChild(row);
            
            
        }
        averageCalculator(stocks);
        minmaxCalculator(stocks);
        stocks = [];
    }

    function averageCalculator(stock) {
        let avg = document.createElement('th');
        avg.textContent = "Average";
        // let min = document.createElement('th');
        // let max = document.createElement('th');

        document.querySelector('#StockAverage #average').appendChild(avg);

        let averageElement  = document.querySelector('#StockAverage #average');
        let openAvg = 0;
        let closeAvg = 0;
        let lowAvg = 0;
        let highAvg = 0;
        let volumeAvg = 0
        stock.forEach(n => {
            openAvg += Number(n.open);
            closeAvg += Number(n.close);
            lowAvg += Number(n.low);
            highAvg += Number(n.high);
            volumeAvg += Number(n.volume);
        })
        let open = document.createElement('td');
        open.textContent = openAvg / stock.length;
        let close = document.createElement('td');
        close.textContent = closeAvg / stock.length;
        let low = document.createElement('td');
        low.textContent = lowAvg / stock.length;
        let high = document.createElement('td');
        high.textContent = highAvg / stock.length;
        let volume = document.createElement('td');
        volume.textContent = volumeAvg / stock.length;

        averageElement.appendChild(open);
        averageElement.appendChild(close);
        averageElement.appendChild(low);
        averageElement.appendChild(high);
        averageElement.appendChild(volume);
    }

    function minmaxCalculator(stock) {
        let min = document.createElement('th');
        min.textContent = "Minmum";
        let max = document.createElement('th');
        max.textContent = "Maximum";
        document.querySelector('#StockAverage #min').appendChild(min);
        document.querySelector('#StockAverage #max').appendChild(max);
        let openmin = [];
        let closemin = [];
        let lowmin = [];
        let highmin = [];
        let volumemin = [];

        stock.forEach(n => {
            openmin.push(Number(n.open))
            openmin.sort(function(a,b){return a -b});
            closemin.push(Number(n.close))
            closemin.sort(function(a,b){return a -b});
            lowmin.push(Number(n.low))
            lowmin.sort(function(a,b){return a -b});
            highmin.push(Number(n.high))
            highmin.sort(function(a,b){return a -b});
            volumemin.push(Number(n.volume))
            volumemin.sort(function(a,b){return a -b});
        })
        let open = document.createElement('td');
        open.textContent = openmin[0];
        let close = document.createElement('td');
        close.textContent = closemin[0];
        let low = document.createElement('td');
        low.textContent = lowmin[0];
        let high = document.createElement('td');
        high.textContent = highmin[0];
        let volume = document.createElement('td');
        volume.textContent = volumemin[0];
        
        let minElment  = document.querySelector('#StockAverage #min');
        minElment.appendChild(open);
        minElment.appendChild(close);
        minElment.appendChild(low);
        minElment.appendChild(high);
        minElment.appendChild(volume); 
        
        //
        let openmax = document.createElement('td');
        openmax.textContent = openmin[openmin.length -1];
        let closemax = document.createElement('td');
        closemax.textContent = closemin[lowmin.length -1];
        let lowmax = document.createElement('td');
        lowmax.textContent = lowmin[lowmin.length -1];
        let highmax = document.createElement('td');
        highmax.textContent = highmin[highmin.length -1];
        let volumemax = document.createElement('td');
        volumemax.textContent = volumemin[volumemin.length -1];
        
        let maxElment  = document.querySelector('#StockAverage #max');
        maxElment.appendChild(openmax);
        maxElment.appendChild(closemax);
        maxElment.appendChild(lowmax);
        maxElment.appendChild(highmax);
        maxElment.appendChild(volumemax);

    }
    
    document.querySelector('#stockData #viewcharts').addEventListener('click', () => {
        document.querySelector('#mainContent').style.display = "none";
        document.querySelector('#page2').style.display = "grid";
        page2handler(lastAccessesdStock, fetchedList);
    });

    let currentCompany;
    function page2handler (stocks, fetchedList) {
        
        currentCompany = fetchedList.find(({symbol}) => symbol === stocks[0].symbol);
        document.querySelector('#page2 #nameSymbol label').textContent = currentCompany.symbol +", "+ currentCompany.name;
        document.querySelector('#page2 #nameSymbol #description').textContent = currentCompany.description;
        
        financialHandler();
    }

    document.querySelector('#page2 #nameSymbol #closePage2').addEventListener('click', () => {
        document.querySelector('#mainContent').style.display = "grid";
        document.querySelector('#page2').style.display = "none";
    })

    //This code was used from lab 10 
    document.querySelector('#speak').addEventListener('click',
    (e) => {
    const utterance = new SpeechSynthesisUtterance
    (currentCompany.description);
    speechSynthesis.speak(utterance);
    });
     
    function financialHandler() {
        let missingInfo = document.querySelector('#financialMissing');
        missingInfo.style.display = "none";
        let table = document.querySelector('#financials #financialTable');
        table.style.display = "table";
        table.style.width = "100%";
        table.style.height = "90%";
        if (currentCompany.financials == null) {
            document.querySelector('#financials #financialTable').style.display = "none";
            missingInfo.style.display = "block"
        } else {
            console.log(currentCompany.financials);
            let info2017 = ["2017"];
            let info2018 = ["2018"];
            let info2019 = ["2018"];
            
            info2017.push(currentCompany.financials.revenue[2]);
            info2017.push(currentCompany.financials.earnings[2]);
            info2017.push(currentCompany.financials.assets[2]);
            info2017.push(currentCompany.financials.liabilities[2]);

            info2018.push(currentCompany.financials.revenue[1]);
            info2018.push(currentCompany.financials.earnings[1]);
            info2018.push(currentCompany.financials.assets[1]);
            info2018.push(currentCompany.financials.liabilities[1]);

            info2019.push(currentCompany.financials.revenue[0]);
            info2019.push(currentCompany.financials.earnings[0]);
            info2019.push(currentCompany.financials.assets[0]);
            info2019.push(currentCompany.financials.liabilities[0]);
            
            populateFinancialTable(info2017, "#year1");
           populateFinancialTable(info2018, "#year2");
           populateFinancialTable(info2019, "#year3");
        }        
    }

    //Currency Format found from  https://www.samanthaming.com/tidbits/30-how-to-format-currency-in-es6/
    function populateFinancialTable(yearArray, year) {
        let tableElement = document.querySelector('#page2 #financials #financialTable #years ' + year);
        tableElement.innerHTML = '';
        console.log(tableElement);
        let head = document.createElement('th');
        head.textContent = yearArray[0];
        tableElement.appendChild(head)
        yearArray.shift();
        yearArray.forEach(num => {
            let number = document.createElement('td');
            number.setAttribute('id', 'added')
            number.textContent = new Intl.NumberFormat('en-US',
            { style: 'currency', currency: 'USD' }
          ).format(num);
          tableElement.appendChild(number);
        })
        
    }

});
//This code is used from lab 10 in order to get the map to work 
var map;
        function initMap() {
            
            console.log("IN FUCNTION");
            console.log("lat in map " + lat);
            console.log("long in map " + long);
            map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: lat, lng: long},
            zoom: 18
        });
        } 
