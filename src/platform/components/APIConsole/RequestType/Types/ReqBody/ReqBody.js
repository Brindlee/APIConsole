import RequestInputs from "@/platform/components/APIConsole/RequestType/RequestInputs/RequestInputs.vue";
//import InputBodyTable from "@/platform/components/APIConsole/RequestType/InputBodyTable/InputBodyTable.vue";
import JsonEditor from "@/platform/components/AceEditor/JsonEditor/JsonEditor.vue";
import ApiHelper from "@/platform/js/APIHelper";
//import ActionParameters from "@/platform/js/mixins/ActionParameters";
import DataRetriever from "@/platform/js/mixins/DataRetriever";
import IOFieldGenerator from '@/platform/js/mixins/IOFieldGenerator';

export default {
	name: "ReqBody",
	mixins: [/*ActionParameters,*/ IOFieldGenerator, DataRetriever],
	components: {
		RequestInputs,
		JsonEditor,
		//InputBodyTable
	},
	props: {
		appAction: Object
	},
	data() {
		return {
			METHOD_INPUT_PARAMETERS: ApiHelper.METHOD_INPUT_PARAMETERS,
			requestDetails: {
				requestType: ''
			},
			ACTION_VARIABLE_TYPES: ApiHelper.ACTION_VARIABLE_TYPES,
			shouldShowGeneratedMessage: false,
			showJsonEditor: false,
		}
	},
	computed: {
		shouldShowSaveButton() {
			let SelectedType = this.appAction.RequestInputData.ReqBody.SelectedType;
			if (SelectedType == this.METHOD_INPUT_PARAMETERS.REQ_BODY.NONE) {
				return false;
			}
			return true;
		}
	},
	created() {
		this.requestDetails.requestType = this.METHOD_INPUT_PARAMETERS.BODY;
	},
	methods: {
		//data saving
		async saveVariables(data) {
			let actionVaraiblesObject = {
				shouldAddParameters: false,
				actionVariables: data
			};
			let response = await this.$store.dispatch("platformData/saveActionVariablesInBulkMode", actionVaraiblesObject);

			await this.saveRequestRawJsonDataIfChanged();

			let selectedTypes = { SelectedType: data[0].SelectedType };
			if (data[0].SelectedSubType != 'undefined') {
				selectedTypes['SelectedSubType'] = data[0].SelectedSubType;
			}
			this.updateUIVariables(response, selectedTypes);
		},

		async saveRequestRawJsonDataIfChanged() {
			if (this.appAction.RequestInputData[this.METHOD_INPUT_PARAMETERS.BODY][this.METHOD_INPUT_PARAMETERS.REQ_BODY.RAW][this.METHOD_INPUT_PARAMETERS.REQ_BODY_RAW.JSON].rawJsonDataUpdated.staus) {
				var self = this;
				let rawJson = this.appAction.RequestInputData[this.METHOD_INPUT_PARAMETERS.BODY][this.METHOD_INPUT_PARAMETERS.REQ_BODY.RAW][this.METHOD_INPUT_PARAMETERS.REQ_BODY_RAW.JSON].data;
				let details = {
					rawJson: rawJson,
					action: this.appAction
				};
				await this.$store.dispatch("platformData/saveActionMetadataInTable", details);

				this.appAction.RequestInputData[this.METHOD_INPUT_PARAMETERS.BODY][this.METHOD_INPUT_PARAMETERS.REQ_BODY.RAW][this.METHOD_INPUT_PARAMETERS.REQ_BODY_RAW.JSON].rawJsonDataUpdated.staus = false;
				this.appAction.RequestInputData[this.METHOD_INPUT_PARAMETERS.BODY][this.METHOD_INPUT_PARAMETERS.REQ_BODY.RAW][this.METHOD_INPUT_PARAMETERS.REQ_BODY_RAW.JSON].rawJsonDataUpdated.show = true;
				setTimeout(function(){
					self.appAction.RequestInputData[self.METHOD_INPUT_PARAMETERS.BODY][self.METHOD_INPUT_PARAMETERS.REQ_BODY.RAW][self.METHOD_INPUT_PARAMETERS.REQ_BODY_RAW.JSON].rawJsonDataUpdated.show = false;
				}, 2000);
				//this.$store.dispatch("toaster/show", { type: "success", message: 'Json structure saved', time: 2000 });
			} /*else {
				this.$store.dispatch("toaster/show", { type: "warning", message: 'No changes in json', time: 2000 });
			}*/
		},

		async saveBodyParameteres() {
			let SelectedType = this.appAction.RequestInputData.ReqBody.SelectedType;
			if (SelectedType == this.METHOD_INPUT_PARAMETERS.REQ_BODY.FORM_DATA) {
				if (this.validateBodyFormDataParameters(this.appAction)) {
					let Records = this.createFormDataParameterRecords();
					if (Records) {
						let data = [{ Records: Records, SelectedType: SelectedType }];
						this.saveVariables(data);
					}
				}				
			} else if (SelectedType == this.METHOD_INPUT_PARAMETERS.REQ_BODY.X_WWW_FORM_URL_ENCODED) {
				if (this.validateBodyXWwwUrlEncodedParameters(this.appAction)) {
					let Records = this.createXWwwUrlEncodedParameterRecords();
					if (Records) {
						let data = [{ Records: Records, SelectedType: SelectedType }];
						this.saveVariables(data);
					}
				}				
			} else if (SelectedType == this.METHOD_INPUT_PARAMETERS.REQ_BODY.RAW) {
				let SelectedSubType = this.appAction.RequestInputData.ReqBody.SelectedSubType;
				if (SelectedSubType == this.METHOD_INPUT_PARAMETERS.REQ_BODY_RAW.JSON) {
					if (this.validateBodyRawJsonParameters(this.appAction)) {
						let Records = this.createRawJsonParameterRecords();
						if (Records) {
							let data = [{
								Records: Records,
								SelectedType: SelectedType,
								SelectedSubType: SelectedSubType
							}];
							this.saveVariables(data);
						}
					}					
				}
			}
		},
		createFormDataParameterRecords() {
			let methodObject = this.appAction.RequestInputData[this.METHOD_INPUT_PARAMETERS.BODY][this.METHOD_INPUT_PARAMETERS.REQ_BODY.FORM_DATA];

			return this.createInputParamterRecords(methodObject, false);
		},
		createXWwwUrlEncodedParameterRecords() {
			let methodObject = this.appAction.RequestInputData[this.METHOD_INPUT_PARAMETERS.BODY][this.METHOD_INPUT_PARAMETERS.REQ_BODY.X_WWW_FORM_URL_ENCODED];

			return this.createInputParamterRecords(methodObject, false);
		},
		createRawJsonParameterRecords() {
			let methodObject = this.appAction.RequestInputData[this.METHOD_INPUT_PARAMETERS.BODY][this.METHOD_INPUT_PARAMETERS.REQ_BODY.RAW][this.METHOD_INPUT_PARAMETERS.REQ_BODY_RAW.JSON];

			return this.createInputParamterRecords(methodObject, false);
		},

		async updateUIVariables(response, selectedTypes) {
			let proccesedData = response.proccesedData;
			for (let i = 0; i < proccesedData.length; i++) {
				let item = proccesedData[i];

				let SelectedType = item.SelectedType;
				if (SelectedType == this.METHOD_INPUT_PARAMETERS.REQ_BODY.FORM_DATA) {
					let methodObject = this.appAction.RequestInputData[this.METHOD_INPUT_PARAMETERS.BODY][this.METHOD_INPUT_PARAMETERS.REQ_BODY.FORM_DATA];
					this.updateUIParametersData(methodObject, item);
				}

				if (SelectedType == this.METHOD_INPUT_PARAMETERS.REQ_BODY.X_WWW_FORM_URL_ENCODED) {
					let methodObject = this.appAction.RequestInputData[this.METHOD_INPUT_PARAMETERS.BODY][this.METHOD_INPUT_PARAMETERS.REQ_BODY.X_WWW_FORM_URL_ENCODED];
					this.updateUIParametersData(methodObject, item);
				}

				if (SelectedType == this.METHOD_INPUT_PARAMETERS.REQ_BODY.RAW) {
					let SelectedSubType = item.SelectedSubType;

					if (SelectedSubType == this.METHOD_INPUT_PARAMETERS.REQ_BODY_RAW.JSON) {
						let methodObject = this.appAction.RequestInputData[this.METHOD_INPUT_PARAMETERS.BODY][this.METHOD_INPUT_PARAMETERS.REQ_BODY.RAW][this.METHOD_INPUT_PARAMETERS.REQ_BODY_RAW.JSON]
						this.updateUIParametersData(methodObject, item);
					}
				}
			}

			let errorsData = response.errorsData;
			
			if (errorsData.length > 0) {
				this.$store.dispatch("toaster/show", { type: "success", message: 'Operation performed.', time: 2000 });
				await this.$store.dispatch("platformData/setOperationErrorData", { actionData: null, variablesData: errorsData });
			} else {
				this.$store.dispatch("toaster/show", { type: "success", message: 'Changes saved.', time: 2000 });
				await this.checkIfAnyInputParameterIsUnsaved(this.appAction, selectedTypes);
			}			
		},

		//parameter generation
		async validateBeforeGeneratingInput() {
			var self = this;
			let rawJson = this.appAction.RequestInputData[this.METHOD_INPUT_PARAMETERS.BODY][this.METHOD_INPUT_PARAMETERS.REQ_BODY.RAW][this.METHOD_INPUT_PARAMETERS.REQ_BODY_RAW.JSON];
			var inputOutputData = {
				type: "Input",
				jsonText: rawJson.data,
				inputParameters: rawJson.parameters,
				appAction: this.appAction,
				result: true
			};
			await self.setLoadingStatus(true);
			await self.validateJSONData(inputOutputData);			
			await this.setLoadingStatus(false);
			if (inputOutputData.result) {
				self.shouldShowGeneratedMessage = true;
				setTimeout(function () {
					self.shouldShowGeneratedMessage = false;
				}, 2000);
			}
		},
		
		handlePaste(e) {
			var clipboardData, pastedData;

			// Stop data actually being pasted into div
			e.stopPropagation();
			e.preventDefault();
			
			// Get pasted data via clipboard API
			clipboardData = e.clipboardData || window.clipboardData;
			pastedData = clipboardData.getData('Text');

			var obj = JSON.parse(pastedData);
			var pretty = JSON.stringify(obj, undefined, 4);

			const selection = window.getSelection();
			if (!selection.rangeCount) return false;
			//selection.deleteFromDocument();
			selection.getRangeAt(0).insertNode(document.createTextNode(pretty));
		},

		toggleRawJsonUIFormat() {
			let isTable = this.appAction.RequestInputData[this.METHOD_INPUT_PARAMETERS.BODY][this.METHOD_INPUT_PARAMETERS.REQ_BODY.RAW][this.METHOD_INPUT_PARAMETERS.REQ_BODY_RAW.JSON].isTable;
			this.appAction.RequestInputData[this.METHOD_INPUT_PARAMETERS.BODY][this.METHOD_INPUT_PARAMETERS.REQ_BODY.RAW][this.METHOD_INPUT_PARAMETERS.REQ_BODY_RAW.JSON].isTable = !isTable;
		},

		jsonInuptDataChanged() {
			if (!this.appAction.RequestInputData[this.METHOD_INPUT_PARAMETERS.BODY][this.METHOD_INPUT_PARAMETERS.REQ_BODY.RAW][this.METHOD_INPUT_PARAMETERS.REQ_BODY_RAW.JSON].rawJsonDataUpdated.staus) {
				this.appAction.RequestInputData[this.METHOD_INPUT_PARAMETERS.BODY][this.METHOD_INPUT_PARAMETERS.REQ_BODY.RAW][this.METHOD_INPUT_PARAMETERS.REQ_BODY_RAW.JSON].rawJsonDataUpdated.staus = true;
			}
		},

		openJsonEditor() {
			this.showJsonEditor = true;
		}
	}
}