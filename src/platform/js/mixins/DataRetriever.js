import ActionParameters from "@/platform/js/mixins/ActionParameters";
import ApiHelper from "@/platform/js/APIHelper";

export default {
	mixins: [ActionParameters],
    data() {
        return {
            METHOD_INPUT_PARAMETERS: ApiHelper.METHOD_INPUT_PARAMETERS,
			METHOD_OUTPUT_PARAMETERS: ApiHelper.METHOD_OUTPUT_PARAMETERS,
			ACTION_VARIABLE_TYPES: ApiHelper.ACTION_VARIABLE_TYPES
        };
    },
	methods: {
		validateInputParameters() {
			let result = true;
			/*for (let i = 0; i < parameters.length; i++) {
				let parameter = parameters[i];

				if (parameter.Name != '') {
					if (parameter.Type_c == this.ACTION_VARIABLE_TYPES.DYNAMIC_DROPDOWN) {
						if (parameter.DynamicDropdownKey_c == '') {
							this.showError(`Dynamic search key field is required for parameter ${parameter.Name} of ${selectedType} type`);
							result = false;
							break;
						}
					}

					if (parameter.Type_c == this.ACTION_VARIABLE_TYPES.DROPDOWN) {
						if (parameter.Choices_c == '') {
							this.showError(`Choices field is required for parameter ${parameter.Name} of ${selectedType} type`);
							result = false;
							break;
						}						
					}

					if (parameter.Type_c == this.ACTION_VARIABLE_TYPES.DATE) {
						if (parameter.Date_Format_c == '') {
							this.showError(`Date format field is required for parameter ${parameter.Name} of ${selectedType} type`);
							result = false;
							break;
						}
					}

					if (selectedType == 'Header') {
						if (parameter.Name == 'Content-Type' || parameter.Name == 'Accept') {
							if (parameter.DefaultValue_c == '') {
								this.showError(`Default value field is required for parameter ${parameter.Name} of ${selectedType} type`);
								result = false;
								break;
							}
						}
					}
				}
			}*/
			return result;
		},

		validateUrlParameters(appAction) {
			let parameters = appAction.RequestInputData[this.METHOD_INPUT_PARAMETERS.PARAMS][this.METHOD_INPUT_PARAMETERS.PARAMS_URL].parameters;
			return this.validateInputParameters(parameters, 'Url');
		},

		validateQueryParameters(appAction) {
			let parameters = appAction.RequestInputData[this.METHOD_INPUT_PARAMETERS.PARAMS][this.METHOD_INPUT_PARAMETERS.PARAMS_QUERY].parameters;
			return this.validateInputParameters(parameters, 'Query');
		},

		validateHeaderParameters(appAction) {
			let parameters = appAction.RequestInputData[this.METHOD_INPUT_PARAMETERS.HEADERS].parameters;
			return this.validateInputParameters(parameters, 'Header');
		},

		validateBodyFormDataParameters(appAction) {
			let parameters = appAction.RequestInputData[this.METHOD_INPUT_PARAMETERS.BODY][this.METHOD_INPUT_PARAMETERS.REQ_BODY.FORM_DATA].parameters;
			return this.validateInputParameters(parameters, 'Body');
		},

		validateBodyXWwwUrlEncodedParameters(appAction) {
			let parameters = appAction.RequestInputData[this.METHOD_INPUT_PARAMETERS.BODY][this.METHOD_INPUT_PARAMETERS.REQ_BODY.X_WWW_FORM_URL_ENCODED].parameters;
			return this.validateInputParameters(parameters, 'Body');
		},

		validateBodyRawJsonParameters(appAction) {
			let parameters = appAction.RequestInputData[this.METHOD_INPUT_PARAMETERS.BODY][this.METHOD_INPUT_PARAMETERS.REQ_BODY.RAW][this.METHOD_INPUT_PARAMETERS.REQ_BODY_RAW.JSON].parameters;
			return this.validateInputParameters(parameters, 'Body');
		},

		validateNoneParameters(appAction) {
			let parameters = appAction.RequestInputData[this.METHOD_INPUT_PARAMETERS.NONE].parameters;
			return this.validateInputParameters(parameters, 'None');
		},

		validateAllInputTypeParameters(appAction) {
			if (this.validateUrlParameters(appAction)) {
				if (this.validateQueryParameters(appAction)) {
					if (this.validateHeaderParameters(appAction)) {
						if (this.validateBodyFormDataParameters(appAction)) {
							if (this.validateBodyXWwwUrlEncodedParameters(appAction)) {
								if (this.validateBodyRawJsonParameters(appAction)) {
									if (this.validateNoneParameters(appAction)) {
										return true;
									}
								}
							}
						}
					}
				}
			}
			return false;
		},

		validateActionDetails(appAction) {
			if (appAction.Label_c == '') {
				this.showError('Action Label is required');
			} else if (appAction.Type_c == '') {
				this.showError('Action Type is required');
			} else {
				return true;
			}
			return false;
		},
		showError(message) {
			this.$store.dispatch("toaster/show", { type: "error", message: message, time: 4000 });
		},
		retrieveActionDetails(appAction) {
			let data = null;

			if (appAction.UI_Variables.IsEdited) {
				data = {
					ActionScript_c: appAction.ActionScript_c,
					AppId_c: appAction.AppId_c,
					DelegateActionId_c: appAction.DelegateActionId_c,
					DelegateActionLabel_c: appAction.DelegateActionLabel_c,
					Description_c: appAction.Description_c,
					Entity_c: appAction.Entity_c,
					HasDynamicFields_c: appAction.HasDynamicFields_c,
					ID: appAction.ID,
					IsHidden_c: appAction.IsHidden_c,
					IsTestAction_c: appAction.IsTestAction_c,
					KeepAsListKey_c: appAction.KeepAsListKey_c,
					Label_c: appAction.Label_c,
					Method_c: appAction.Method_c,
					Name: appAction.Name,
					Operation_Type_c: appAction.Operation_Type_c,
					PollingDelegateActionId_c: appAction.PollingDelegateActionId_c,
					RecordIdentifierKey_c: appAction.RecordIdentifierKey_c,
					Record_NameKey_c: appAction.Record_NameKey_c,
					RecordsContainerKey_c: appAction.RecordsContainerKey_c,
					ResourceDelegateActionId_c: appAction.ResourceDelegateActionId_c,
					StepDescription_c: appAction.StepDescription_c,
					TestRecordDescription_c: appAction.TestRecordDescription_c,
					SupportsWebhookSubscription_c: appAction.SupportsWebhookSubscription_c,
					Tag: appAction.Tag,
					Type_c: appAction.Type_c,
					Url_c: appAction.Url_c,
					WebhookUrlPasteLink_c: appAction.WebhookUrlPasteLink_c,
					Webhook_Description_c: appAction.Webhook_Description_c,
					Webhook_Event_c: appAction.Webhook_Event_c
				};
			}
			return data;
		},

		async retrieveActionVariablesData(appAction) {
			let data = [];

			//inputs
			await this.initiateParamsSection(data, appAction);
			await this.initiateHeadersSection(data, appAction);
			await this.initiateBodySection(data, appAction);
			await this.initiateNoneSection(data, appAction);

			//outputs
			await this.initiateRespBodySection(data, appAction);

			return data;
		},

		async initiateParamsSection(data, appAction) {
			await this.initiateUrlParamsSection(data, appAction);
			await this.initiateQueryParamsSection(data, appAction);
		},

		initiateUrlParamsSection(data, appAction) {
			let Records = this.createURLParameterRecords(appAction);
			if (Records) {
				data.push({ Records: Records, SelectedType: this.METHOD_INPUT_PARAMETERS.PARAMS_URL });
			}
		},
		createURLParameterRecords(appAction) {
			let methodObject = this.getInputURLMethodObject(appAction);

			return this.createInputParamterRecords(methodObject, true);
		},
		getInputURLMethodObject(appAction) {
			return appAction.RequestInputData[this.METHOD_INPUT_PARAMETERS.PARAMS][this.METHOD_INPUT_PARAMETERS.PARAMS_URL];
		},

		initiateQueryParamsSection(data, appAction) {
			let Records = this.createQueryParameterRecords(appAction);
			if (Records) {
				data.push({ Records: Records, SelectedType: this.METHOD_INPUT_PARAMETERS.PARAMS_QUERY });
			}
		},
		createQueryParameterRecords(appAction) {
			let methodObject = this.getInputQueryMethodObject(appAction);

			return this.createInputParamterRecords(methodObject, true);
		},
		getInputQueryMethodObject(appAction) {
			return appAction.RequestInputData[this.METHOD_INPUT_PARAMETERS.PARAMS][this.METHOD_INPUT_PARAMETERS.PARAMS_QUERY];
		},

		initiateHeadersSection(data, appAction) {
			let Records = this.createHeaderParameterRecords(appAction);
			if (Records) {
				data.push({ Records: Records, SelectedType: this.METHOD_INPUT_PARAMETERS.HEADERS });
			}
		},
		createHeaderParameterRecords(appAction) {
			let methodObject = this.getInputHeaderMethodObject(appAction);

			return this.createInputParamterRecords(methodObject, true);
		},
		getInputHeaderMethodObject(appAction) {
			return appAction.RequestInputData[this.METHOD_INPUT_PARAMETERS.HEADERS];
		},

		async initiateBodySection(data, appAction) {
			await this.initiateFormDataSection(data, appAction);
			await this.initiateXWwwUrlEncodedSection(data, appAction);
			await this.initiateRawBodySection(data, appAction);
		},

		initiateFormDataSection(data, appAction) {
			let Records = this.createFormDataParameterRecords(appAction);
			if (Records) {
				data.push({ Records: Records, SelectedType: this.METHOD_INPUT_PARAMETERS.REQ_BODY.FORM_DATA });
			}
		},
		createFormDataParameterRecords(appAction) {
			let methodObject = this.getInputFormDataMethodObject(appAction);

			return this.createInputParamterRecords(methodObject, true);
		},
		getInputFormDataMethodObject(appAction) {
			return appAction.RequestInputData[this.METHOD_INPUT_PARAMETERS.BODY][this.METHOD_INPUT_PARAMETERS.REQ_BODY.FORM_DATA];
		},

		initiateXWwwUrlEncodedSection(data, appAction) {
			let Records = this.createXWwwUrlEncodedParameterRecords(appAction);
			if (Records) {
				data.push({ Records: Records, SelectedType: this.METHOD_INPUT_PARAMETERS.REQ_BODY.X_WWW_FORM_URL_ENCODED });
			}
		},
		createXWwwUrlEncodedParameterRecords(appAction) {
			let methodObject = this.getInputXWwwUrlEncodedMethodObject(appAction);

			return this.createInputParamterRecords(methodObject, true);
		},
		getInputXWwwUrlEncodedMethodObject(appAction) {
			return appAction.RequestInputData[this.METHOD_INPUT_PARAMETERS.BODY][this.METHOD_INPUT_PARAMETERS.REQ_BODY.X_WWW_FORM_URL_ENCODED];
		},

		async initiateRawBodySection(data, appAction) {
			await this.initiateRawBodyJsonSection(data, appAction);
		},

		initiateRawBodyJsonSection(data, appAction) {
			let Records = this.createRawJsonParameterRecords(appAction);
			if (Records) {
				data.push({
					Records: Records,
					SelectedType: this.METHOD_INPUT_PARAMETERS.REQ_BODY.RAW,
					SelectedSubType: this.METHOD_INPUT_PARAMETERS.REQ_BODY_RAW.JSON
				});
			}
		},
		createRawJsonParameterRecords(appAction) {
			let methodObject = this.getInputRawJsonMethodObject(appAction);

			return this.createInputParamterRecords(methodObject, true);
		},
		getInputRawJsonMethodObject(appAction) {
			return appAction.RequestInputData[this.METHOD_INPUT_PARAMETERS.BODY][this.METHOD_INPUT_PARAMETERS.REQ_BODY.RAW][this.METHOD_INPUT_PARAMETERS.REQ_BODY_RAW.JSON];
		},

		initiateNoneSection(data, appAction) {
			let Records = this.createNoneParameterRecords(appAction);
			if (Records) {
				data.push({ Records: Records, SelectedType: this.METHOD_INPUT_PARAMETERS.NONE });
			}
		},
		createNoneParameterRecords(appAction) {
			let methodObject = this.getInputNoneMethodObject(appAction);

			return this.createInputParamterRecords(methodObject, true);
		},
		getInputNoneMethodObject(appAction) {
			return appAction.RequestInputData[this.METHOD_INPUT_PARAMETERS.NONE];
		},

		initiateRespBodySection(data, appAction) {
			let Records = this.createResponseBodyParameterRecords(appAction);
			if (Records) {
				data.push({ Records: Records, SelectedType: this.METHOD_OUTPUT_PARAMETERS.RESP_BODY });
			}
		},
		createResponseBodyParameterRecords(appAction) {
			let methodObject = appAction.ResponseOutputData[this.METHOD_OUTPUT_PARAMETERS.RESP_BODY];

			return this.createInputParamterRecords(methodObject, true);
		},

		checkIfAnyInputParameterIsUnsaved(appAction, selectedTypes) {
			let SelectedType = selectedTypes.SelectedType;

			//url
			if (this.checkIfAnyURLParamInputParameterIsUnsaved(appAction, SelectedType)) {				
				return;
			}

			//query
			if (this.checkIfAnyQueryParamInputParameterIsUnsaved(appAction, SelectedType)) {
				return;
			}

			//header
			if (this.checkIfAnyHeaderInputParameterIsUnsaved(appAction, SelectedType)) {
				return;
			}

			//body
			if (this.checkIfAnyBodyInputParameterIsUnsaved(appAction, SelectedType, selectedTypes)) {
				return;
			}

			//none
			if (this.checkIfAnyNoneInputParameterIsUnsaved(appAction, SelectedType)) {
				return;
			}

			//no unsaved input found
			appAction.UI_Variables.IsInputParameterEdited = false;
		},
		checkIfAnyNoneInputParameterIsUnsaved(appAction, SelectedType) {
			if (SelectedType !== this.METHOD_INPUT_PARAMETERS.NONE) {
				let methodObject = this.getInputNoneMethodObject(appAction);
				if (this.isAnyInputParameterEditedOrRemainingToDelete(methodObject)) {
					return true;
				}
			}
			return false;
		},
		checkIfAnyBodyInputParameterIsUnsaved(appAction, SelectedType, selectedTypes) {
			//formdata
			if (this.checkIfAnyFormDataBodyInputParameterIsUnsaved(appAction, SelectedType)) {
				return true;
			}

			//x-www-url-encoded
			if (this.checkIfAnyXWwwUrlEncodedBodyInputParameterIsUnsaved(appAction, SelectedType)) {
				return true;
			}

			let SelectedSubType = selectedTypes.SelectedSubType;
			//raw
			if (this.checkIfAnyRawBodyInputParameterIsUnsaved(appAction, SelectedType, SelectedSubType)) {
				return true;
			}

			return false;
		},
		checkIfAnyRawBodyInputParameterIsUnsaved(appAction, SelectedType, SelectedSubType) {
			if (SelectedType !== this.METHOD_INPUT_PARAMETERS.REQ_BODY.RAW) {
				if (SelectedSubType !== this.METHOD_INPUT_PARAMETERS.REQ_BODY_RAW.JSON) {
					let methodObject = this.getInputRawJsonMethodObject(appAction);
					if (this.isAnyInputParameterEditedOrRemainingToDelete(methodObject)) {
						return true;
					}
				}				
			}
			return false;
		},
		checkIfAnyXWwwUrlEncodedBodyInputParameterIsUnsaved(appAction, SelectedType) {
			if (SelectedType !== this.METHOD_INPUT_PARAMETERS.REQ_BODY.X_WWW_FORM_URL_ENCODED) {
				let methodObject = this.getInputXWwwUrlEncodedMethodObject(appAction);
				if (this.isAnyInputParameterEditedOrRemainingToDelete(methodObject)) {
					return true;
				}
			}
			return false;
		},
		checkIfAnyFormDataBodyInputParameterIsUnsaved(appAction, SelectedType) {
			if (SelectedType !== this.METHOD_INPUT_PARAMETERS.REQ_BODY.FORM_DATA) {
				let methodObject = this.getInputFormDataMethodObject(appAction);
				if (this.isAnyInputParameterEditedOrRemainingToDelete(methodObject)) {
					return true;
				}
			}
			return false;
		},
		checkIfAnyHeaderInputParameterIsUnsaved(appAction, SelectedType) {
			if (SelectedType !== this.METHOD_INPUT_PARAMETERS.HEADERS) {
				let methodObject = this.getInputHeaderMethodObject(appAction);
				if (this.isAnyInputParameterEditedOrRemainingToDelete(methodObject)) {
					return true;
				}
			}
			return false;
		},
		checkIfAnyURLParamInputParameterIsUnsaved(appAction, SelectedType) {
			if (SelectedType !== this.METHOD_INPUT_PARAMETERS.PARAMS_URL) {
				let methodObject = this.getInputURLMethodObject(appAction);
				if (this.isAnyInputParameterEditedOrRemainingToDelete(methodObject)) {
					return true;
				}
			}
			return false;
		},
		checkIfAnyQueryParamInputParameterIsUnsaved(appAction, SelectedType) {
			if (SelectedType !== this.METHOD_INPUT_PARAMETERS.PARAMS_QUERY) {
				let methodObject = this.getInputQueryMethodObject(appAction);
				if (this.isAnyInputParameterEditedOrRemainingToDelete(methodObject)) {
					return true;
				}
			}
			return false;
		},
		isAnyInputParameterEditedOrRemainingToDelete(methodObject) {
			let isEdited = false;
			if (methodObject != null) {
				let parameters = methodObject.parameters;
				let deletedParameters = methodObject.deletedParameters;
				if (deletedParameters && deletedParameters.length == 0) {
					for (let i = 0; i < parameters.length; i++) {
						let parameter = parameters[i];
						if (parameter.UI_Variables.IsEdited) {
							isEdited = true;
							break;
						}
					}
				}
			}			
			return isEdited;
		}
    }
}