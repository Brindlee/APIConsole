export default {
    methods: {
		iterateOverJsonArray(jsonData, prependString) {
			for (let i = 0; i < jsonData.length; i++) {
				let item = jsonData[i];
				this.validateRecordContainerData(item, prependString);
			}
		},
		validateRecordContainerData(jsonData, prependString) {
			if (this.isArray(jsonData)) {
				//data in array format
				if (jsonData.length > 0) {
					this.iterateOverJsonArray(jsonData, prependString);
				}
			} else {
				if (this.isObject(jsonData)) {
					//data in object format
					this.generateOutputVariables(jsonData, prependString);
				}
			}
		},
		async generateOutputVariables(object, parentObjectKey) {
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
					parentKey: parentObjectKey
				}

				if (parameterValue != undefined & parameterValue != null) {
					if (typeof (parameterValue) == 'object') {
						if (this.isArray(parameterValue)) {
							if (parameterValue.length > 0) {
								//this.iterateOverJsonArray(parameterValue, key);
							}
						} else {
							this.generateOutputVariables(parameterValue, nameWithParentObjectKey)
						}
					} else {
						let fieldType = this.getFieldTypeFromValue(parameterValue);
						details.fieldType = fieldType;
						this.setInputParameterData(details);
					}
				} else {
					this.setInputParameterData(details);
				}
			}
		},
		setInputParameterData(details) {
			let inputParameters = this.appAction.RequestInputData[this.METHOD_INPUT_PARAMETERS.BODY][this.METHOD_INPUT_PARAMETERS.REQ_BODY.RAW][this.METHOD_INPUT_PARAMETERS.REQ_BODY_RAW.JSON].parameters;
			
			let parameter = this.getInputParameterByKey(details, inputParameters);
			
			if (parameter) {
				//update parameter data
				parameter.Type_c = details.fieldType;
				parameter.SampleValue_c = details.parameterValue;
				parameter.UI_Variables.IsEdited = true;
			} else {
				//add parameter
				let newParameter = this.getEmptyFieldInputRecord('Body', this.appAction);
				newParameter.Name = details.name;
				newParameter.Label_c = this.geneateFieldLabel(details.name);
				newParameter.Type_c = details.fieldType;
				//newParameter.ParentKey_c = details.parentKey;
				newParameter.SampleValue_c = details.parameterValue;
				inputParameters.push(newParameter);
			}
		},
		getFieldTypeFromValue(value) {
			if (value != undefined && value != null) {
				if (!isNaN(value)) {
					if (typeof (value) === "boolean") {
						return this.ACTION_VARIABLE_TYPES.BOOLEAN;
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
							return this.ACTION_VARIABLE_TYPES.DATE;
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
		getInputParameterByKey(details, inputParameters) {
			for (let i = 0; i < inputParameters.length; i++) {
				let parameter = inputParameters[i];
				if (parameter.Name == details.name) {
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
					IsEdited: false,
					IsExpanded: false
				}
			};
		},
		isArray(value) {
			if (Array.isArray(value)) {
				return true;
			}
			return false;
		},
		isObject(value) {
			return Object.keys(value).length;
		},
    }
}