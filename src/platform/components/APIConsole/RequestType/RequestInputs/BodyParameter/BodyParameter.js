import ApiHelper from "@/platform/js/APIHelper";
import Utils from "@/platform/js/Utils";

export default {
	name: "BodyParameter",
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
			ACTION_VARIABLE_TYPES: ApiHelper.ACTION_VARIABLE_TYPES
		};
	},
	methods: {
		removeInputParameter() {
			if (this.parameter.ID > 0) {
				this.methodInputObject.deletedParameters.push(Utils.deepCopyObject(this.parameter));
				this.appAction.UI_Variables.IsInputParameterEdited = true;
			}
			this.inputParameters.splice(this.parameterIndex, 1);
		},
		inputChanged() {
			this.setParameterEdited();
		},
		variableTypeChange() {
			let type = this.parameter.Type_c;
			if (type != this.ACTION_VARIABLE_TYPES.DROPDOWN
				&& type != this.ACTION_VARIABLE_TYPES.DYNAMIC_DROPDOWN) {
				if (this.parameter.UI_Variables.IsFixedValue) {
					this.parameter.UI_Variables.IsFixedValue = false;
				}
			} else {
				if (!this.parameter.UI_Variables.IsFixedValue) {
					this.parameter.UI_Variables.IsFixedValue = true;
				}
			}
			this.setParameterEdited();
		},
		checkboxValueChanged() {
			this.setParameterEdited();
		},
		isRequiredValueChanged() {
			this.setParameterEdited();
		},
		setParameterEdited() {
			if (!this.parameter.UI_Variables.IsEdited) {
				this.parameter.UI_Variables.IsEdited = true;
				this.appAction.UI_Variables.IsInputParameterEdited = true;
			}
		}
	}
}