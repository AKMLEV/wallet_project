require("dotenv").config();
// require("dotenv-webpack").config();

const DEFAULT_CURRENCY = "ETH";

const Renderer = require("./ui/Renderer");
console.log(Renderer);

const ListenerManager = require("./ui/ListenerManager");
const WalletUI = require("./ui/WalletUI");
const BlockchainService = require("./blockchain/BlockchainService");

class Application {
	constructor() {
		console.log("Application is being constructed");
		this.currency = DEFAULT_CURRENCY;
		const renderer = new Renderer(this);
		const listenerManager = new ListenerManager(this);
		const walletUi = new WalletUI(this, listenerManager, renderer);
		this.walletUi = walletUi;
		const blockchainService = new BlockchainService(this);
		this.blockchainService = blockchainService;
		console.log("Application is ready");
	}

	setWalletUI(walletUi) {
		this.walletUi = walletUi;
	}

	getWalletUi() {
		return this.walletUi;
	}

	prepareUI() {
		this.walletUi.prepareUI();
	}

	getCurrency() {
		return this.currency;
	}

	changeCurrency(currency) {
		this.setCurrency(currency);
		this.getWalletUi().renderUI();
	}

	setCurrency(currency) {
		this.currency = currency;
	}

	async sendCurrency(receiver, amount) {
		return this.blockchainService.sendCurrency(receiver, amount);
	}

	async getAddress() {
		return this.blockchainService.getAddress();
	}

	async getCurrentBalance() {
		return this.blockchainService.getCurrentBalance();
	}
}

module.exports = Application;
