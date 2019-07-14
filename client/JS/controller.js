
const DOM = function () {
    return {
        mainDisplay: document.getElementById("main"),
        coinDisplay: document.getElementById("coinDisplay"),
        tempDisplay: document.getElementById("tempDisplay"),
        graphDisplay: document.getElementById("graphTemp"),
        aboutDisplay: document.getElementById("aboutTemp"),
        cbInputs: document.querySelectorAll(".checkbox"),
        searchDisplay: document.getElementById("sDiv")

    }
}();

document.body.className = 'fade';

const draw = (res) => {
    document.body.className = '';
    let result = res.slice(0, 12);
    result.forEach(coin => {

        let card = document.getElementsByName("template")[document.getElementsByName("template").length - 1].cloneNode(true);;
        card.style.display = "inline-block";
        card.id = coin.id;
        let cb = card.querySelector('input[type="checkbox"]');
        cb.value = coin.symbol;
        cb.addEventListener('click', (e) => {
            if (cb.checked == true) {
                charts[coin.symbol.toUpperCase()] = new Coin(coin.symbol, coin.id);
            } else {
                delete charts[coin.symbol.toUpperCase()]
            }
            if (Object.keys(charts).length == 6) {
               
                drawCBS(charts);

            }

        });

        card.querySelector("#coinCode").innerText = coin.symbol.toUpperCase();
        card.querySelector("#coinName").innerText = coin.name;
        card.querySelector("#collapser").attributes.getNamedItem("data-target").value = "#collapser" + card.id;
        card.querySelector("#collapseId").id = "collapser" + card.id;
        DOM.coinDisplay.appendChild(card);

    });

}


//CBS ON MODAL
const drawCBS = (charts) => {

    $('#myModal').modal({
        backdrop: 'static',
        keyboard: false
    });
  

    $(".modal-body").html("");
    for (key in charts) {

        let div = document.createElement("div");
        div.innerText = charts[key].id;
        div.classList.add("modal-div");
        let label = document.createElement("label");


        label.classList.add("switch1");
        let input = document.createElement("input");
        input.setAttribute("type", "checkbox");
        input.classList.add("inputcb");
        input.value = key;
        input.checked = true;

        let span = document.createElement("span");
        span.classList.add("slider");
        span.classList.add("round");
        label.appendChild(input);
        label.appendChild(span);
        div.appendChild(label);
        $(".modal-body").append(div);

    }

    let span = document.createElement("span");
    span.innerText = "";
    $(".modal-body").append(span);

    $("#save").on('click', () => {

        changeDOM();

        if ($(".inputcb:checked").length < 6) {
            $('#myModal').modal('hide');
        } else {
            span.innerText = "you must select only 5 coins";
        }

    })
    $("#close").on('click', () => {

        let check = $(".inputcb");
        check[check.length - 1].checked = false;

        changeDOM();

    })

}

const changeDOM = () => {
    let check = $(".inputcb");

    for (i = 0; i < check.length; i++) {

        if (check[i].checked == false) {

            delete charts[check[i].value];

        }
    }
    let DOMinp = document.querySelectorAll(".checkbox");
    for (i = 0; i < DOMinp.length; i++) {

        if (!(DOMinp[i].value.toUpperCase() in charts)) {
            DOMinp[i].checked = false;

        }

    }
}



//function on every collapse
let lastTime = 0;
const getInfo = (e) => {

    let collapser = e.target;
    isExpand = collapser.attributes.getNamedItem("aria-expanded").value;
 
    if (isExpand === "false") {

        let coinCard = e.target.parentElement.parentElement;

        if (Math.floor((new Date() - lastTime) / 60000) < 2) {
            if (coinCard.id in cache) {
                console.log("its already here");
                drawInfo(coinCard, cache[coinCard.id].info);
            } else {
                loadInfo(coinCard, coinCard.id);
            }
        }

        else {
            cache[coinCard.id] = "";
            lastTime = new Date();
            console.log("getting from api");
            loadInfo(coinCard, coinCard.id);
        }
    }
}

const drawInfo = (theCard, info) => {
    theCard.querySelector(".loader").style.display = "none";
    var containerResult = theCard.querySelector("#collapseResult");
    containerResult.innerHTML = "";

    let img = document.createElement("img");
    img.src = info.img;
    let usd = document.createElement("span");
    usd.innerText = "USD: " + info.usd.match(/^-?\d+(?:\.\d{0,2})?/)[0] + " $";
    let eur = document.createElement("span");
    eur.innerText = "EUR: " + info.eur.match(/^-?\d+(?:\.\d{0,2})?/)[0] + " €";
    let ils = document.createElement("span");
    ils.innerText = "ILS: " + info.ils.match(/^-?\d+(?:\.\d{0,2})?/)[0] + " ₪";
    containerResult.appendChild(img);
    containerResult.appendChild(usd);
    containerResult.appendChild(eur);
    containerResult.appendChild(ils);

}