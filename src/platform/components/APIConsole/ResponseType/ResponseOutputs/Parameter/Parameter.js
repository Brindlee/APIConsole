import EmptyFieldGenerator from '@/platform/js/mixins/EmptyFieldGenerator';
//import ClickOutside from '@/directives/ClickOutside.js';
import ApiHelper from "@/platform/js/APIHelper";
import Utils from "@/platform/js/Utils";
import LabelGenerator from '@/platform/js/mixins/LabelGenerator';

export default {
	name: "Parameter",
	mixins: [EmptyFieldGenerator, LabelGenerator],
	/*directives: {
		'click-outside': ClickOutside.directive
	},*/
	components: {
		
	},
	props: {
		parameter: Object,
		methodOutputObject: Object,
		outputParameters: Array,
		parameterIndex: Number,
		appAction: Object
	},
	data: function () {
		return {
			ACTION_VARIABLE_TYPES: ApiHelper.ACTION_VARIABLE_TYPES,
			standardFieldData: {
				searchText: '',
				show: false
			}
		};
	},
	computed: {
		/*isDropdownVariable() {
			if (this.parameter.Type_c == 'Dropdown' || this.parameter.Type_c == 'DynamicDropdown') {
				return true;
			}
			return false;
		},*/
		standardFields() {
			var self = this;
			return this.$store.getters["platformData/standardFieldsMetadata"]
				.filter(function (standardField) {
					if (standardField.Name.toLowerCase().includes(self.standardFieldData.searchText.toLowerCase())) {
						return true;
					}
				});
		},
		showStandardFieldsSection() {
			if (this.parameter.Name != '' || this.parameter.Label_c != '') {
				return true;
			}
			return false;
		},
		isWebhook() {
			if (this.appAction.Type_c == 'InstantTrigger') {
				return true;
			}
			return false;
		}
	},
	methods: {
		removeOutputParameter() {
			if (this.parameter.ID > 0) {
				this.methodOutputObject.deletedParameters.push(Utils.deepCopyObject(this.parameter));
			}
			this.outputParameters.splice(this.parameterIndex, 1);
		},
		parameterCheckboxSelectionValueChanged() {			
			if (this.methodOutputObject.selectAllPairs) {
				this.methodOutputObject.shouldSkipAllPairsValueChanged = true;
				this.methodOutputObject.selectAllPairs = false;
				this.methodOutputObject.shouldSkipAllPairsValueChanged = false;
			}		
		},
		keyValueInputChanged(event) {
			let value = event.target.value;
			if (value.length > 0) {
				if (this.parameterIndex == (this.outputParameters.length - 1)) {
					this.addEmptyOutputField();
				}
			}
		},
		addEmptyOutputField() {
			let emptyRecord = this.getEmptyFieldRecord('Body', 'Output', this.appAction);
			this.outputParameters.push(emptyRecord);
		},
		inputChanged() {
			this.setParameterEdited();
		},
		dropdownValueChanged() {
			this.setParameterEdited();
		},
		setParameterEdited() {
			if (!this.parameter.UI_Variables.IsEdited) {
				this.parameter.UI_Variables.IsEdited = true;
				this.appAction.UI_Variables.IsOutputParameterEdited = true;
			}
		},

		//label generation
		generateInputFieldLabel() {
			let name = this.parameter.Name;
			let label = this.geneateFieldLabel(name);
			this.parameter.Label_c = label;

			this.inputChanged();
		},

		showDropdown() {
			if (this.showStandardFieldsSection) {
				this.standardFieldData.show = true;
			}			
		},
		hideDropdown() {
			this.standardFieldData.show = false;
		},
		setStandardField(standardField) {
			this.parameter.Entity_Property_c.ID = standardField.ID;
			this.parameter.Entity_Property_c.Name = standardField.Name;
			this.parameter.SampleValue_c = standardField.Sample_Data_c;

			this.resetStandardFieldDataAndSetInputChanged();
		},
		clearStandardField() {
			this.parameter.Entity_Property_c.ID = 0;
			this.parameter.Entity_Property_c.Name = '';
			
			this.resetStandardFieldDataAndSetInputChanged();
		},
		resetStandardFieldDataAndSetInputChanged() {
			this.standardFieldData.searchText = '';
			this.hideDropdown();
			this.inputChanged();
		}
	},
};