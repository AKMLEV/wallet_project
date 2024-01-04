const PRIVATE_KEY = process.env.ETH_PRIVATE_KEY;

// const PROVIDER_URL = process.env.ETH_PROVIDER_URL;

// const GWEI = 10 ** 9;
// const GAS_PRICE = 20 * GWEI;

const GAS_LIMIT = 21000;

const Transaction = require("ethereumjs-tx");

const AbstractCurrencyLib = require("/src/blockchain/AbstractCurrencyLib");
class EthLib extends AbstractCurrencyLib {
	_getChainId() {
		return 11155111;
	}

	async getAddress() {
		// let address = DEFAULT_ADDRESS;
		// return resolve(address);
		const privKey = await this.getPrivateKey();
		const address =
			this.provider.eth.accounts.privateKeyToAccount(privKey).address;
		return address;
	}

	async getBalance(address) {
		this.validator.validateAddress(address);
		const balance = await this.provider.eth.getBalance(address);
		return this.toDecimals(balance);
	}

	getPrivateKey() {
		return PRIVATE_KEY;
	}

	async sendCurrency(to, amount) {
		this.validator.validateAddress(to, "Tx Receiver");
		this.validator.validateNumber(amount, "sendCurrency amount");
		const txData = await this._formatTransactionParams(to, amount);
		const hash = await this._makeTransaction(txData);
		return hash;
	}

	async _formatTransactionParams(to, value, data = "0x") {
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
		// this.validator.validateNumber(nonce);

		const gasPrice = await this.getGasPrice();
		//this.validator.validateNumber(gasPrice);

		const gasLimit = await this.getGasLimit();
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
		return txParams;
	}

	async getGasPrice() {
		return this.provider.eth.getGasPrice();
	}

	async getGasLimit() {
		return GAS_LIMIT;
	}
	async getNextNonce() {
		const address = await this.getAddress();
		const nonce = await this.provider.eth.getTransactionCount(address);
		return nonce;
	}
	async _makeTransaction(txParams) {
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
		let hash;
		console.log("tx serialized");
		this.provider.eth
			.sendSignedTransaction(raw)
			.on("receipt", (data) => {
				console.log(data);
				hash = data.transactionHash;
			})
			.on("error", (e) => {
				console.error(e);
			});
		return hash;
	}
}
module.exports = EthLib;
