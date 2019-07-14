const config = {
    coin_names: "https://api.coingecko.com/api/v3/coins/list",
    coin_info: "https://api.coingecko.com/api/v3/coins/",
    coin_convert: "https://min-api.cryptocompare.com/data/pricemulti?fsyms="

}

const HTTP_METHOD = {
    GET: "GET",
}


class Coin{
    constructor(code,id){
           this.code = code.toUpperCase(); //symbol BTC
           this.id = id; //id bitcoin
           this.info = {img:"",usd:"",eur:"",ils:""};
           this.chartData = {
               type: "spline", 
               name: this.code, 
               showInLegend: true,
               xValueFormatString: "HH:mm:ss",
               yValueFormatString: "$#,##0.#",
               dataPoints: []
        }
    }

    moreInfo(img,usd,eur,ils){
        this.info.img = img;
        this.info.usd = usd + "$";
        this.info.eur = eur + "€";
        this.info.ils = ils + "₪";
    }

    update(time, usd) {
        this.chartData.dataPoints.push({ x: time, y: usd });
        if (this.chartData.dataPoints > 7) {
            this.chartData.dataPoints.shift();
        }
    }

}


const getCoinNames = () => {
    $.ajax({
        method: HTTP_METHOD.GET,
        url: config.coin_names,
        success: (response) => {

            draw(response);
            
        }, error: (error) => {
            console.log(error)
        }
    })
}

getCoinNames();



let loadInfo = async (coinCard,coinName) => {
    try {
        coinCard.querySelector("#collapseResult").innerHTML = "";
        coinCard.querySelector(".loader").style.display = "inline-block";
        let theCoin = await getMoreInfo(coinName);
        
        drawInfo(coinCard,theCoin.info);
       
    }
    catch (error) {
        console.log(error);
    }
}


const getMoreInfo = (coin) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            method: HTTP_METHOD.GET,
            url: config.coin_info + coin,
            success: function (response) {
                let coin = new Coin(response.symbol,response.id);
                coin.moreInfo(response.image["small"],response.market_data.current_price.usd,
                response.market_data.current_price.eur, response.market_data.current_price.ils);
                cache[response.id] = coin;

                resolve(coin);
    
            },
            error: function (error) {
                reject(error)
            }
        })
    })
}


//search

$("#searchInp").on('keyup',()=>{
 
    let searchInp = $("#searchInp").val();
    if(searchInp == "" || searchInp.length < 3){
        $("#err").html( "")
        $(".card").css("display", "inline-block");
        $("#temp").css("display","none")
    }
    
    if(searchInp.length > 2){
        $("#err").html( "")
        if(searchInp.toUpperCase() in charts){
            let theCoin = charts[searchInp.toUpperCase()]
        
            setTimeout(()=>{
            
                $(".card").css("display", "none");
                $(`#${theCoin.id}`).css("display","inline-block")
            },500)
        
        
        }else {
            $(".card").css("display", "inline-block");
            $("#temp").css("display","none")

            setTimeout(()=>{
                $("#err").html( "sorry, there is no such coin")
            },500)
           
        }
    } 
   
})


//about

$("#about").on('click', (e) => {
    router = e.target.id;
    clearPage(router);


})