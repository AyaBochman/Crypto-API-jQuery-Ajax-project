
const clearPage = (router)=>{
    switch (router) {
        case "graphs":
        DOM.coinDisplay.remove();
        DOM.aboutDisplay.remove();
        DOM.searchDisplay.remove();
        DOM.tempDisplay.style.display = "block";
        DOM.graphDisplay.style.display = "block";
        DOM.tempDisplay.appendChild(DOM.graphDisplay)
            break;
        
        case "about":
        clearInterval(interval)
        DOM.searchDisplay.remove();
        DOM.coinDisplay.remove();
        DOM.graphDisplay.remove();
        DOM.tempDisplay.style.display = "block";
        DOM.aboutDisplay.style.display = "block"
         DOM.tempDisplay.appendChild(DOM.aboutDisplay)
        break;

    }
   
}