const myForm = document.getElementById("weatherform");

myForm.addEventListener('submit', event => {
    event.preventDefault();
    const textDisplay = document.getElementById("demo");
    let city = getData();
    
    if (!city) {
        textDisplay.innerText = "LOCATION CANNOT BE EMPTY";
        setTimeout(() => {textDisplay.innerText = "";}, 2000);
    }
    else {
        let weatherurl = "https://wttr.in/"+ city +"?format=j1";
        fetchweather(weatherurl, city);
    }
});


function getData() {
    const inputElement = document.getElementById("city");
    const userData = inputElement.value;
    const capitalized = userData.charAt(0).toUpperCase() + userData.slice(1);
   return capitalized;
}

async function fetchweather(weatherurl, cityname) {
    const textDisplay = document.getElementById("demo");
    const icon = document.getElementById("icon");

    try{
        console.log("Step 1: Fetching Weather...")
        const weatherRes = await fetch(weatherurl);
        const weather = await weatherRes.json();

        const LatLon = weather.data.request[0].query;
        const rm = LatLon.match(/-?\d+\.?\d*/g);
        const [Lat, Lon] = rm;
        
        console.log("Step 2: Fetching Time...")
        const TimeRes = await fetch(`https://timeapi.io/api/timezone/coordinate?latitude=${Lat}&longitude=${Lon}`)
        const Time = await TimeRes.json();
        
        let clock = Time.currentLocalTime.slice(11, 16);
        let date = Time.currentLocalTime.slice(0, 10);


        console.log("Step 3: Updating Data...")
        textDisplay.innerText = 
        `Locaton: ${cityname}

        TimeZone: ${Time.timeZone}
        Date: ${date}
        Clock: ${clock}
                                
        Celsius: ${weather.data.current_condition[0].temp_C}°C
        Farenheit: ${weather.data.current_condition[0].temp_F}°F;
                                
        Weather Condition: ${weather.data.current_condition[0].weatherDesc[0].value}`;
        
        icon.src = weather.data.current_condition[0].weatherIconUrl[0].value;
        setTimeout(() => {
            icon.src = "";
        }, 5000); 
        console.log("Step 4: Completed...")                     
    }
    catch(error) {
        console.log("DEBUG ERROR:", error);
        textDisplay.innerText = "Location Not Found or API ERROR";
        setTimeout(() => {textDisplay.innerText = "";}, 2000);
    }
}
