import Utils from "@/platform/js/Utils";

export default {
    methods: {
		convertDataToWebhookFieldFormat(details) {
			let data = details.data;
			let fields = details.fields;
			try {
				let jsonData = JSON.parse(data);
				if (Utils.isArray(jsonData)) {
					if (jsonData.length > 0) {
						this.checkFirstItemForSimpleArrayBeforeIteratingArray(jsonData, fields, '', '');
					}
				} else {
					this.iterateOverJsonObjectWebhook(jsonData, fields, '');
				}
			} catch (exception) {
				details.result = false;
				this.showErrorWebhook(exception);
			}
		},
		iterateOverJsonObjectWebhook(object, fields, prependStringKey) {
			for (let key of Object.keys(object)) {
				let prependString = prependStringKey;
				let fieldValue = object[key];
				if (!Utils.isNull(fieldValue)) {
					if (typeof (fieldValue) == 'object') {
						if (Utils.isArray(fieldValue)) {
							if (fieldValue.length > 0) {
								if (prependString != '') {
									prependString += "." + key;
								} else {
									prependString = key;
								}
								this.checkFirstItemForSimpleArrayBeforeIteratingArray(fieldValue, fields, key, prependString);
							}
						} else {
							if (prependString != '') {
								prependString += "." + key;
							} else {
								prependString = key;
							}
							this.iterateOverJsonObjectWebhook(fieldValue, fields, prependString);
						}
					} else {
						if (prependString != '') {
							prependString += "." + key;
						} else {
							prependString = key;
						}
						this.setKeyInObject(fields, prependString, fieldValue);
					}
				} else {
					this.setKeyInObject(fields, prependString, fieldValue);
				}
			}
		},
		checkFirstItemForSimpleArrayBeforeIteratingArray(jsonData, fields, key, prependString) {
			let firstItem = jsonData[0];
			if (typeof (firstItem) == 'object') {
				this.iterateOverJsonArrayWebhook(jsonData, fields, prependString);
			} else if ((typeof (firstItem) == 'string')
				|| (typeof (firstItem) == 'number')) {
				let singleStringKey = (prependString != '') ? prependString : key;
				this.setKeyInObject(fields, singleStringKey, jsonData.join(','));
				for (let i = 0; i < jsonData.length; i++) {
					let item = jsonData[i];
					let singleArrayKey = '';
					if (prependString != '') {
						singleArrayKey = prependString + "." + (i + 1);
					} else {
						singleArrayKey = key;
					}
					this.setKeyInObject(fields, singleArrayKey, item);
				}
			}
		},
		iterateOverJsonArrayWebhook(jsonData, fields, prependString1) {
			for (let i = 0; i < jsonData.length; i++) {
				let item = jsonData[i];
				let prependString = prependString1 + "." + (i + 1);
				this.iterateOverJsonObjectWebhook(item, fields, prependString);
			}
		},
		setKeyInObject(fields, key, fieldValue) {
			fields[key] = fieldValue;
		},
		showErrorWebhook(message) {
			this.$store.dispatch("toaster/show", {
				type: "error", message: message, time: 2000,
			});
		}
    }
}