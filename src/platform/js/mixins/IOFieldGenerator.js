import LabelGenerator from '@/platform/js/mixins/LabelGenerator';
import ApiHelper from "@/platform/js/APIHelper";
import Utils from "@/platform/js/Utils";

export default {
	mixins: [ LabelGenerator ],
	data() {
		return {
			ACTION_VARIABLE_TYPES: ApiHelper.ACTION_VARIABLE_TYPES
		}
	},
	methods: {
		validateJSONData(inputOutputData) {
			if (inputOutputData.type == 'Input') {
				this.validateJSONDataForInputParameters(inputOutputData);
			} else if (inputOutputData.type == 'TestFormOutput') {
				this.validateJSONDataForTestFormOutputFields(inputOutputData);
			} else {
				this.validateJSONDataForOutputParameters(inputOutputData);
			}
		},
		validateJSONDataForInputParameters(inputOutputData) {
			let jsonText = inputOutputData.jsonText;
			if (!Utils.isNull(jsonText)) {
				try {
					let jsonData = JSON.parse(jsonText);
					if (Utils.isArray(jsonData)) {
						if (jsonData.length > 0) {
							this.iterateOverJsonArray(jsonData, '', '', inputOutputData);
							this.appAction.UI_Variables.IsInputParameterEdited = true;
						} else {
							this.showError('Empty array');
						}
					} else {
						this.generateInputOutputVariables(jsonData, '', '', inputOutputData);
						this.appAction.UI_Variables.IsInputParameterEdited = true;
					}
				} catch (exception) {
					inputOutputData.result = false;
					this.showError('data is not in valid JSON format');
				}
			} else {
				inputOutputData.result = false;
				this.showError('json is either undefined or null');
			}
		},
		validateJSONDataForOutputParameters(inputOutputData) {
			let recordContainerKey = inputOutputData.recordContainerKey;
			let jsonText = inputOutputData.jsonText;
			if (!Utils.isNull(jsonText)) {
				try {
					let jsonData = JSON.parse(jsonText);
					if (Utils.isArray(jsonData)) {
						//skip checking record container key
						if (jsonData.length > 0) {
							this.iterateOverJsonArray(jsonData, '', '', inputOutputData);
							this.appAction.UI_Variables.IsOutputParameterEdited = true;
						} else {
							this.showError('Empty array');
						}
					} else {
						if (recordContainerKey == '') {
							this.generateInputOutputVariables(jsonData, '', '', inputOutputData);
							this.appAction.UI_Variables.IsOutputParameterEdited = true;
						} else {
							let recordContainerKeyData = this.findRecordContainerKey(jsonData, recordContainerKey);

							if (recordContainerKeyData) {
								if (Utils.isArray(recordContainerKeyData)) {
									this.iterateOverJsonArray(recordContainerKeyData, '', '', inputOutputData);
								} else {
									this.generateInputOutputVariables(recordContainerKeyData, '', '', inputOutputData);
								}
								this.appAction.UI_Variables.IsOutputParameterEdited = true;
							} else {
								inputOutputData.result = false;
								this.showError('Record container key not found');
							}
						}
					}
				} catch (exception) {
					inputOutputData.result = false;
					this.showError('data is not in valid JSON format');
				}
			} else {
				inputOutputData.result = false;
				this.showError('data is either undefined or null');
			}
		},
		validateJSONDataForTestFormOutputFields(inputOutputData) {
			let jsonText = inputOutputData.jsonText;
			if (!Utils.isNull(jsonText)) {
				try {
					let jsonData = JSON.parse(jsonText);
					if (Utils.isArray(jsonData)) {
						if (jsonData.length > 0) {
							this.iterateOverJsonArray(jsonData, '', '', inputOutputData);
						} else {
							this.showError('Empty array');
						}
					} else {
						this.generateInputOutputVariables(jsonData, '', '', inputOutputData);
					}
				} catch (exception) {
					this.showError('data is not in valid JSON format');
				}
			} else {
				this.showError('json is either undefined or null');
			}
		},
		findRecordContainerKey(object, key) {
			if (object[key]) {
				return object[key];
			}
			return null;
		},
		iterateOverJsonArray(jsonData, prependString, lineItemParentKey, inputOutputData) {
			for (let i = 0; i < jsonData.length; i++) {
				let item = jsonData[i];
				this.validateRecordContainerData(item, prependString, lineItemParentKey, inputOutputData);
			}
		},
		validateRecordContainerData(jsonData, prependString, lineItemParentKey, inputOutputData) {
			if (Utils.isArray(jsonData)) {
				//data in array format
				if (jsonData.length > 0) {
					this.iterateOverJsonArray(jsonData, prependString, lineItemParentKey, inputOutputData);
				}
			} else {
				if (Utils.isObject(jsonData)) {
					//data in object format
					this.generateInputOutputVariables(jsonData, prependString, lineItemParentKey, inputOutputData);
				}
			}
		},
		async generateInputOutputVariables(object, parentObjectKey, lineItemParentKey, inputOutputData) {
			for (let key of Object.keys(object)) {
				let parameterValue = object[key];

				let nameWithParentObjectKey = key;
				if (parentObjectKey != '') {
					nameWithParentObjectKey = parentObjectKey + '.' + key;
				}

				let details = {
					key: key,
					fieldType: 'String',
					name: nameWithParentObjectKey,
					parameterValue: parameterValue,
					parentKey: lineItemParentKey
				}

				if (!Utils.isNull(parameterValue)) {
					if (typeof (parameterValue) == 'object') {
						if (Utils.isArray(parameterValue)) {
							if (parameterValue.length > 0) {
								let firstObject = parameterValue[0];
								if (typeof (firstObject) == 'object') {
									let newLineItemParentKey = key;
									if (parentObjectKey != '') {
										newLineItemParentKey = parentObjectKey + '.' + key;
									} else if (lineItemParentKey != '') {
										newLineItemParentKey = lineItemParentKey + '|' + key;
									}
									this.iterateOverJsonArray(parameterValue, '', newLineItemParentKey, inputOutputData);
								}
							}
						} else {
							this.generateInputOutputVariables(parameterValue, nameWithParentObjectKey, lineItemParentKey, inputOutputData)
						}
					} else {
						if (inputOutputData.type == 'Input' || inputOutputData.type == 'Output') {
							let fieldType = this.getFieldTypeFromValue(parameterValue);
							details.fieldType = fieldType;
						}						
						if (inputOutputData.type == 'Input') {
							this.setInputParameterData(details, inputOutputData);
						} else if (inputOutputData.type == 'TestFormOutput') {
							this.mapTestFormOutputFieldsData(details, inputOutputData);
						} else {
							this.setOutputParameterData(details, inputOutputData);
						}						
					}
				} else {
					if (inputOutputData.type == 'Input') {
						this.setInputParameterData(details, inputOutputData);
					} else if (inputOutputData.type == 'TestFormOutput') {
						this.mapTestFormOutputFieldsData(details, inputOutputData);
					} else {
						this.setOutputParameterData(details, inputOutputData);
					}					
				}
			}
		},
		getFieldTypeFromValue(value) {
			if (value != undefined && value != null) {
				if (!isNaN(value)) {
					if (typeof (value) === "boolean") {
						return this.ACTION_VARIABLE_TYPES.BOOLEAN;
					} else if (typeof (value) === "string") {
						return this.ACTION_VARIABLE_TYPES.STRING;
					} else {
						if (value.toString().indexOf('.') != -1) {
							//flaot
							return this.ACTION_VARIABLE_TYPES.FLOAT;
						} else {
							//integer
							return this.ACTION_VARIABLE_TYPES.INTEGER;
						}
					}
				} else if (typeof (value) === "boolean") {
					return this.ACTION_VARIABLE_TYPES.BOOLEAN;
				} else {
					try {
						let newDate = Date.parse(value);
						if (newDate) {
							if (!this.isFromNonDateRegex(value)) {
								return this.ACTION_VARIABLE_TYPES.DATE;
							} else {
								return this.ACTION_VARIABLE_TYPES.STRING;
							}
						} else {
							return this.ACTION_VARIABLE_TYPES.STRING;
						}
					} catch (exception) {
						return this.ACTION_VARIABLE_TYPES.STRING;
					}
				}
			} else {
				return this.ACTION_VARIABLE_TYPES.STRING;
			}
		},
		isFromNonDateRegex(value) {
			let isMatch = false;
			var patterns = [/^[a-zA-Z]+-[0-9]+/];
			for (let i = 0; i < patterns.length; i++) {
				let pattern = patterns[i];
				if (pattern.test(value)) {
					isMatch = true;
					break;
				}
			}
			return isMatch;
		},
		setInputParameterData(details, inputOutputData) {
			let inputParameters = inputOutputData.inputParameters;

			let parameter = this.getInputOutputParameterByKey(details, inputParameters);

			if (parameter) {
				//update parameter data
				let isUpdated = false;

				if (parameter.Type_c != details.fieldType) {
					if (!(details.fieldType == this.ACTION_VARIABLE_TYPES.BOOLEAN
						&& parameter.Type_c == this.ACTION_VARIABLE_TYPES.DROPDOWN)) {
						if (details.fieldType == this.ACTION_VARIABLE_TYPES.BOOLEAN) {
							details.fieldType = this.ACTION_VARIABLE_TYPES.DROPDOWN;
							parameter.Choices_c = 'true|Yes,false|No';
							details.parameterValue = (details.parameterValue) ? true : false;
						}
						parameter.Type_c = details.fieldType;
						isUpdated = true;
					}
				}

				if (parameter.SampleValue_c != details.parameterValue) {
					parameter.SampleValue_c = details.parameterValue;
					isUpdated = true;
				}

				if (isUpdated) {
					parameter.UI_Variables.IsEdited = true;
				}
			} else {
				//add parameter
				let newParameter = this.getEmptyFieldInputRecord('Body', inputOutputData.appAction);
				newParameter.Name = details.name;
				newParameter.Label_c = this.geneateFieldLabel(details.name);

				if (details.fieldType == this.ACTION_VARIABLE_TYPES.BOOLEAN) {
					details.fieldType = this.ACTION_VARIABLE_TYPES.DROPDOWN;
					newParameter.Choices_c = 'true|Yes,false|No';
					details.parameterValue = (details.parameterValue) ? true : false;
				}
				newParameter.Type_c = details.fieldType;
				newParameter.ParentKey_c = details.parentKey;
				newParameter.SampleValue_c = details.parameterValue;

				inputParameters.push(newParameter);
			}
		},
		setOutputParameterData(details, inputOutputData) {
			let outputParameters = inputOutputData.outputParameters;
			let parameter = this.getInputOutputParameterByKey(details, outputParameters);
			if (parameter) {
				//update parameter data
				parameter.Type_c = details.fieldType;
				parameter.SampleValue_c = details.parameterValue;
				parameter.UI_Variables.IsEdited = true;
				let actionType = inputOutputData.appAction.Type_c;
				if (actionType == 'InstantTrigger') {
					parameter.IsSampleValueField_c = true;
				}
			} else {
				//add parameter
				let newParameter = this.getEmptyFieldOutputRecord('Body', inputOutputData.appAction);
				let actionType = inputOutputData.appAction.Type_c;
				if (actionType == 'InstantTrigger') {
					newParameter.IsSampleValueField_c = true;
				}
				newParameter.Name = details.name;
				newParameter.Label_c = this.geneateFieldLabel(details.name);
				newParameter.Type_c = details.fieldType;
				newParameter.ParentKey_c = details.parentKey;
				newParameter.SampleValue_c = details.parameterValue;
				outputParameters.push(newParameter);
			}
		},
		mapTestFormOutputFieldsData(details, inputOutputData) {
			let outputFields = inputOutputData.outputFields;
			//let parameter = null;
			for (let i = 0; i < outputFields.length; i++) {
				let outputField = outputFields[i];
				if (Utils.isNull(outputField.parentKey)) {
					outputField.parentKey = '';
				}
				if (outputField.name == details.name && outputField.parentKey == details.parentKey) {
					//parameter = outputField;
					//outputField.Type_c = details.fieldType;
					outputField.sampleValue = details.parameterValue;
					break;
				}
			}
			/*if (parameter) {
				//update parameter data
				parameter.Type_c = details.fieldType;
				parameter.SampleValue_c = details.parameterValue;
				parameter.UI_Variables.IsEdited = true;
			} else {
				//add parameter
				let newParameter = this.getEmptyFieldOutputRecord('Body', inputOutputData.appAction);
				newParameter.Name = details.name;
				newParameter.Label_c = this.geneateFieldLabel(details.name);
				newParameter.Type_c = details.fieldType;
				newParameter.ParentKey_c = details.parentKey;
				newParameter.SampleValue_c = details.parameterValue;
				outputParameters.push(newParameter);
			}*/
		},
		getInputOutputParameterByKey(details, parameters) {
			for (let i = 0; i < parameters.length; i++) {
				let parameter = parameters[i];
				if (parameter.Name == details.name && parameter.ParentKey_c == details.parentKey) {
					return parameter;
				}
			}
			return null;
		},
		getEmptyFieldInputRecord(placement, action) {
			return {
				ActionId_c: { ID: action.ID, Name: action.Name },
				Choices_c: '',
				Date_Format_c: '',
				DefaultValue_c: '',
				Description_c: '',
				Direction_c: 'Input',
				DynamicDropdownKey_c: '',
				DynamicSearchKey_c: '',
				Entity_Property_c: { ID: 0, Name: '' },
				ID: 0,
				IsSampleValueField_c: '',
				IsRequired_c: '',
				IsRecordIdentifier_c: '',
				Label_c: '',
				Lookup_EntityField_c: '',
				Lookup_Entity_c: { ID: 0, Name: '' },
				Name: '',
				Order_c: '',
				ParentKey_c: '',
				Placeholder_c: '',
				Placement_c: placement,
				SampleValue_c: '',
				ShowDescriptionAboveField_c: '',
				SupportsRefreshFields_c: '',
				Type_c: 'String',
				UI_Variables: {
					IsSelected: true,
					IsFixedValue: false,
					IsEdited: false,
					IsExpanded: false,
					DynamicDropdownSources: {
						keySource: {
							id: 0,
							key: '',
							displayLabel: ''
						},
						searchsource: {
							id: 0,
							key: '',
							displayLabel: ''
						}
					}
				}
			};
		},
		getEmptyFieldOutputRecord(placement, action) {
			return {
				ActionId_c: { ID: action.ID, Name: action.Name },
				Choices_c: '',
				Date_Format_c: '',
				DefaultValue_c: '',
				Description_c: '',
				Direction_c: 'Output',
				DynamicDropdownKey_c: '',
				DynamicSearchKey_c: '',
				Entity_Property_c: { ID: 0, Name: '' },
				ID: 0,
				IsSampleValueField_c: '',
				IsRequired_c: '',
				IsRecordIdentifier_c: '',
				Label_c: '',
				Lookup_EntityField_c: '',
				Lookup_Entity_c: { ID: 0, Name: '' },
				Name: '',
				Order_c: '',
				ParentKey_c: '',
				Placeholder_c: '',
				Placement_c: placement,
				SampleValue_c: '',
				ShowDescriptionAboveField_c: '',
				SupportsRefreshFields_c: '',
				Type_c: 'String',
				UI_Variables: {
					IsSelected: false,
					IsEdited: false,
					IsExpanded: false,
					DynamicDropdownSources: {
						keySource: {
							id: 0,
							key: '',
							displayLabel: ''
						},
						searchsource: {
							id: 0,
							key: '',
							displayLabel: ''
						}
					}
				}
			};
		},
		async showError(message) {
			if (this.isLoading) {
				await this.setLoadingStatus(false);
			}
			this.$store.dispatch("toaster/show", { type: "error", message: message, time: 2500 });
		},
		async setLoadingStatus(status) {
			await this.$store.dispatch("platformData/setLoadingStatus", status);
		},
    }
}