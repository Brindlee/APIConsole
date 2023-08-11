import ApiHelper from "@/platform/js/APIHelper";
import Utils from "@/platform/js/Utils";

export default {
    data() {
        return {
            METHOD_INPUT_PARAMETERS: ApiHelper.METHOD_INPUT_PARAMETERS,
            NONE: ApiHelper.METHOD_INPUT_PARAMETERS.NONE,
            PARAMS: ApiHelper.METHOD_INPUT_PARAMETERS.PARAMS,
            PARAMS_QUERY: ApiHelper.METHOD_INPUT_PARAMETERS.PARAMS_QUERY,
            PARAMS_URL: ApiHelper.METHOD_INPUT_PARAMETERS.PARAMS_URL,
            REQ_BODY: ApiHelper.METHOD_INPUT_PARAMETERS.BODY,
            FORM_DATA: ApiHelper.METHOD_INPUT_PARAMETERS.REQ_BODY.FORM_DATA,
            X_WWW_FORM_URL_ENCODED: ApiHelper.METHOD_INPUT_PARAMETERS.REQ_BODY.X_WWW_FORM_URL_ENCODED,
            RAW: ApiHelper.METHOD_INPUT_PARAMETERS.REQ_BODY.RAW,
            RAW_JSON: ApiHelper.METHOD_INPUT_PARAMETERS.REQ_BODY_RAW.JSON
        };        
    },
    methods: {
        async getSerializedArrayFromActionVariables(actionDetails){
            var RequestInputData = actionDetails.RequestInputData;
            var emptyArray = [], emptyOrderArray = [], orderArray = [], deletedParameters = [];

            //none parameters
            var noneParameters = RequestInputData[this.NONE].parameters;
            await this.handleParameterSeparation(
                noneParameters, emptyArray, orderArray, emptyOrderArray,
                { methodsInputParameter: this.NONE }
            );

            await this.handleDeletedParameterSeparation(
                RequestInputData[this.NONE].deletedParameters, deletedParameters,
                { methodsInputParameter: this.NONE }
            );

            //url-params parameters
            var urlParameters = RequestInputData[this.PARAMS][this.PARAMS_URL].parameters;
            await this.handleParameterSeparation(
                urlParameters, emptyArray, orderArray, emptyOrderArray,
                { methodsInputParameter: this.PARAMS, SelectedType: this.PARAMS_URL }
            );

            await this.handleDeletedParameterSeparation(
                RequestInputData[this.PARAMS][this.PARAMS_URL].deletedParameters, deletedParameters,
                { methodsInputParameter: this.PARAMS, SelectedType: this.PARAMS_URL }
            );

            //query-params parameters
            var queryParameters = RequestInputData[this.PARAMS][this.PARAMS_QUERY].parameters;
            await this.handleParameterSeparation(
                queryParameters, emptyArray, orderArray, emptyOrderArray,
                { methodsInputParameter: this.PARAMS, SelectedType: this.PARAMS_QUERY }
            );

            await this.handleDeletedParameterSeparation(
                RequestInputData[this.PARAMS][this.PARAMS_QUERY].deletedParameters, deletedParameters,
                { methodsInputParameter: this.PARAMS, SelectedType: this.PARAMS_QUERY }
            );
            
            //body parameters
            let bodyParameters = [], bodyDeletedParameters = []; 
            let selectedSubType = '';
            let requestBodyData = RequestInputData[this.REQ_BODY]
            let selectedType = requestBodyData.SelectedType;
            if(selectedType == this.FORM_DATA) {
                bodyParameters = requestBodyData[this.FORM_DATA].parameters;
                bodyDeletedParameters = requestBodyData[this.FORM_DATA].deletedParameters;
            } else if(selectedType == this.X_WWW_FORM_URL_ENCODED) {
                bodyParameters = requestBodyData[this.X_WWW_FORM_URL_ENCODED].parameters;
                bodyDeletedParameters = requestBodyData[this.X_WWW_FORM_URL_ENCODED].deletedParameters;
            } else {
                selectedSubType = requestBodyData.SelectedSubType;
                let requestRawBodyData = requestBodyData[this.RAW];
                if(selectedSubType == this.RAW_JSON) {
                    bodyParameters = requestRawBodyData[this.RAW_JSON].parameters;
                    bodyDeletedParameters = requestRawBodyData[this.RAW_JSON].deletedParameters;
                }
            }

            await this.handleParameterSeparation(
                bodyParameters, emptyArray, orderArray, emptyOrderArray,
                { 
                    methodsInputParameter: this.REQ_BODY, SelectedType: selectedType,
                    SelectedSubType: selectedSubType
                }
            );

            await this.handleDeletedParameterSeparation(
                bodyDeletedParameters, deletedParameters,
                { 
                    methodsInputParameter: this.REQ_BODY, SelectedType: selectedType,
                    SelectedSubType: selectedSubType
                }
            );
            let fieldsArray = await this.initializFieldeOrdering(emptyArray, emptyOrderArray, orderArray);                
            return { fieldsArray: fieldsArray, oldDeletedParameters: deletedParameters };
        },
        handleParameterSeparation(parameters, emptyArray, orderArray, emptyOrderArray, details) {
            for(let i = 0; i < parameters.length; i++) {
                let parameter = parameters[i];
                if(parameter.Name != '') {
                    details['Position'] = i;
                    details['IsEdited'] = false;
                    details['IndexNumber'] = -1;
                    parameter['UI_Input_Details'] = Utils.deepCopyObject(details);
                    if(parameter.Order_c != null && parameter.Order_c != '') {
                        orderArray.push(parameter);
                    } else {
                        if(parameter.ID != 0) {
                            emptyOrderArray.push(parameter);
                        } else {
                            emptyArray.push(parameter);
                        }                        
                    }
                }
            }
        },
        handleDeletedParameterSeparation(parameters, deletedParameters, details) {
            for(let i = 0; i < parameters.length; i++) {
                let parameter = parameters[i];
                if(parameter.ID != 0) {
                    details['Position'] = i;
                    details['IsEdited'] = false;
                    details['IndexNumber'] = -1;
                    parameter['UI_Input_Details'] = Utils.deepCopyObject(details);
                    deletedParameters.push(parameter);
                }
            }
        },
        initializFieldeOrdering(emptyArray, emptyOrderArray, orderArray) {
            orderArray.sort((a, b) => parseInt(a.Order_c) - parseInt(b.Order_c));
            
            let orderCounter = 0;
            if(orderArray.length > 0) {
                let orderArrayLastItemValue = orderArray[(orderArray.length - 1)].Order_c;
                if(typeof(orderArrayLastItemValue) != 'undefined') {
                    orderCounter = parseInt(orderArrayLastItemValue);
                }
            }
            
            emptyOrderArray.sort((a, b) => parseInt(a.ID) - parseInt(b.ID));

            emptyOrderArray.forEach(function(item){
                orderCounter++;
                item.Order_c = orderCounter;
                item.UI_Input_Details.IsEdited = true;
            });
                        
            emptyArray.forEach(function(item){
                orderCounter++;
                item.Order_c = orderCounter;
                item.UI_Input_Details.IsEdited = true;
            });

            let finalArray = (orderArray.concat(emptyOrderArray)).concat(emptyArray);
            for(let i = 0; i < finalArray.length; i++) {
                finalArray[i].UI_Input_Details.IndexNumber = i;
            }
            
            return finalArray;
        },
        async mapInputFieldsWithPlacements(updatedFieldsArray, deletedParameters, appAction){
            var RequestInputData = appAction.RequestInputData;
            for(let i = 0 ; i < updatedFieldsArray.length; i++) {
                if(updatedFieldsArray[i].UI_Input_Details.IsEdited) {
                    let updatedParameter = updatedFieldsArray[i];
                    await this.mapUpdatedParameterValuesToInputField(updatedParameter, RequestInputData);
                }
            }

            for(let i = 0 ; i < deletedParameters.length; i++) {
                let deletedParameter = deletedParameters[i];
                await this.syncDeletedParameterWithPlacements(deletedParameter, RequestInputData);
            }
        },
        async syncDeletedParameterWithPlacements(deletedParameter, RequestInputData) {
            let methodsInputParameter = deletedParameter.UI_Input_Details.methodsInputParameter;
            //let IndexPosition = deletedParameter.UI_Input_Details.Position;

            if(methodsInputParameter == this.NONE) {
                let methodInputObject = RequestInputData[this.NONE]; 
                await this.manageDeleteFieldFromRequestInputData(methodInputObject, deletedParameter);                
            } else if(methodsInputParameter == this.PARAMS) {
                let selectedType = deletedParameter.UI_Input_Details.SelectedType;

                if(selectedType == this.PARAMS_QUERY) {
                    let methodInputObject = RequestInputData[this.PARAMS][this.PARAMS_QUERY];
                    await this.manageDeleteFieldFromRequestInputData(methodInputObject, deletedParameter);
                } else {
                    let methodInputObject = RequestInputData[this.PARAMS][this.PARAMS_URL];
                    await this.manageDeleteFieldFromRequestInputData(methodInputObject, deletedParameter);
                }
            } else if(methodsInputParameter == this.REQ_BODY) {
                let requestBodyData = RequestInputData[this.REQ_BODY];
                let selectedType = deletedParameter.UI_Input_Details.SelectedType;
                if(selectedType == this.FORM_DATA) {
                    let methodInputObject = requestBodyData[this.FORM_DATA];
                    await this.manageDeleteFieldFromRequestInputData(methodInputObject, deletedParameter);
                } else if(selectedType == this.X_WWW_FORM_URL_ENCODED) {
                    let methodInputObject = requestBodyData[this.X_WWW_FORM_URL_ENCODED];
                    await this.manageDeleteFieldFromRequestInputData(methodInputObject, deletedParameter);
                } else {
                    let selectedSubType = deletedParameter.UI_Input_Details.SelectedSubType;
                    let requestRawBodyData = requestBodyData[this.RAW];
                    if(selectedSubType == this.RAW_JSON) {
                        let methodInputObject = requestRawBodyData[this.RAW_JSON];
                        await this.manageDeleteFieldFromRequestInputData(methodInputObject, deletedParameter);
                    }
                }
            }
        },        
        manageDeleteFieldFromRequestInputData(methodInputObject, deletedParameter) {
            let key = ''
            if(deletedParameter.ID > 0) {
                key = 'ID';
            } else {
                key = 'Name';
            }
            if(key != '') {
                let parameters = methodInputObject.parameters;
                for(let i = 0; i < parameters.length; i++) {
                    if(parameters[i][key] == deletedParameter[key]) {
                        let parameter = parameters[i];
                        if (parameter.ID > 0) {
                            methodInputObject.deletedParameters.push(Utils.deepCopyObject(parameter));
                        }                
                        methodInputObject.parameters.splice(i, 1);
                        break;
                    }
                }
            }
        },
        mapUpdatedParameterValuesToInputField(updatedParameter, RequestInputData) {
            let methodsInputParameter = updatedParameter.UI_Input_Details.methodsInputParameter;
            let IndexPosition = updatedParameter.UI_Input_Details.Position;

            if(methodsInputParameter == this.NONE) {
                //RequestInputData[this.NONE].parameters.splice(IndexPosition, 1, this.deleteNotRequiredKeys(updatedParameter));
                let parameter = RequestInputData[this.NONE].parameters[IndexPosition];
                this.mapInpuFieldWithUpdatedData(parameter, updatedParameter);
            } else if(methodsInputParameter == this.PARAMS) {    
                let selectedType = updatedParameter.UI_Input_Details.SelectedType;
                if(selectedType == this.PARAMS_QUERY) {
                    let parameter = RequestInputData[this.PARAMS][this.PARAMS_QUERY].parameters[IndexPosition];
                    this.mapInpuFieldWithUpdatedData(parameter, updatedParameter);
                } else {
                    let parameter =  RequestInputData[this.PARAMS][this.PARAMS_URL].parameters[IndexPosition];
                    this.mapInpuFieldWithUpdatedData(parameter, updatedParameter);
                }
            } else if(methodsInputParameter == this.REQ_BODY) {
                let requestBodyData = RequestInputData[this.REQ_BODY];
                let selectedType = updatedParameter.UI_Input_Details.SelectedType;
                if(selectedType == this.FORM_DATA) {
                    let parameter = requestBodyData[this.FORM_DATA].parameters[IndexPosition];
                    this.mapInpuFieldWithUpdatedData(parameter, updatedParameter);
                } else if(selectedType == this.X_WWW_FORM_URL_ENCODED) {
                    let parameter = requestBodyData[this.X_WWW_FORM_URL_ENCODED].parameters[IndexPosition];
                    this.mapInpuFieldWithUpdatedData(parameter, updatedParameter);
                } else {
                    let selectedSubType = updatedParameter.UI_Input_Details.SelectedSubType;
                    let requestRawBodyData = requestBodyData[this.RAW];
                    if(selectedSubType == this.RAW_JSON) {
                        let parameter = requestRawBodyData[this.RAW_JSON].parameters[IndexPosition];
                        this.mapInpuFieldWithUpdatedData(parameter, updatedParameter);
                    }
                }
            }
        },
        mapInpuFieldWithUpdatedData(parameter, updatedParameter) {
            parameter.SampleValue_c = updatedParameter.SampleValue_c;
            parameter.Label_c = updatedParameter.Label_c;            
            parameter.Type_c = updatedParameter.Type_c;
            parameter.ParentKey_c = updatedParameter.ParentKey_c;
            parameter.SupportsRefreshFields_c = updatedParameter.SupportsRefreshFields_c;
            parameter.IsRequired_c = updatedParameter.IsRequired_c;
            parameter.IsRecordIdentifier_c = updatedParameter.IsRecordIdentifier_c;
            parameter.ShowDescriptionAboveField_c = updatedParameter.ShowDescriptionAboveField_c;
            parameter.Order_c = updatedParameter.Order_c;
            parameter.UI_Variables = updatedParameter.UI_Variables;
            if(!parameter.UI_Variables.IsEdited) {
                parameter.UI_Variables.IsEdited = true;
            }
        },
        deleteNotRequiredKeys(parameter) {
            var field = Utils.deepCopyObject(parameter);
            delete field.UI_Input_Details
            return field;
        }
    }
}