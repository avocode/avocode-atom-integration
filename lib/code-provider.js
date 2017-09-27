

class BasicProvider {
	constructor(suggestions = []) {
		// offer suggestions when editing any file type
		this.selector = '.text.plain, .text.html, .source.css, .source.js';
    this.suggestions = suggestions
		this.suggestionPriority = 2
	}

  setSuggestions(suggestions = []) {
    this.suggestions = suggestions
  }

	getSuggestions(options) {
		const { prefix } = options;
		return this.findMatchingSuggestions(prefix);
	}

	findMatchingSuggestions(prefix) {
		// filter list of words to those with a matching prefix
		let matchingWords = this.suggestions.filter((suggestion) => {
			return suggestion.includes(prefix);
		});

		// convert the array of words into an array of objects with a text property
		let matchingSuggestions = matchingWords.map((word) => {
			return { text: word };
		});

		return matchingSuggestions;
	}
}

module.exports = BasicProvider
