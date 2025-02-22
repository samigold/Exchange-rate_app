const currencyEl_one = document.getElementById('currency-one');
const amountEl_one = document.getElementById('amount-one');
const currencyEl_two = document.getElementById('currency-two');
const amountEl_two = document.getElementById('amount-two');

const rateEl = document.getElementById('rate');
const swap = document.getElementById('swap');

const tradingview = document.getElementById('tradingview');


//Fetch Exchange rates and update the DOM
function calculate() {

    
    const currency_one = currencyEl_one.value;
    const currency_two = currencyEl_two.value;

    // fetch(`https://v6.exchangerate-api.com/v6/b607b88a60a27ea3d34991d7/latest/${currency_one}`)
    // .then(result => result.json())
    // .then(data => {
    //     //console.log(data);
    //     if (!data.conversion_rates || !data.conversion_rates[currency_two]){
    //         throw new Error(`Exchange rate not found for ${currency_two}`)
    //     }
    //     const rate = data.conversion_rates[currency_two];
    //     //console.log(rate);

    //     rateEl.innerText = navigator.onLine 
    //     ? `1 ${currency_one} = ${rate}` 
    //     : 'You are offline';
        

    //     amountEl_two.value = (amountEl_one.value * rate).toFixed(2);
    // })

    if (navigator.onLine){
        fetch(`https://v6.exchangerate-api.com/v6/b607b88a60a27ea3d34991d7/latest/${currency_one}`)
        .then(result => result.json())
        .then(data => {
            const rate = data.conversion_rates[currency_two];
            rateEl.innerText = `1 ${currency_one} = ${rate} ${currency_two}`;
            amountEl_two.value = (amountEl_one.value * rate).toFixed(2)
        })
        .catch(error =>{
            console.error('Error fetching exchange rate:', error);
            rateEl.innerText = 'Error fetching exchange rate';
        });

    } else {
        rateEl.innerText = 'You are offline';
        rateEl.style.color = 'red';
    }
}

//function that handle going offline
function handleOffline() {
    rateEl.innerText = 'You are offline';
    rateEl.style.color = 'red';
}

// Function to handle coming back online
function handleOnline() {
    setTimeout(() => {
        rateEl.innerText = 'Online';
    }, 100);
    rateEl.style.color = 'green';
    calculate();  // Recalculate and fetch rates when back online
  }

  function userCountry() {
    fetch('https://ipapi.co/json/')
    .then(result => result.json())
    .then(data => {
        const userCountryCurrency = data.currency;
        currencyEl_two.value = userCountryCurrency;
        loadTradingViewWidget(currencyEl_two.value);
        calculate();
    })
  }

  function loadTradingViewWidget(currency) {
    const tradingview = document.getElementById("tradingview"); // Ensure this element exists
    tradingview.innerHTML = `
        <div class="tradingview-widget-container">
            <div class="tradingview-widget-container__widget"></div>
            <div class="tradingview-widget-copyright">
                <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
                    <span class="blue-text">Track all markets on TradingView</span>
                </a>
            </div>
        </div>
    `;

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-single-quote.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
        "symbol": `FX:${currency}USD`,
        "width": "100%",
        "isTransparent": false,
        "colorTheme": "dark",
        "locale": "en"
    });

    tradingview.querySelector(".tradingview-widget-container").appendChild(script);
}


//Event listeners for network Changes
window.addEventListener('offline', handleOffline);
window.addEventListener('online', handleOnline);

//Event Listeners
currencyEl_one.addEventListener('change', calculate);
amountEl_one.addEventListener('input', calculate);
currencyEl_two.addEventListener('change', calculate);
amountEl_two.addEventListener('input', calculate);
// Call this function whenever the currency changes
currencyEl_two.addEventListener('change', () => {
    loadTradingViewWidget(currencyEl_two.value);
});


swap.addEventListener('click', () => {
    const temp = currencyEl_one.value;
    currencyEl_one.value = currencyEl_two.value;
    currencyEl_two.value = temp;
    calculate();
})


// Initial load
userCountry();
calculate();