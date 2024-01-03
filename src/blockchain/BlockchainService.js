//відповідає за отримання балансу, адреси та надсилання транзакцій
const EthLib = require("./eth/EthLib");
const ETH = "ETH";
class BlockchainService {
	constructor(app) {
		this.app = app;
		const eth = new EthLib(app);
		this.currencyLibraries = {
			ETH: eth,
		};
	}

	getCurrencyLibrary() {
		const currentCurrency = this.app.getCurrency();
		return this.currencyLibraries[currentCurrency];
	}

	getCurrentBalance() {
		return new Promise(async (resolve, reject) => {
			try {
				const balance = await this.getCurrencyLibrary().getCurrentBalance();
				return resolve(balance);
			} catch (e) {
				return reject(e);
			}
		});
	}

	getAddress() {
		return new Promise(async (resolve, reject) => {
			try {
				const address = await this.getCurrencyLibrary().getAddress();
				console.log("CurrencyLibrary.getAddress", address);
				return resolve(address);
			} catch (e) {
				return reject(e);
			}
		});
	}

	sendCurrency(receiver, amount) {
		return new Promise(async (resolve, reject) => {
			try {
				const result = await this.getCurrencyLibrary().sendCurrency(
					receiver,
					amount,
				);

				return resolve(result);
			} catch (e) {
				return reject(e);
			}
		});
	}
}

module.exports = BlockchainService;
