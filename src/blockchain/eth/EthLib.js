const PROVIDER_URL = process.env.ETH_PROVIDER_URL;
const PRIVATE_KEY = process.env.ETH_PRIVATE_KEY;

// const PROVIDER_URL = process.env.ETH_PROVIDER_URL;

const GWEI = 10 ** 9;
const GAS_PRICE = 20 * GWEI;

const GAS_LIMIT = 21000;
const Transaction = require("ethereumjs-tx");

const Web3 = require("web3");
const EthConverter = require("/src/helpers/EthConverter");
const Validator = require("/src/validators/blockchain/EthValidator");

const AbstractCurrencyLib = require("/src/blockchain/AbstractCurrencyLib");
class EthLib extends AbstractCurrencyLib {
	constructor(app) {
		const provider = new Web3(new Web3.providers.HttpProvider(PROVIDER_URL));
		const validator = new Validator();
		const converter = new EthConverter();
		super(app, provider, validator, converter);
	}

	_getChainId() {
		return 11155111;
	}

	getAddress() {
		return new Promise(async (resolve, reject) => {
			try {
				// let address = DEFAULT_ADDRESS;
				// return resolve(address);
				const privKey = await this.getPrivateKey();
				const address =
					this.provider.eth.accounts.privateKeyToAccount(privKey).address;

				return resolve(address);
			} catch (e) {
				return reject(e);
			}
		});
	}

	getBalance(address) {
		return new Promise(async (resolve, reject) => {
			try {
				this.validator.validateAddress(address);
				let balance = await this.provider.eth.getBalance(address);
				balance = this.toDecimals(balance);
				return resolve(balance);
			} catch (e) {
				return reject(e);
			}
		});
	}

	getPrivateKey() {
		return new Promise(async (resolve, reject) => {
			try {
				return resolve(PRIVATE_KEY);
			} catch (e) {
				return reject(e);
			}
		});
	}

	sendCurrency(to, amount) {
		return new Promise(async (resolve, reject) => {
			try {
				this.validator.validateAddress(to, "Tx Receiver");
				this.validator.validateNumber(amount, "sendCurrency amount");
				const txData = await this._formatTransactionParams(to, amount);
				const hash = await this._makeTransaction(txData);
				return resolve(hash);
			} catch (e) {
				return reject(e);
			}
		});
	}

	_formatTransactionParams(to, value, data = "0x") {
		return new Promise(async (resolve, reject) => {
			try {
				this.validator.validateAddress(to);
				this.validator.validateNumber(value);
				this.validator.validateString(data);
				const privateKey = await this.getPrivateKey();
				this.validator.validateString(privateKey);
				// console.log(privateKey);
				const privKeyBuffer = Buffer.from(privateKey, "hex");
				// console.log(privKeyBuffer);

				const from = await this.getAddress();

				const nonce = await this.getNextNonce();
				this.validator.validateAddress(from);
				this.validator.validateNumber(nonce);

				const gasPrice = this.getGasPrice();
				//this.validator.validateNumber(gasPrice);

				const gasLimit = this.getGasLimit();
				//this.validator.validateNumber(gasLimit);

				value = this.converter.fromDecimals(value);
				const chainId = this._getChainId();
				//this.validator.validateNumber(chainId);
				const txParams = {
					from: from,
					to: to,
					privateKey: privKeyBuffer,
					value: this.provider.utils.numberToHex(value),
					gasPrice: this.provider.utils.numberToHex(gasPrice),
					gasLimit: gasLimit,
					nonce: nonce,
					data: data,
					chainId: chainId,
				};
				console.log("txParams", txParams);
				return resolve(txParams);
			} catch (e) {
				return reject(e);
			}
		});
	}

	getGasPrice() {
		return GAS_PRICE;
	}

	getGasLimit() {
		return GAS_LIMIT;
	}
	getNextNonce() {
		return new Promise(async (resolve, reject) => {
			try {
				const address = await this.getAddress();
				const nonce = await this.provider.eth.getTransactionCount(address);
				return resolve(nonce);
			} catch (e) {
				return reject(e);
			}
		});
	}
	_makeTransaction(txParams) {
		return new Promise(async (resolve, reject) => {
			try {
				console.log("making Transaction");
				const tx = new Transaction(txParams, {
					chain: "sepolia",
					chainId: "11155111",
				});
				console.log(tx);
				console.log("signing tx");
				tx.sign(txParams.privateKey);
				console.log("tx signed");
				const raw = `0x${tx.serialize().toString("hex")}`;
				console.log("tx serialized");
				this.provider.eth
					.sendSignedTransaction(raw)
					.on("receipt", (data) => {
						console.log(data);
						const transactionHash = data.transactionHash;
						return resolve(transactionHash);
					})
					.on("error", (e) => {
						console.error(e);
						return reject(e);
					});
			} catch (e) {
				return reject(e);
			}
		});
	}
}
module.exports = EthLib;
