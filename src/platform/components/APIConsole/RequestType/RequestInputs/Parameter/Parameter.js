import ParameterInput from "@/platform/components/APIConsole/RequestType/RequestInputs/Parameter/ParameterInput/ParameterInput.vue";
//import AppActions from '@/platform/js/mixins/AppActions';
import ApiHelper from "@/platform/js/APIHelper";
import Utils from "@/platform/js/Utils";

export default {
	name: "Parameter",
	//mixins: [AppActions],
	components: {
		ParameterInput
	},
	props: {
		parameter: Object,
		methodInputObject: Object,
		inputParameters: Array,
		parameterIndex: Number,
		requestDetails: Object,
		appAction: Object,
		isRawJson: Boolean
	},
	data: function () {
		return {
			ACTION_VARIABLE_TYPES: ApiHelper.ACTION_VARIABLE_TYPES,
			METHOD_INPUT_PARAMETERS: ApiHelper.METHOD_INPUT_PARAMETERS
		};
	},
	computed: {
		/*isDropdownVariable() {
			if (this.parameter.Type_c == 'Dropdown' || this.parameter.Type_c == 'DynamicDropdown') {
				return true;
			}
			return false;
		}*/
		isHeaderType() {
			if (this.requestDetails.requestType == this.METHOD_INPUT_PARAMETERS.HEADERS) {
				return true;
			}
			return false;
		}
	},
	methods: {
		inputChanged(event) {
			let value = event.target.value;
			if (value.length > 0) {
				if (this.parameterIndex == (this.inputParameters.length - 1)) {
					let emptyRecord = this.getEmptyFieldInputParameter(this.requestDetails, this.appAction);
					this.inputParameters.push(emptyRecord);
				}
				if (!this.parameter.UI_Variables.IsSelected) {
					this.parameter.UI_Variables.IsSelected = true;
				}
			}

			this.setParameterEdited();
		},
		setSampleValueAsDefaultValue() {
			let name = this.parameter.Name;
			if (name == 'Content-Type' || name == 'Accept') {
				this.parameter.DefaultValue_c = this.parameter.SampleValue_c;
			}
		},
		removeInputParameter() {
			if (this.parameter.ID > 0) {
				this.methodInputObject.deletedParameters.push(Utils.deepCopyObject(this.parameter));
				this.appAction.UI_Variables.IsInputParameterEdited = true;
			}			
			this.inputParameters.splice(this.parameterIndex, 1);

			/*if (this.isRawJson) {
				let jsonData = this.generateJSONData(this.inputParameters);
				if (jsonData) {
					this.methodInputObject.data = JSON.stringify(jsonData, null, "\t");
					//action['RequestInputData']['ReqBody']['raw']['JSON'].data = JSON.stringify(jsonData, null, "\t");
				}
			}*/
		},
		dropdownValueChanged() {
			if (this.parameter.UI_Variables.IsFixedValue) {
				this.parameter.Type_c = this.ACTION_VARIABLE_TYPES.DROPDOWN;
			} else {
				this.parameter.Type_c = this.ACTION_VARIABLE_TYPES.STRING;
			}

			this.setParameterEdited();
		},
		setParameterEdited() {
			if (!this.parameter.UI_Variables.IsEdited) {
				this.parameter.UI_Variables.IsEdited = true;
				this.appAction.UI_Variables.IsInputParameterEdited = true;
			}
		}
	},
};