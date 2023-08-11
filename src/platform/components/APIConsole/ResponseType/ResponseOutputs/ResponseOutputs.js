import Parameter from "@/platform/components/APIConsole/ResponseType/ResponseOutputs/Parameter/Parameter.vue";
import ApiHelper from "@/platform/js/APIHelper";
import Utils from "@/platform/js/Utils";
import EmptyFieldGenerator from '@/platform/js/mixins/EmptyFieldGenerator';

export default {
	name: "ResponseOutputs",
	mixins: [EmptyFieldGenerator],
	components: {
		Parameter
	},
	props: {
		ResponseOutputData: Object,
		methodOutputObject: Object,
		appAction: Object
	},
	data: function () {
		return {
			METHOD_OUTPUT_PARAMETERS: ApiHelper.METHOD_OUTPUT_PARAMETERS,
		};
	},
	computed: {
		shouldEnableClearSelectedOutputFieldsButton() {
			let result = false;
			if (this.methodOutputObject.parameters.length > 0) {
				let parameters = this.methodOutputObject.parameters;
				for (let i = 0; i < parameters.length; i++) {
					if (parameters[i].UI_Variables.IsSelected) {
						result = true;
						break;
					}
				}
			}
			return result;
		}
	},
	methods: {
		selectAllOutputFieldValueChanged() {
			if (!this.methodOutputObject.shouldSkipAllPairsValueChanged) {
				if (this.methodOutputObject.parameters.length > 0) {
					let status = this.methodOutputObject.selectAllPairs;
					
					let parameters = this.methodOutputObject.parameters;
					for (let i = 0; i < parameters.length; i++) {	
						if (parameters[i].UI_Variables.IsSelected != status) {
							parameters[i].UI_Variables.IsSelected = status;
						}
					}
				}
			}
		},
		clearSelectedOutputFields() {
			let parameters = this.methodOutputObject.parameters;
			let deleteArray = [];
			for (let i = 0; i < parameters.length; i++) {
				if (parameters[i].UI_Variables.IsSelected != status) {
					if (parameters[i].ID > 0) {
						this.methodOutputObject.deletedParameters.push(Utils.deepCopyObject(parameters[i]));
					}
					deleteArray.push(i);
				}
			}

			for (let i = deleteArray.length - 1; i >= 0; i--) {
				parameters.splice(deleteArray[i], 1);
			}

			if (parameters.length == 0) {
				this.removeCheckboxSelectionOfSelectAllPairs();
			}
			this.appAction.UI_Variables.IsOutputParameterEdited = true;
		},
		clearAllOutputFields() {
			for (let i = 0; i < this.methodOutputObject.parameters.length; i++) {
				let parameter = this.methodOutputObject.parameters[i];
				if (parameter.ID > 0) {
					this.methodOutputObject.deletedParameters.push(Utils.deepCopyObject(parameter));
				}
			}
			this.methodOutputObject.parameters = [];
			this.removeCheckboxSelectionOfSelectAllPairs();
			this.appAction.UI_Variables.IsOutputParameterEdited = true;
		},
		removeCheckboxSelectionOfSelectAllPairs() {
			if (this.methodOutputObject.selectAllPairs) {
				this.methodOutputObject.shouldSkipAllPairsValueChanged = true;
				this.methodOutputObject.selectAllPairs = false;
				this.methodOutputObject.shouldSkipAllPairsValueChanged = false;
			}
		},

		addEmptyOutputField() {
			let emptyRecord = this.getEmptyFieldRecord('Body', 'Output', this.appAction);
			this.methodOutputObject.parameters.push(emptyRecord);
		},
	},
};
