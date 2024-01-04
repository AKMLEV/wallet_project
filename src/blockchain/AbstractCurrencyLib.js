const { Web3 } = require("web3");
const EthConverter = require("/src/helpers/EthConverter");
const Validator = require("/src/validators/blockchain/EthValidator");
const StaticValidator = require("/src/validators/Validator");
const PROVIDER_URL = process.env.ETH_PROVIDER_URL;
const staticValidator = new StaticValidator();
class AbstractCurrencyLib {
	constructor(app) {
		this.app = app;
		this.provider = new Web3(new Web3.providers.HttpProvider(PROVIDER_URL));
		this.validator = new Validator();
		this.converter = new EthConverter();
		staticValidator.validateObject(this.provider, "provider");
		staticValidator.validateObject(this.validator, "validator");
		staticValidator.validateObject(this.converter, "converter");
	}

	getBlockchainService() {
		return this.app.blockchainService;
	}
	getAddress() {
		return new Promise(async (resolve, reject) => {
			try {
				// let address = this.getBlockchainService().getAddress();
				// return resolve(false);
				throw "getAddress not implemented";
			} catch (e) {
				return reject(e);
			}
		});
	}
	getPrivateKey() {
		return new Promise(async (resolve, reject) => {
			try {
				// let privKey = this.getBlockchainService().getPrivateKey();
				throw "getPrivKey not implemented";
				// return resolve(false);
			} catch (e) {
				return reject(e);
			}
		});
	}

	getCurrentBalance() {
		return new Promise(async (resolve, reject) => {
			try {
				const address = await this.getAddress();
				const balance = await this.getBalance(address);
				return resolve(balance);
			} catch (e) {
				return reject(e);
			}
		});
	}
	getBalance(address) {
		return new Promise(async (resolve, reject) => {
			try {
				throw "getBalance() not implemented";
			} catch (e) {
				return reject(e);
			}
		});
	}

	sendCurrency(to, amount) {
		return new Promise(async (resolve, reject) => {
			try {
				throw "sendCurrency() not implemented";
			} catch (e) {
				return reject(e);
			}
		});
	}

	toDecimals(amount) {
		return this.converter.toDecimals(amount);
	}
	fromDecimals(amount) {
		return this.converter.fromDecimals(amount);
	}
}

module.exports = AbstractCurrencyLib;
