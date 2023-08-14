import RequestType from "@/platform/components/APIConsole/RequestType/RequestType.vue";
import ResponseType from "@/platform/components/APIConsole/ResponseType/ResponseType.vue";
//import OrderVariables from "@/platform/components/OrderVariables/OrderVariables.vue";
import Constants from "@/platform/js/Constants";
import ApiHelper from "@/platform/js/APIHelper";
import platformAPI from '@/platform/js/api/platformAPI';
import Utils from "@/platform/js/Utils";
import DataRetriever from "@/platform/js/mixins/DataRetriever";

//import { CURLParser } from 'parse-curl-js';
import CURLParser from "@/js/CurlParser";

export default {
    name: "APIConsole",
    mixins: [DataRetriever],
    components: {
        RequestType,
        ResponseType,
        //OrderVariables
    },
    props: {
        tabType: String,
        app: Object,
        appAction: Object
    },
    data: function() {
        return {
            TriggerKeys: Constants.TriggerKeys,
            HTTP_METHODS: ApiHelper.HTTP_METHODS,
            METHOD_INPUT_PARAMETERS: ApiHelper.METHOD_INPUT_PARAMETERS,
            METHOD_OUTPUT_PARAMETERS: ApiHelper.METHOD_OUTPUT_PARAMETERS,
            AUTHENTICATION_TYPES: ApiHelper.AUTHENTICATION_TYPES,
            //showOrderingModal: false,
            curlTab: "fill",
            curlRawData: "",
            parsedCurlData: {},
        };
    },
    computed: {
        shouldDisableSendButton() {
            /*if (this.appAction.Url_c == '') {
                return true;
            }*/
            return false;
        },
        selectedAppId() {
            return this.$store.getters["platformData/selectedAppId"];
        },
        isOAuthType() {
            let type = this.app.AuthType_c;
            if (type == this.AUTHENTICATION_TYPES.OAUTH_1 ||
                type == this.AUTHENTICATION_TYPES.OAUTH_2 ||
                type == this.AUTHENTICATION_TYPES.OAUTH_2_PKCE) {
                return true;
            }
            return false;
        }
    },
    async mounted() {
        /*let action = this.createNewActionCustom();
        console.log( 'action: ', action, this.props );
        this.props.appAction = action;*/
    },
    methods: {
        appActionURLChanged() {
            var self = this;

            let url = this.appAction.Url_c;
            let index = url.indexOf('?');
            if (index != -1) {
                if (url.length > (index + 1)) {
                    let queryString = url.substring(index + 1);
                    let queryParams = queryString.split('&');

                    let paramIndices = [];
                    for (let i = 0; i < queryParams.length; i++) {
                        let param = queryParams[i];
                        let paramIndex = param.indexOf('=');
                        if (paramIndex != -1) {
                            let key = param.substring(0, paramIndex);
                            let value = param.substring(paramIndex + 1, param.length);

                            let checkQueryParam = false;
                            if (value.includes == '{{' && value.includes == '}}') {
                                //check if this value present in URL params as a key
                                checkQueryParam = !(self.isURLParamPresentByKey(value));
                            } else {
                                checkQueryParam = true;
                            }

                            if (checkQueryParam) {
                                let paramter = self.getQueryParamPresentByKey(key);
                                if (paramter) {
                                    paramIndices.push(paramter.ID);
                                    paramter.SampleValue_c = value;
                                }
                            }

                            if (paramIndices.length > 0) {
                                let remaingFields = [];
                                let parameters = self.appAction.RequestInputData.Params.Query.parameters;
                                for (let i = 0; i < parameters.length; i++) {
                                    if (paramIndices.indexOf(parameters[i].ID) == -1) {
                                        remaingFields.push(i);
                                    }
                                }

                                for (let i = remaingFields.length - 1; i >= 0; i--) {
                                    parameters.splice(remaingFields[remaingFields[i]]);
                                }

                            }
                        }
                    }
                }
            }
            //let queryParams = 
        },
        isURLParamPresentByKey(key) {
            let result = false;
            let parameters = this.appAction.RequestInputData.Params.Url.parameters;
            for (let i = 0; i < parameters.length; i++) {
                let parameter = parameters[i];
                if (parameter.Name == key) {
                    result = true;
                    break;
                }
            }
            return result;
        },
        getQueryParamPresentByKey(key) {
            let parameters = this.appAction.RequestInputData.Params.Query.parameters;
            for (let i = 0; i < parameters.length; i++) {
                let parameter = parameters[i];
                if (parameter.Name == key) {
                    return parameter;
                }
            }
            return null;
        },
        isKeyPresentAndNotEmpty(key) {
            if (key && key != '') {
                return true;
            }
            return false;
        },
        isValuePresent(value) {
            if (value != undefined && value != null) {
                return true;
            }
            return false;
        },
        getKeyValuePairObject(parameters, isAuthentication) {
            let object = {};
            if (parameters.length > 0) {
                for (let i = 0; i < parameters.length; i++) {
                    let paramter = parameters[i];
                    if (paramter.UI_Variables.IsSelected) {
                        let nameKey = this.isKeyPresentAndNotEmpty(paramter.Name);
                        let sampleValue = this.isValuePresent((isAuthentication) ? paramter.UI_Variables.SampleValue : paramter.SampleValue_c);
                        if (nameKey && sampleValue) {
                            object[paramter.Name] = (isAuthentication) ? paramter.UI_Variables.SampleValue : paramter.SampleValue_c;
                        }
                    }
                }
            }
            return object;
        },
        getBodyKeyValuePairObject(parameters) {
            let object = {};
            if (parameters.length > 0) {
                for (let i = 0; i < parameters.length; i++) {
                    let paramter = parameters[i];
                    if (paramter.UI_Variables.IsSelected) {
                        let nameKey = this.isKeyPresentAndNotEmpty(paramter.Name);
                        let sampleValue = this.isValuePresent(paramter.SampleValue_c);
                        if (nameKey && sampleValue) {
                            if (paramter.ParentKey_c != '') {
                                let lineItemKey = paramter.ParentKey_c + '|' + paramter.Name;
                                object[lineItemKey] = paramter.SampleValue_c;
                            } else {
                                object[paramter.Name] = paramter.SampleValue_c;
                            }
                        }
                    }
                }
            }
            return object;
        },
        initializeValidationOld() {
            let queryParameters = this.appAction.RequestInputData.Params.Query.parameters;
            let queryParams = this.getKeyValuePairObject(queryParameters);

            let headerParameters = this.appAction.RequestInputData.Headers.parameters;
            let headers = this.getKeyValuePairObject(headerParameters);

            let bodyParamters = [];
            let bodyParams = {};
            let isRaw = false;
            //let payloadType = '';
            if (this.appAction.RequestInputData.methodsInputParameter == this.METHOD_INPUT_PARAMETERS.BODY) {
                let selectedType = this.appAction.RequestInputData.ReqBody.SelectedType;
                if (selectedType == this.METHOD_INPUT_PARAMETERS.REQ_BODY.FORM_DATA) {
                    bodyParamters = this.appAction.RequestInputData.ReqBody[this.METHOD_INPUT_PARAMETERS.REQ_BODY.FORM_DATA].parameters;
                    //payloadType = 'form';
                }

                if (selectedType == this.METHOD_INPUT_PARAMETERS.REQ_BODY.X_WWW_FORM_URL_ENCODED) {
                    bodyParamters = this.appAction.RequestInputData.ReqBody[this.METHOD_INPUT_PARAMETERS.REQ_BODY.X_WWW_FORM_URL_ENCODED].parameters;
                    //payloadType = 'form';
                }

                if (selectedType == this.METHOD_INPUT_PARAMETERS.REQ_BODY.RAW) {
                    isRaw = true;
                    bodyParamters = this.appAction.RequestInputData.ReqBody[this.METHOD_INPUT_PARAMETERS.REQ_BODY.RAW][this.METHOD_INPUT_PARAMETERS.REQ_BODY_RAW.JSON].parameters;
                    //payloadType = 'json';
                }
            }

            if (isRaw) {
                bodyParams = /*JSON.parse*/ (this.appAction.RequestInputData.ReqBody[this.METHOD_INPUT_PARAMETERS.REQ_BODY.RAW][this.METHOD_INPUT_PARAMETERS.REQ_BODY_RAW.JSON].data)
            } else {
                if (bodyParamters.length > 0) {
                    for (let i = 0; i < bodyParamters.length; i++) {
                        let paramter = bodyParamters[i];
                        if (paramter.UI_Variables.IsSelected) {
                            bodyParams[paramter.Name] = paramter.SampleValue_c;
                        }
                    }
                }
                bodyParams = JSON.stringify(bodyParams);
            }

            let newURL = this.getURL();
            let request = {
                method: this.appAction.Method_c,
                url: newURL,
                queryParams: queryParams,
                headers: headers,
                data: bodyParams,
                //payloadType: payloadType
            };
            //console.log('request-params: ', request);
            this.makeHttpWebCall(request);
        },
        getURL() {
            let url = this.appAction.Url_c;
            let urlParameters = this.appAction.RequestInputData.Params.Url.parameters;

            if (urlParameters.length > 0) {
                let urlParams = this.getKeyValuePairObject(urlParameters);

                let newURL = '';
                var array = url.split(/(\{{[^}]+\}})/g);
                //let pattern = /{{(.*?)}}/;

                for (let i = 0; i < array.length; i++) {
                    let item = array[i];
                    if (item.includes('{{') && item.includes('}}')) {
                        let key = item.replace('{{', '').replace('}}', ''); //item.match(pattern);
                        if (urlParams && key && urlParams[key]) {
                            let value = urlParams[key];
                            newURL += value;
                        } else {
                            newURL += item;
                        }
                    } else {
                        newURL += item;
                    }
                }
                return newURL;
            }

            return url;
        },
        initializeValidation() {
            let queryParameters = this.appAction.RequestInputData.Params.Query.parameters;
            let queryParams = this.getKeyValuePairObject(queryParameters, false);

            let urlParameters = this.appAction.RequestInputData.Params.Url.parameters;
            let urlParams = this.getKeyValuePairObject(urlParameters, false);

            /*let headerParameters = this.appAction.RequestInputData.Headers.parameters;
            let headers = this.getKeyValuePairObject(headerParameters, false);*/

            let bodyParameters = [];

            //if (this.appAction.RequestInputData.methodsInputParameter == this.METHOD_INPUT_PARAMETERS.BODY) {
            let selectedType = this.appAction.RequestInputData.ReqBody.SelectedType;
            if (selectedType == this.METHOD_INPUT_PARAMETERS.REQ_BODY.FORM_DATA) {
                bodyParameters = this.appAction.RequestInputData.ReqBody[this.METHOD_INPUT_PARAMETERS.REQ_BODY.FORM_DATA].parameters;
            }

            if (selectedType == this.METHOD_INPUT_PARAMETERS.REQ_BODY.X_WWW_FORM_URL_ENCODED) {
                bodyParameters = this.appAction.RequestInputData.ReqBody[this.METHOD_INPUT_PARAMETERS.REQ_BODY.X_WWW_FORM_URL_ENCODED].parameters;
            }

            if (selectedType == this.METHOD_INPUT_PARAMETERS.REQ_BODY.RAW) {
                bodyParameters = this.appAction.RequestInputData.ReqBody[this.METHOD_INPUT_PARAMETERS.REQ_BODY.RAW][this.METHOD_INPUT_PARAMETERS.REQ_BODY_RAW.JSON].parameters;
            }
            //}

            let bodyParams = this.getBodyKeyValuePairObject(bodyParameters);

            let actionParams = Object.assign({}, queryParams, urlParams, bodyParams);

            let credentials = {};

            let useAppAuthentication = this.appAction.RequestInputData[this.METHOD_INPUT_PARAMETERS.AUTHENTICATION].useAppAuthentication;
            if (useAppAuthentication) {
                let authorizationParameters = this.app.authVariables.parameters;
                credentials = this.getKeyValuePairObject(authorizationParameters, true);
            }
            if (this.isOAuthType) {
                for (let i = 0; i < this.app.OAuth.parameters.length; i++) {
                    let parameter = this.app.OAuth.parameters[i];
                    credentials[parameter.Name] = parameter.Value;
                }
            }

            let request = {
                appId: parseInt(this.selectedAppId),
                actionId: this.appAction.ID,
                credentials: credentials,
                searchParams: {},
                actionParams: actionParams
            };
            //console.log('request-params: ', request);
            this.makeHttpWebCall(request);
        },
        async makeHttpWebCall(request) {
            await this.setLoadingStatus(true);
            var response = await platformAPI.makeHttpWebCall(request);
            console.log('resp: ', response);
            let message = '';
            if (response.reasonPhrase) {
                message = `${response.reasonPhrase}`;
                if (response.statusCode) {
                    message += `- ${response.statusCode}`;
                }
            } else {
                if (response.message) {
                    message = `${response.message}`;
                }
            }

            if (response.success) {
                message = `${response.reasonPhrase} - ${response.statusCode}`;
                //this.$store.dispatch("toaster/show", { type: "success", message: message, time: 2500 });
                alert('Success with message: '+message);

            } else {
                //this.$store.dispatch("toaster/show", { type: "error", message: message, time: 2500 });
                alert('Error with message: '+message);
            }
            await this.setResponseActionRequest(response);
            await this.setLoadingStatus(false);
        },
        async setResponseActionRequest(response) {
            if (response.body) {
                let responseOutputdata = this.appAction.ResponseOutputData;
                let respBody = responseOutputdata[this.METHOD_OUTPUT_PARAMETERS.RESP_BODY];

                let body = response.body;
                let json = this.parseJson(body);
                if (json) {
                    //set json data
                    respBody.data = JSON.stringify(json, null, "\t");

                } else {
                    //todo: handle other use cases also (simple text, html, etc)
                    respBody.data = body;
                }
                responseOutputdata[this.METHOD_OUTPUT_PARAMETERS.HEADERS].parameters = response.headers;
                responseOutputdata.testResponse = response;
                responseOutputdata.IsApiCallTested = true;
            }
        },
        parseJson(data) {
            try {
                return JSON.parse(data);
            } catch (exception) {
                return null;
            }
        },
        async setLoadingStatus(status) {
            await this.$store.dispatch("platformData/setLoadingStatus", status);
        },

        inputChanged( event ) {
            //console.log( 'val: ', event.target.value );
            //this.appAction.Url_c = event.target.value;
            this.setParameterEdited();
        },
        dropdownValueChanged( event ) {
            this.setParameterEdited();
            this.appAction.Method_c = event.target.value;
        },
        setParameterEdited() {
            if (!this.appAction.UI_Variables.IsEdited) {
                this.appAction.UI_Variables.IsEdited = true;
            }
        },

        //save before http request
        async saveBeforeValidation() {
            await this.saveAllParameteres();
        },
        async sendRequest() {
            /*let queryParameters = this.appAction.RequestInputData.Params.Query.parameters;
            let queryParams = this.getKeyValuePairObject(queryParameters, false);

            let urlParameters = this.appAction.RequestInputData.Params.Url.parameters;
            let urlParams = this.getKeyValuePairObject(urlParameters, false);*/
            let headers;
            if( typeof this.appAction.RequestInputData != 'undefined' &&
                typeof this.appAction.RequestInputData.Headers != 'undefined' &&
                typeof this.appAction.RequestInputData.Headers.parameters != 'undefined' ) {
                let headerParameters = this.appAction.RequestInputData.Headers.parameters;
                headers = this.getKeyValuePairObject(headerParameters, false);
            }
            let bodyParameters = [];
            let selectedType = '';
            if( typeof this.appAction.RequestInputData != 'undefined' &&
                typeof this.appAction.RequestInputData.ReqBody != 'undefined' &&
                typeof this.appAction.RequestInputData.ReqBody.SelectedType!= 'undefined' ) {
                    selectedType = this.appAction.RequestInputData.ReqBody.SelectedType;
                    if (selectedType == this.METHOD_INPUT_PARAMETERS.REQ_BODY.FORM_DATA) {
                        bodyParameters = this.appAction.RequestInputData.ReqBody[this.METHOD_INPUT_PARAMETERS.REQ_BODY.FORM_DATA].parameters;
                    }
        
                    if (selectedType == this.METHOD_INPUT_PARAMETERS.REQ_BODY.X_WWW_FORM_URL_ENCODED) {
                        bodyParameters = this.appAction.RequestInputData.ReqBody[this.METHOD_INPUT_PARAMETERS.REQ_BODY.X_WWW_FORM_URL_ENCODED].parameters;
                    }
        
                    if (selectedType == this.METHOD_INPUT_PARAMETERS.REQ_BODY.RAW) {
                        bodyParameters = this.appAction.RequestInputData.ReqBody[this.METHOD_INPUT_PARAMETERS.REQ_BODY.RAW][this.METHOD_INPUT_PARAMETERS.REQ_BODY_RAW.JSON].parameters;
                    }
            }
            /*let bodyParameters = [];

            //if (this.appAction.RequestInputData.methodsInputParameter == this.METHOD_INPUT_PARAMETERS.BODY) {
            let selectedType = this.appAction.RequestInputData.ReqBody.SelectedType;
            if (selectedType == this.METHOD_INPUT_PARAMETERS.REQ_BODY.FORM_DATA) {
                bodyParameters = this.appAction.RequestInputData.ReqBody[this.METHOD_INPUT_PARAMETERS.REQ_BODY.FORM_DATA].parameters;
            }

            if (selectedType == this.METHOD_INPUT_PARAMETERS.REQ_BODY.X_WWW_FORM_URL_ENCODED) {
                bodyParameters = this.appAction.RequestInputData.ReqBody[this.METHOD_INPUT_PARAMETERS.REQ_BODY.X_WWW_FORM_URL_ENCODED].parameters;
            }

            if (selectedType == this.METHOD_INPUT_PARAMETERS.REQ_BODY.RAW) {
                bodyParameters = this.appAction.RequestInputData.ReqBody[this.METHOD_INPUT_PARAMETERS.REQ_BODY.RAW][this.METHOD_INPUT_PARAMETERS.REQ_BODY_RAW.JSON].parameters;
            }
            //}

            let bodyParams = this.getBodyKeyValuePairObject(bodyParameters);

            let actionParams = Object.assign({}, queryParams, urlParams, bodyParams);

            let credentials = {};

            let useAppAuthentication = this.appAction.RequestInputData[this.METHOD_INPUT_PARAMETERS.AUTHENTICATION].useAppAuthentication;
            if (useAppAuthentication) {
                let authorizationParameters = this.app.authVariables.parameters;
                credentials = this.getKeyValuePairObject(authorizationParameters, true);
            }
            if (this.isOAuthType) {
                for (let i = 0; i < this.app.OAuth.parameters.length; i++) {
                    let parameter = this.app.OAuth.parameters[i];
                    credentials[parameter.Name] = parameter.Value;
                }
            }*/
            var opObj = { method : this.appAction.Method_c };
            if( typeof headers != 'undefined' ) {
                opObj['headers'] = headers;
            }
            let request = {
                action : this.appAction,
                options : opObj,
                selectedBodyType : selectedType,
                bodyParameters : bodyParameters
            };
            
            //console.log('request-params: ', request);
            console.log( 'action: ', this.appAction );
            this.makeHttpWebCall(request);
        },
        async isValidData() {
            if (this.validateActionDetails(this.appAction)) {
                if (this.validateAllInputTypeParameters(this.appAction)) {
                    return true;
                }
            }
            return false;
        },
        async saveAllParameteres() {
            let result = await this.isValidData()
            if (result) {
                let actionDetails = await this.retrieveActionDetails(this.appAction);
                let actionVariables = await this.retrieveActionVariablesData(this.appAction);

                if (actionDetails == null && actionVariables.length == 0) {
                    this.initializeValidation();
                } else {
                    //proceed to save
                    let actionResponse = { proccesedRecord: null, errorsData: [] };
                    if (actionDetails) {
                        console.log('actionDetails: ', actionDetails);
                        //action save(create / update) to back-end
                        actionResponse = await this.$store.dispatch("platformData/saveActionDetails", Utils.deepCopyObject(actionDetails));
                    }

                    let actionVariablesResponse = { proccesedData: [], errorsData: [] };
                    if (actionVariables.length > 0) {
                        let actionVaraiblesObject = {
                            shouldAddParameters: false,
                            actionVariables: actionVariables
                        };
                        actionVariablesResponse = await this.$store.dispatch("platformData/saveActionVariablesInBulkMode", actionVaraiblesObject);
                    }

                    await this.saveRequestRawJsonDataIfChanged();
                    //update all action parameters on ui. if no error then make actual call using initializevalidation => makeHttpWebCall
                    this.updateUIVariables(actionResponse, actionVariablesResponse);
                }
            }
        },

        async saveRequestRawJsonDataIfChanged() {
            if (this.appAction.RequestInputData[this.METHOD_INPUT_PARAMETERS.BODY][this.METHOD_INPUT_PARAMETERS.REQ_BODY.RAW][this.METHOD_INPUT_PARAMETERS.REQ_BODY_RAW.JSON].rawJsonDataUpdated.staus) {
                var self = this;
                let rawJson = this.appAction.RequestInputData[this.METHOD_INPUT_PARAMETERS.BODY][this.METHOD_INPUT_PARAMETERS.REQ_BODY.RAW][this.METHOD_INPUT_PARAMETERS.REQ_BODY_RAW.JSON].data;
                let details = {
                    rawJson: rawJson,
                    action: this.appAction
                };
                await this.$store.dispatch("platformData/saveActionMetadataInTable", details);

                this.appAction.RequestInputData[this.METHOD_INPUT_PARAMETERS.BODY][this.METHOD_INPUT_PARAMETERS.REQ_BODY.RAW][this.METHOD_INPUT_PARAMETERS.REQ_BODY_RAW.JSON].rawJsonDataUpdated.staus = false;
                this.appAction.RequestInputData[this.METHOD_INPUT_PARAMETERS.BODY][this.METHOD_INPUT_PARAMETERS.REQ_BODY.RAW][this.METHOD_INPUT_PARAMETERS.REQ_BODY_RAW.JSON].rawJsonDataUpdated.show = true;
                setTimeout(function() {
                    self.appAction.RequestInputData[self.METHOD_INPUT_PARAMETERS.BODY][self.METHOD_INPUT_PARAMETERS.REQ_BODY.RAW][self.METHOD_INPUT_PARAMETERS.REQ_BODY_RAW.JSON].rawJsonDataUpdated.show = false;
                }, 2000);
            }
        },

        async updateUIVariables(actionResponse, actionVariablesResponse) {
            let proccesedRecord = actionResponse.proccesedRecord;
            if (this.appAction.ID == 0) {
                let actionId = proccesedRecord.ID;
                this.appAction.ID = actionId;
                this.appAction.Name = proccesedRecord.Name;
                await this.$store.dispatch("platformData/setSelectedActionId", actionId);
                await this.updateAllActionVariablesActionId(this.appAction);
                await this.$store.dispatch("platformData/refreshActionListData");
            }

            let proccesedData = actionVariablesResponse.proccesedData;
            for (let i = 0; i < proccesedData.length; i++) {
                let item = proccesedData[i];

                let SelectedType = item.SelectedType;
                if (SelectedType == this.METHOD_INPUT_PARAMETERS.PARAMS_URL) {
                    let methodObject = this.appAction.RequestInputData[this.METHOD_INPUT_PARAMETERS.PARAMS][this.METHOD_INPUT_PARAMETERS.PARAMS_URL];
                    await this.updateUIParametersData(methodObject, item);
                }

                if (SelectedType == this.METHOD_INPUT_PARAMETERS.PARAMS_QUERY) {
                    let methodObject = this.appAction.RequestInputData[this.METHOD_INPUT_PARAMETERS.PARAMS][this.METHOD_INPUT_PARAMETERS.PARAMS_QUERY];
                    await this.updateUIParametersData(methodObject, item);
                }

                if (SelectedType == this.METHOD_INPUT_PARAMETERS.HEADERS) {
                    let methodObject = this.appAction.RequestInputData[this.METHOD_INPUT_PARAMETERS.HEADERS];
                    await this.updateUIParametersData(methodObject, item);
                }

                if (SelectedType == this.METHOD_INPUT_PARAMETERS.REQ_BODY.FORM_DATA) {
                    let methodObject = this.appAction.RequestInputData[this.METHOD_INPUT_PARAMETERS.BODY][this.METHOD_INPUT_PARAMETERS.REQ_BODY.FORM_DATA];
                    await this.updateUIParametersData(methodObject, item);
                }

                if (SelectedType == this.METHOD_INPUT_PARAMETERS.REQ_BODY.X_WWW_FORM_URL_ENCODED) {
                    let methodObject = this.appAction.RequestInputData[this.METHOD_INPUT_PARAMETERS.BODY][this.METHOD_INPUT_PARAMETERS.REQ_BODY.X_WWW_FORM_URL_ENCODED];
                    await this.updateUIParametersData(methodObject, item);
                }

                if (SelectedType == this.METHOD_INPUT_PARAMETERS.REQ_BODY.RAW) {
                    let SelectedSubType = item.SelectedSubType;

                    if (SelectedSubType == this.METHOD_INPUT_PARAMETERS.REQ_BODY_RAW.JSON) {
                        let methodObject = this.appAction.RequestInputData[this.METHOD_INPUT_PARAMETERS.BODY][this.METHOD_INPUT_PARAMETERS.REQ_BODY.RAW][this.METHOD_INPUT_PARAMETERS.REQ_BODY_RAW.JSON]
                        await this.updateUIParametersData(methodObject, item);
                    }
                }

                if (SelectedType == this.METHOD_INPUT_PARAMETERS.NONE) {
                    let methodObject = this.appAction.RequestInputData[this.METHOD_INPUT_PARAMETERS.NONE];
                    await this.updateUIParametersData(methodObject, item);
                }

                if (SelectedType == this.METHOD_OUTPUT_PARAMETERS.RESP_BODY) {
                    let methodObject = this.appAction.ResponseOutputData[this.METHOD_OUTPUT_PARAMETERS.RESP_BODY];
                    await this.updateUIParametersData(methodObject, item);
                }
            }

            if (this.appAction.IsActionTypeChanged) {
                await this.changeMenuOption();
            }

            let hasError = false;
            let actionErrorData = actionResponse.errorsData;
            if (actionErrorData.length > 0) {
                hasError = true;
            } else {
                this.appAction.UI_Variables.IsEdited = false;
                this.appAction.UI_Variables.IsInputParameterEdited = false;
                this.appAction.UI_Variables.IsOutputParameterEdited = false;
            }

            let actionVariableErrorsData = actionVariablesResponse.errorsData;
            if (actionVariableErrorsData.length > 0) {
                hasError = true;
            }
            if (hasError) {
                this.$store.dispatch("toaster/show", { type: "success", message: 'Operation performed.', time: 2000 });
                let errorObject = {
                    actionData: actionResponse.proccesedRecord,
                    variablesData: actionVariableErrorsData
                };
                await this.$store.dispatch("platformData/setOperationErrorData", errorObject);
            } else {
                this.$store.dispatch("toaster/show", { type: "success", message: 'Changes saved.', time: 2000 });
                this.initializeValidation();
            }
        },
        showWarning(message) {
            this.$store.dispatch("toaster/show", { type: "warning", message: message, time: 2000 });
        },
        async changeMenuOption() {
            let option = '';
            if (this.selectedMenuOption == this.SideMenuKeys.TRIGGERS) {
                //change menu-option to action
                option = this.SideMenuKeys.ACTIONS;
            } else {
                //change menu-option to trigger
                option = this.SideMenuKeys.TRIGGERS;
            }

            this.appAction.IsActionTypeChanged = false;
            await this.$store.dispatch("platformData/setSelectedMenuOption", option);
            await this.$store.dispatch("platformData/moveActionToAnotherMenuOption", this.appAction);
        },
        /*showFieldOrdering() {
        	this.showOrderingModal = true;
        }*/
        processCurlRawData() {
            var self = this;

            var isJSONData = false,
                jsonData;
            try {
                // JOSN data processing
                jsonData = JSON.parse(self.curlRawData);
                isJSONData = true;

            } catch (error) {
                isJSONData = false;
            }
            var methodInputParams = ApiHelper.METHOD_INPUT_PARAMETERS;

            if (!isJSONData) {

                //Curl data processing
                const cURLParser = new CURLParser(self.curlRawData);
                self.parsedCurlData = cURLParser.parse();
                self.appAction.Method_c = self.parsedCurlData.method;

                var url = self.parsedCurlData.url;

                if (url.startsWith("'") || url.startsWith('"')) {
                    url = url.substring(1, url.length - 1);
                }
                self.appAction.Url_c = url;


                //Setting headers assuming last element is always empty row, so lets copy that and modify
                var headersKey = ApiHelper.METHOD_INPUT_PARAMETERS.HEADERS;
                var actionHeaders = self.appAction.RequestInputData[headersKey].parameters;

                if (actionHeaders.length > 1) {
                    actionHeaders.splice(0, actionHeaders.length - 1);
                }

                var parsedHeaders = self.parsedCurlData.headers;
                for (let key in parsedHeaders) {
                    if (key != 'authorization') {
                        let lastRowAsNew = {...actionHeaders[actionHeaders.length - 1] };
                        lastRowAsNew.Name = key;
                        lastRowAsNew.DefaultValue_c = parsedHeaders[key];
                        lastRowAsNew.SampleValue_c = parsedHeaders[key];
                        actionHeaders.splice(actionHeaders.length - 1, 0, lastRowAsNew);
                    }
                }


                //Setting request body assuming that it is json only

                if (self.parsedCurlData.body.data == 'data') {
                    self.parsedCurlData.body.data = null;
                }
                if (self.parsedCurlData.body.data) {
                    jsonData = self.parsedCurlData.body.data;
                }

                //Setting query params. URL Params needs to be manually entered

                var paramsKey = ApiHelper.METHOD_INPUT_PARAMETERS.PARAMS;
                var queryParamsKey = ApiHelper.METHOD_INPUT_PARAMETERS.PARAMS_QUERY;
                var queryParams = self.appAction.RequestInputData[paramsKey][queryParamsKey].parameters;

                if (queryParams.length > 1) {
                    queryParams.splice(0, queryParams.length - 1);
                }

                var parsedQueryParams = self.parsedCurlData.query;
                for (let key in parsedQueryParams) {
                    if (key != 'authorization') {
                        let lastRowAsNew = {...queryParams[queryParams.length - 1] };
                        lastRowAsNew.Name = key;
                        lastRowAsNew.DefaultValue_c = parsedQueryParams[key];
                        lastRowAsNew.SampleValue_c = parsedQueryParams[key];
                        queryParams.splice(queryParams.length - 1, 0, lastRowAsNew);
                    }
                }

                self.curlTab = 'processed';
            }

            if (jsonData) {

                var integratelyReqBodyObj = self.convertToIntegratelyObject(jsonData);
                var integratelyReqBody = JSON.stringify(integratelyReqBodyObj, null, "\t");
                self.appAction.RequestInputData[methodInputParams.BODY][methodInputParams.REQ_BODY.RAW][methodInputParams.REQ_BODY_RAW.JSON].data = integratelyReqBody;

                var stringExamplePattern = JSON.stringify(jsonData);

                let script = self.appAction.ActionScript_c;
                let findBegin, findEnd, injectCode;

                findBegin = '/*Pre: Injected code begins*/';
                findEnd = '/*Pre: Injected code ends*/';

                injectCode = `\nvar examplePattern = JSON.parse(\`${stringExamplePattern}\`);\nrequestBody = __Lib.transformToPattern(requestBody, examplePattern);\n`;

                let beginIndex = script.lastIndexOf(findBegin);
                let endIndex = script.lastIndexOf(findEnd);

                if (beginIndex != -1) {
                    let code = self.replaceBetween(script, beginIndex + findBegin.length, endIndex, injectCode);
                    self.appAction.ActionScript_c = code;
                    self.$store.dispatch("toaster/show", {
                        type: "success",
                        message: "Code updated in pre function!",
                        time: 3000,
                    });
                } else {
                    self.$store.dispatch("toaster/show", {
                        type: "warning",
                        message: "Script injection slot missing! You need to update the action script.",
                        time: 5000,
                    });
                }
            }

        },
        convertToIntegratelyObject(data) {
            var self = this;
            if (Array.isArray(data)) {
                return self.convertToIntegratelyObject(data[0]);
            } else if (typeof data === 'object') {
                var obj = {};
                for (var key in data) {
                    obj[key] = self.convertToIntegratelyObject(data[key]);
                }
                return obj;
            } else {
                return data;
            }
        },
        replaceBetween(origin, startIndex, endIndex, insertion) {
            return origin.substring(0, startIndex) + insertion + origin.substring(endIndex);
        }
    },
};