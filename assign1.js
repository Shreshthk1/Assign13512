document.addEventListener('DOMContentLoaded', function() {

    //check Local Storage
    let schemeCollection = retrieveStorage();
    let companies = schemeCollection;
    function retrieveStorage() {
        return JSON.parse(localStorage.getItem('schemes'))
        || [];
    }

    if (schemeCollection.length == 0) {
        //fetch API;
        document.querySelector("#aboutCompany").style.display = "none";
        document.querySelector("#loadingAnimation").style.display ="block";
        let test = 'https://www.randyconnolly.com/funwebdev/3rd/api/stocks/companies.php';
        fetch(test)
        .then( response => response.json())
        .then( data => {
        document.querySelector("#aboutCompany").style.display ="block";
        document.querySelector("#loadingAnimation").style.display ="none";
        schemeCollection = data;
        console.dir(data);
        })
        .catch( error => console.error(error));
        updateStorage();  
    }else {
        companies = schemeCollection;
    }

    console.log(companies);

    function updateStorage() {
        localStorage.setItem('schemes',
        JSON.stringify(schemeCollection));
    }



    
    

    
});