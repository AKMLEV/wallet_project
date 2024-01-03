//відповідає за реагування на кліки користувача

class ListenerManager{
    constructor(app){
        this.app = app;
    }
     setListeners(){
        this.setChangeCurrencyListener();
        this.setSendCurrencyListener();
    }

     setChangeCurrencyListener(){
        let elements = document.getElementsByClassName("currency_container")
        for (let i = 0; i<elements.length; i++){
            let element = elements[i];
            element.addEventListener("click", (event)=>{
                let element = event.target.parentNode;
                let currency =element.getAttribute("data-value");
                this.app.changeCurrency(currency);
            });
        }
    }

     setSendCurrencyListener(){
        document.getElementById("send_button").addEventListener("click", async (event)=>{
            let _address = document.getElementById("transfer_address").value;
            let _amount = document.getElementById("transfer_amount").value;
            try{
                let result = await this.app.sendCurrency(_address,_amount);
                alert(result);
            }catch (e){
                alert(e.message);
            }
            
        })
    }
}

module.exports = ListenerManager;


// let currency = this.app.getCurrency();
