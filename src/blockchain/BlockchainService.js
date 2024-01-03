//відповідає за отримання балансу, адреси та надсилання транзакцій
const EthLib = require("./eth/EthLib");
const ETH = "ETH";
class BlockchainService{
    constructor(app){
        this.app = app;
        let eth = new EthLib(app);
        this.currencyLibraries = {
            ETH:eth,
        }
    }

    getCurrencyLibrary(){
        let currentCurrency = this.app.getCurrency();
        return this.currencyLibraries[currentCurrency];
    }

    getCurrentBalance() {
        return new Promise(async(resolve,reject)=>{
            try{
                let balance = await this.getCurrencyLibrary().getCurrentBalance();
                return resolve(balance);           
            }catch (e){
                return reject(e);
            }
        })
    }

    getAddress() {
        return new Promise(async(resolve,reject)=>{
            try{
                let address = await this.getCurrencyLibrary().getAddress();
                console.log("CurrencyLibrary.getAddress",address);
                return resolve(address);
            }catch (e){
                return reject(e);
            }
        })
    }

    sendCurrency(receiver,amount) {
        return new Promise(async(resolve,reject)=>{
            try{
                let result = await this.getCurrencyLibrary().sendCurrency(receiver,amount);

                return resolve(result);
            }catch (e){
                return reject(e);
            }
        })
    }
}

module.exports = BlockchainService;
