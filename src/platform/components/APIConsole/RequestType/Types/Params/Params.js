import RequestInputs from "@/platform/components/APIConsole/RequestType/RequestInputs/RequestInputs.vue";
import ApiHelper from "@/platform/js/APIHelper";
//import ActionParameters from "@/platform/js/mixins/ActionParameters";
import DataRetriever from "@/platform/js/mixins/DataRetriever";

export default {
	name: "Params",
	mixins: [/*ActionParameters,*/ DataRetriever],
	components: {
		RequestInputs
	},
	props: {
		appAction: Object
	},
	data() {
		return {
			METHOD_INPUT_PARAMETERS: ApiHelper.METHOD_INPUT_PARAMETERS,
			requestDetails: {
				requestType: ''
			}
		}
	},
	created() {
		this.requestDetails.requestType = this.METHOD_INPUT_PARAMETERS.PARAMS;
	},
	methods: {
		async saveVariables(data) {
			let actionVaraiblesObject = {
				shouldAddParameters: false,
				actionVariables: data
			};
			let response = await this.$store.dispatch("platformData/saveActionVariablesInBulkMode", actionVaraiblesObject);
			let selectedTypes = { SelectedType: data[0].SelectedType };
			this.updateUIVariables(response, selectedTypes);
		},
		saveParamsParameteres() {
			let SelectedType = this.appAction.RequestInputData.Params.SelectedType;
			if (SelectedType == this.METHOD_INPUT_PARAMETERS.PARAMS_URL) {
				if (this.validateUrlParameters(this.appAction)) {
					let Records = this.createURLParameterRecords();
					if (Records) {
						let data = [{ Records: Records, SelectedType: SelectedType }];
						this.saveVariables(data);
					}
				}				
			} else {
				if (this.validateQueryParameters(this.appAction)) {
					let Records = this.createQueryParameterRecords();
					if (Records) {
						let data = [{ Records: Records, SelectedType: SelectedType }];
						this.saveVariables(data);
					}
				}				
			}
		},
		createURLParameterRecords() {
			let methodObject = this.appAction.RequestInputData[this.METHOD_INPUT_PARAMETERS.PARAMS][this.METHOD_INPUT_PARAMETERS.PARAMS_URL];

			return this.createInputParamterRecords(methodObject, false);
		},
		createQueryParameterRecords() {
			let methodObject = this.appAction.RequestInputData[this.METHOD_INPUT_PARAMETERS.PARAMS][this.METHOD_INPUT_PARAMETERS.PARAMS_QUERY];

			return this.createInputParamterRecords(methodObject, false);
		},
		async updateUIVariables(response, selectedTypes) {
			let proccesedData = response.proccesedData;
			for (let i = 0; i < proccesedData.length; i++) {
				let item = proccesedData[i];

				let SelectedType = item.SelectedType;
				if (SelectedType == this.METHOD_INPUT_PARAMETERS.PARAMS_URL) {
					let methodObject = this.appAction.RequestInputData[this.METHOD_INPUT_PARAMETERS.PARAMS][this.METHOD_INPUT_PARAMETERS.PARAMS_URL];
					this.updateUIParametersData(methodObject, item);
				}

				if (SelectedType == this.METHOD_INPUT_PARAMETERS.PARAMS_QUERY) {
					let methodObject = this.appAction.RequestInputData[this.METHOD_INPUT_PARAMETERS.PARAMS][this.METHOD_INPUT_PARAMETERS.PARAMS_QUERY];
					this.updateUIParametersData(methodObject, item);
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
		}
	}
}