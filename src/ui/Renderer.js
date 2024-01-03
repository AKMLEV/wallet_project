//відповідає за рендер елементів в додатку

class Renderer {
	constructor(app) {
		this.app = app;
	}

	renderUI() {
		this.renderCurrency();
		this.renderBalance();
		this.renderAddress();
	}
	renderCurrency() {
		const currency = this.app.getCurrency();
		const elements = document.getElementsByClassName("currency_symbol");
		for (let i = 0; i < elements.length; i++) {
			const element = elements[i];
			element.innerHTML = currency;
		}
	}

	renderBalance() {
		this.app.getCurrentBalance().then((balance) => {
			const element = document.getElementById("balance");
			element.innerHTML = balance;
		});
	}

	renderAddress() {
		this.app.getAddress().then((address) => {
			console.log("Renderer.renderAddress", address);
			const element = document.getElementById("address");
			element.innerHTML = address;
		});
	}
}

module.exports = Renderer;
