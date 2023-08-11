import Utils from '@/platform/js/Utils';

export default {
    methods: {
		createInputParamterRecords(methodObject, shouldSkipValidation) {
			let parameters = methodObject.parameters;
			let deletedURLParameters = methodObject.deletedParameters;
			let deletedParameters = Utils.deepCopyObject(deletedURLParameters);
			let Records = {
				Create: { Parameters: [], Positions: [] },
				Update: { Parameters: [], Positions: [] },
				Delete: { Parameters: [] }
			}

			for (let i = 0; i < parameters.length; i++) {
				let parameter = parameters[i];

				if (parameter.Name != '') {
					if (parameter.ID == 0) {						
						let deletedParameter = this.getNewlyAddedParameterFromDeletedParameterIfPresent(parameter, deletedParameters);
						
						if (deletedParameter.parameter) {
							parameter.ID = deletedParameter.parameter.ID;							
							Records.Update.Parameters.push(parameter);
							Records.Update.Positions.push(i);
							deletedParameters.splice(deletedParameter.index, 1);
						} else {
							Records.Create.Parameters.push(parameter);
							Records.Create.Positions.push(i);
						}
					} else {
						if (parameter.UI_Variables.IsEdited) {
							Records.Update.Parameters.push(parameter);
							Records.Update.Positions.push(i);
						}
					}
				}
			}

			Records.Delete.Parameters = deletedParameters;

			if (Records.Create.Parameters.length == 0
				&& Records.Update.Parameters.length == 0
				&& Records.Delete.Parameters.length == 0) {
				if (!(typeof shouldSkipValidation != 'undefined' && shouldSkipValidation)) {
					this.showWarning('You have not made any changes in this section yet');
				}
				return null;
			} else {
				return Records;
			}			
		},
		getNewlyAddedParameterFromDeletedParameterIfPresent(parameter, deletedParameters) {
			for (let i = 0; i < deletedParameters.length; i++) {
				let deletedParameter = deletedParameters[i];
				if (deletedParameter.Name == parameter.Name) {
					return {
						index: i,
						parameter: deletedParameter
					};
				}
			}
			return {
				index: -1,
				parameter: null
			};
		},
		updateUIParametersData(methodObject, item) {
			let ProccessedRecords = item.ProccessedRecords;
			let OldRecords = item.Records;

			if (ProccessedRecords.Create.Parameters.length > 0) {
				let createParameters = ProccessedRecords.Create.Parameters;				
				let createPositions = OldRecords.Create.Positions;

				let parameters = methodObject.parameters;
				for (let i = 0; i < createPositions.length; i++) {
					let index = createPositions[i];
					let createParameter = createParameters[i];
					if (!createParameter.error.isError) {
						let parameter = parameters[index];
						/*if (createParameter.Name == parameter.Name
							&& createParameter.Type_c == parameter.Type_c
							&& createParameter.Direction_c == parameter.Direction_c
							&& createParameter.Placement_c == parameter.Placement_c) {
							parameter.ID = createParameter.ID;
						}*/
						parameter.ID = createParameter.ID;
						parameter.UI_Variables.IsEdited = false;
					}
				}

			}

			if (ProccessedRecords.Update.Parameters.length > 0) {
				let updateParameters = ProccessedRecords.Update.Parameters;
				let updatePositions = OldRecords.Update.Positions;

				let parameters = methodObject.parameters;
				for (let i = 0; i < updatePositions.length; i++) {
					let index = updatePositions[i];
					let updateParameter = updateParameters[i];
					if (!updateParameter.error.isError) {
						let parameter = parameters[index];
						/*if (updateParameter.ID == parameter.ID) {
							
						}*/
						parameter.UI_Variables.IsEdited = false;
					}
				}
			}

			//if (ProccessedRecords.Delete.Parameters.length > 0) {
				methodObject.deletedParameters = [];
			//}
		},

		async updateAllActionVariablesActionId(action) {
			let methodObjectParamUrl = this.appAction.RequestInputData[this.METHOD_INPUT_PARAMETERS.PARAMS][this.METHOD_INPUT_PARAMETERS.PARAMS_URL];
			await this.updateParameterAppActionDetails(methodObjectParamUrl, action);

			let methodObjectParamsQuery = this.appAction.RequestInputData[this.METHOD_INPUT_PARAMETERS.PARAMS][this.METHOD_INPUT_PARAMETERS.PARAMS_QUERY];
			await this.updateParameterAppActionDetails(methodObjectParamsQuery, action);

			let methodObjectHeaders = this.appAction.RequestInputData[this.METHOD_INPUT_PARAMETERS.HEADERS];
			await this.updateParameterAppActionDetails(methodObjectHeaders, action);

			let methodObjectFormData = this.appAction.RequestInputData[this.METHOD_INPUT_PARAMETERS.BODY][this.METHOD_INPUT_PARAMETERS.REQ_BODY.FORM_DATA];
			await this.updateParameterAppActionDetails(methodObjectFormData, action);

			let methodObjectXWwwUrlEncoded = this.appAction.RequestInputData[this.METHOD_INPUT_PARAMETERS.BODY][this.METHOD_INPUT_PARAMETERS.REQ_BODY.X_WWW_FORM_URL_ENCODED];
			await this.updateParameterAppActionDetails(methodObjectXWwwUrlEncoded, action);

			let methodObjectRawJsonBody = this.appAction.RequestInputData[this.METHOD_INPUT_PARAMETERS.BODY][this.METHOD_INPUT_PARAMETERS.REQ_BODY.RAW][this.METHOD_INPUT_PARAMETERS.REQ_BODY_RAW.JSON]
			await this.updateParameterAppActionDetails(methodObjectRawJsonBody, action);

			let methodObjectNone = this.appAction.RequestInputData[this.METHOD_INPUT_PARAMETERS.NONE];
			await this.updateParameterAppActionDetails(methodObjectNone, action);

			let methodObjectRespBody = this.appAction.ResponseOutputData[this.METHOD_OUTPUT_PARAMETERS.RESP_BODY];
			await this.updateParameterAppActionDetails(methodObjectRespBody, action);
		},

		updateParameterAppActionDetails(methodObject, action) {
			let parameters = methodObject.parameters;
			for (let i = 0; i < parameters.length; i++) {
				let parameter = parameters[i];
				parameter.ActionId_c.ID = action.ID;
				parameter.ActionId_c.Name = action.Name;
			}
		},

		showWarning(message) {
			this.$store.dispatch("toaster/show", { type: "warning", message: message, time: 2000 });
		}
    }
}