class CurrencyConverter {
	toDecimals(amount, decimals = 18, precision = 8) {
		console.log(typeof amount)
		return Number(amount) / (10 ** decimals).toFixed(precision);
	}

	fromDecimals(amount, decimals = 18, precision = 8) {
		console.log(typeof amount)
		amount = parseFloat(amount);
		return amount * (10 ** decimals).toFixed(precision);
	}
}

module.exports = CurrencyConverter;
