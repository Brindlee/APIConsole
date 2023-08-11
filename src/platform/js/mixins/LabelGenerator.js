export default {
    methods: {
        /*geneateFieldLabel(name) {
        	if (name == undefined || name == null) {
        		return '';
        	} else {
        		if (this.isAllUpper(name)) {
        			name = name.toLowerCase();
        		}

        		let split = name.split(/(?<!^)(?=[A-Z])/);
        		let newWords = [];
        		for (let i = 0; i < split.length; i++) {
        			let word = split[i];
        			let newWord = word.replaceAll('_', ' ').trim(' ');
        			newWord = this.toTitleCase(newWord);
        			newWord = newWord.replace(/[^a-zA-Z ]/g, "");
        			let splits = newWord.split(/(?<!^)(?=[A-Z])/);
        			newWords.push(splits.join(' '));
        		}
        		return newWords.join(' ');
        	}
        },*/
        geneateFieldLabel(name) {
            if (name == undefined || name == null) {
                return '';
            } else {
                //eslint-disable-next-line
                let pattern = /(?!^)(?=[\/\|\[\],._-])/;
                let split = name.split(pattern);

                let newWords = [];
                for (let i = 0; i < split.length; i++) {
                    let newString = split[i].replace(/[^a-zA-Z ]/g, "");
                    if (this.isAllUpper(newString)) {
                        newString = newString.toLowerCase();
                    }
                    let innersplit = newString.split(/(?!^)(?=[A-Z])/);
                    for (let j = 0; j < innersplit.length; j++) {
                        let word = innersplit[j];
                        let newWord = word.replaceAll('_', ' ').trim(' ');
                        newWord = this.toTitleCase(newWord);
                        let splits = newWord.split(/(?!^)(?=[A-Z])/);
                        newWords.push(splits.join(' '));
                    }
                }
                return newWords.join(' ');
            }
        },
        isAllUpper(input) {
            for (let i = 0; i < input.length; i++) {
                if (!(input[i] === input[i].toUpperCase())) {
                    return false;
                }
            }
            return true;
        },
        toTitleCase(str) {
            return str.replace(
                /\w\S*/g,
                function(txt) {
                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                }
            );
        }
    }
}