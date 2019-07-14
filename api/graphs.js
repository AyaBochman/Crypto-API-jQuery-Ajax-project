
//brings the data
const getUSD = () => {
    let coinCodes = Object.keys(charts);
    return new Promise((resolve, reject) => {
        $.ajax({
            method: HTTP_METHOD.GET,
            url: config.coin_convert + coinCodes + "&tsyms=USD",
            success: function (response) {
            
                resolve(response);

            },
            error: function (error) {
                reject(error);
            }
        })

    })
}


const generateGraph = async () => {
   
    try {
        let data = await getUSD();

        drawGraphs(data);
        console.log("the async done");

    }
    catch (error) {
        console.log(error);
    }
}


const drawGraphs = (data) => {
 
    let currTime = getTime();

    let lines = [];

    //data
    // {AUR: {USD: 0.07107},LTC: {USD: 31.39}}
    for (key in data) {
        let theUsd = data[key].USD;
        charts[key].update(currTime, theUsd);
        lines.push(charts[key].chartData);

    }

    var options = {
        exportEnabled: true,
        animationEnabled: false,
        backgroundColor: "#000000",
        title: {
            text: Object.keys(charts) + " to USD",
            fontColor: "#00754a",
            fontSize: 40,
        },
        subtitles: [{
            text: "Click Legend to Hide or Unhide Data Series"
        }],
        axisX: {
            title: "Time",
            titleFontColor: "#28cc9e",
            labelFontColor: "#00754a"
        },
        axisY: {
            title: "Coin Value",
            titleFontColor: "#28cc9e",
            lineColor: "#4F81BC",
            labelFontColor: "#00754a",
            tickColor: "#4F81BC",
            includeZero: false
        },

        toolTip: {
            shared: true
        },
        legend: {
            cursor: "pointer",
            itemclick: toggleDataSeries,
            fontColor: "#28cc9e",
        },
        data: lines
    };
   
    $("#chartContainer").CanvasJSChart(options);

    function toggleDataSeries(e) {
        if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
        } else {
            e.dataSeries.visible = true;
        }
        e.chart.render();
    }

}


const getTime = () => {
    let currTime;
    let date = new Date;
    currTime = date;
    return currTime;
}

let interval;


$("#graphs").on('click', (e) => {
 
    router = e.target.id;
    clearPage(router);

    interval = setInterval( ()=> {

        generateGraph();
    },3000)

    if(Object.getOwnPropertyNames(charts).length !== 0){
       
        generateGraph();
      
    }else{
    
        DOM.graphDisplay.innerHTML = "<span class='gError'><i class='fas fa-exclamation-circle'></i> Sorry, No reports to show</span>";
    }
    

})


