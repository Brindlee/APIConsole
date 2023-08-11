import ResponseOutputs from "@/platform/components/APIConsole/ResponseType/ResponseOutputs/ResponseOutputs.vue";
import JsonEditor from "@/platform/components/AceEditor/JsonEditor/JsonEditor.vue";
import ApiHelper from "@/platform/js/APIHelper";
import ActionParameters from "@/platform/js/mixins/ActionParameters";
import IOFieldGenerator from '@/platform/js/mixins/IOFieldGenerator';
import DataRetriever from "@/platform/js/mixins/DataRetriever";
import WHJsonStructureGenerator from '@/platform/js/mixins/WHJsonStructureGenerator';
import platformAPI from '@/platform/js/api/platformAPI';
import Utils from "@/platform/js/Utils";

export default {
    name: "RespBody",
    mixins: [ActionParameters, IOFieldGenerator, DataRetriever, WHJsonStructureGenerator],
    components: {
        ResponseOutputs,
        JsonEditor
    },
    props: {
        appAction: Object,
        outputParameters: Array,
    },
    data() {
        return {
            METHOD_OUTPUT_PARAMETERS: ApiHelper.METHOD_OUTPUT_PARAMETERS,
            ACTION_VARIABLE_TYPES: ApiHelper.ACTION_VARIABLE_TYPES,
            showJsonEditor: false,
            recordKeyStatus: { container: false, identifier: false },
            flattenArrayList: [],
            entityPropertiesConfiguration: { show: false, value: 'OnlyEmpty' }
        }
    },
    computed: {
        /*isRecordContainerKeyPresent() {
        	if (this.appAction && this.appAction.RecordsContainerKey_c
        		&& this.appAction.RecordsContainerKey_c != '') {
        		return true;
        	}
        	return false;
        },*/
        isLoading() {
            return this.$store.getters["platformData/isLoading"];
        },
        isWebhook() {
            if (this.appAction.Type_c == 'InstantTrigger') {
                return true;
            }
            return false;
        }
    },
    methods: {
        actionInputChanged(key) {
            if (!this.appAction.UI_Variables.IsEdited) {
                this.appAction.UI_Variables.IsEdited = true;
                if (!this.recordKeyStatus[key]) {
                    this.recordKeyStatus[key] = true;
                }
            }
        },
        isActionDataChanged() {
            if (this.appAction.UI_Variables.IsEdited
                && (this.recordKeyStatus.container
                    || this.recordKeyStatus.identifier)) {
                return true;
            }
            return false;
        },
        async validateBeforeGeneratingOutput() {

            var inputOutputData = {
                type: "Output",
                jsonText: this.appAction.ResponseOutputData[this.METHOD_OUTPUT_PARAMETERS.RESP_BODY].data,
                outputParameters: this.outputParameters,
                recordContainerKey: this.appAction.RecordsContainerKey_c,
                appAction: this.appAction,
                result: true
            };
            await this.setLoadingStatus(true);
            await this.validateJSONData(inputOutputData);
            /*let recordContainerKey = this.appAction.RecordsContainerKey_c;
            await this.validateJSONData(recordContainerKey);*/
            if (inputOutputData.result) {
                await this.generateStandardFieldBody();
            }            
            await this.setLoadingStatus(false);
        },

        //data saving
        async saveVariables(data) {
            let actionVaraiblesObject = {
                shouldAddParameters: false,
                actionVariables: data
            };
            let response = await this.$store.dispatch("platformData/saveActionVariablesInBulkMode", actionVaraiblesObject);
            if (this.isActionDataChanged()) {
                let actionResponse = await this.performActionSetupSaving();
                await this.updateActionUIVariables(actionResponse, true);
            }
            this.updateUIVariables(response);
        },
        async performActionSetupSaving() {
            let actionData = await this.retrieveActionDetails(this.appAction);
            let actionResponse = await this.$store.dispatch("platformData/saveActionDetails", Utils.deepCopyObject(actionData));            
            return actionResponse;
        },
        async saveBodyParameteres() {
            let Records = this.createResponseBodyParameterRecords();            
            if (Records) {
                let data = [{ Records: Records, SelectedType: this.METHOD_OUTPUT_PARAMETERS.RESP_BODY }];
                this.saveVariables(data);
            } else {
                if (this.isActionDataChanged()) {
                    let actionResponse = await this.performActionSetupSaving();
                    this.updateActionUIVariables(actionResponse);
                } else {
                    this.$store.dispatch("toaster/show", {
                        type: "warning",
                        message: 'You have not made any changes in this section yet',
                        time: 2000
                    });
                }
            }
        },
        createResponseBodyParameterRecords() {
            let methodObject = this.appAction.ResponseOutputData[this.METHOD_OUTPUT_PARAMETERS.RESP_BODY];

            return this.createInputParamterRecords(methodObject, true);
        },

        async updateUIVariables(response) {
            let proccesedData = response.proccesedData;
            for (let i = 0; i < proccesedData.length; i++) {
                let item = proccesedData[i];

                let SelectedType = item.SelectedType;
                if (SelectedType == this.METHOD_OUTPUT_PARAMETERS.RESP_BODY) {
                    let methodObject = this.appAction.ResponseOutputData[this.METHOD_OUTPUT_PARAMETERS.RESP_BODY];
                    this.updateUIParametersData(methodObject, item);
                }
            }

            let errorsData = response.errorsData;
            if (errorsData.length > 0) {
                this.$store.dispatch("toaster/show", { type: "success", message: 'Operation performed.', time: 2000 });
                await this.$store.dispatch("platformData/setOperationErrorData", { actionData: null, variablesData: errorsData });
            } else {
                this.$store.dispatch("toaster/show", { type: "success", message: 'Changes saved.', time: 2000 });
                this.appAction.UI_Variables.IsOutputParameterEdited = false;
            }
        },

        async updateActionUIVariables(response, skip) {
            let proccesedRecord = response.proccesedRecord;
            if (this.appAction.ID == 0) {
                let actionId = proccesedRecord.ID;
                this.appAction.ID = actionId;
                this.appAction.Name = proccesedRecord.Name;
                await this.$store.dispatch("platformData/setSelectedActionId", actionId);
                await this.updateAllActionVariablesActionId(this.appAction);

                await this.$store.dispatch("platformData/refreshActionListData");
            }

            if (!skip) {
                let errorsData = response.errorsData;

                if (errorsData.length > 0) {
                    this.$store.dispatch("toaster/show", { type: "success", message: 'Operation performed.', time: 2000 });
                    await this.$store.dispatch("platformData/setOperationErrorData", { actionData: proccesedRecord, variablesData: [] });
                } else {
                    this.appAction.UI_Variables.IsEdited = false;
                    this.$store.dispatch("toaster/show", { type: "success", message: 'Changes saved.', time: 2000 });
                }
            } else {
                if (response.errorsData.length == 0) {
                    this.appAction.UI_Variables.IsEdited = false;
                }
            }
        },

        openJsonEditor() {
            this.showJsonEditor = true;
        },
        findAndSetContainerKey() {
            var self = this;

            try {
                var response = self.appAction.ResponseOutputData[self.METHOD_OUTPUT_PARAMETERS.RESP_BODY].data;
                let responseData = JSON.parse(response);
                let found = false;
                for (let key in responseData) {
                    if (Array.isArray(responseData[key])) {
                        self.appAction.RecordsContainerKey_c = key;
                        self.actionInputChanged();
                        self.arraysInResponseOrContainerKey();
                        break;
                    }
                }

                if (found == false) {
                    for (let key in responseData) {
                        if (typeof responseData[key] == 'object') {
                            self.appAction.RecordsContainerKey_c = key;
                            self.actionInputChanged();
                            self.arraysInResponseOrContainerKey();
                            break;
                        }
                    }
                }
            } catch (error) {
                alert(error);
            }

        },
        arraysInResponseOrContainerKey() {
            let self = this;
            let arrayKeys = [];
            self.flattenArrayList.length = 0;
            try {
                var response = self.appAction.ResponseOutputData[self.METHOD_OUTPUT_PARAMETERS.RESP_BODY].data;
                if (response) {
                    let responseData = JSON.parse(response);
                    let data = self.appAction.RecordsContainerKey_c != '' ? responseData[self.appAction.RecordsContainerKey_c] : responseData;

                    if (Array.isArray(data)) {
                        data.forEach(item => {
                            for (var itemKey in item) {
                                if (Array.isArray(item[itemKey])) {
                                    if (arrayKeys.indexOf(itemKey) == -1) {
                                        arrayKeys.push(itemKey);
                                    }

                                }
                            }
                        });
                    } else {
                        for (var dataKey in data) {
                            if (Array.isArray(data[dataKey])) {
                                if (arrayKeys.indexOf(dataKey) == -1) {
                                    arrayKeys.push(dataKey);
                                }
                            }
                        }
                    }

                }

                arrayKeys.forEach(key => {
                    var item = {
                        key: key,
                        selected: false
                    }
                    self.flattenArrayList.push(item);
                });
            } catch (error) {

                alert(error);
            }

        },
        modifyResponseToFlatten() {
            var self = this;
            var response = self.appAction.ResponseOutputData[self.METHOD_OUTPUT_PARAMETERS.RESP_BODY].data;
            if (response) {
                let responseData = JSON.parse(response);
                let data = self.appAction.RecordsContainerKey_c != '' ? responseData[self.appAction.RecordsContainerKey_c] : responseData;
                let keysToProcess = [];
                self.flattenArrayList.forEach(item => {
                    if (item.selected) {
                        keysToProcess.push(item.key);
                    }
                });
                data = self.convertResponseData(keysToProcess, data);

                //Overwrite the data 
                //TODO : Add this data into original array and just replace the key
                if (self.appAction.RecordsContainerKey_c != '') {
                    responseData[self.appAction.RecordsContainerKey_c] = data;
                } else {
                    responseData = data;
                }
                self.appAction.ResponseOutputData[self.METHOD_OUTPUT_PARAMETERS.RESP_BODY].data = JSON.stringify(responseData, null, 3);
                self.$store.dispatch("toaster/show", {
                    type: "success",
                    message: "Response data flatten check the data.",
                    time: 2000,
                });
            }
        },
        convertResponseData(keysToProcess, data) {
            var self = this;
            if (Array.isArray(data)) {
                var modifiedData = [];
                data.forEach(function(obj) {
                    var newObj = self.handleArrayInsideObject(keysToProcess, obj);
                    modifiedData.push(newObj);
                });
                return modifiedData;
            } else {
                return self.handleArrayInsideObject(keysToProcess, data);
            }

        },
        handleArrayInsideObject(keysToProcess, obj) {
            var self = this;
            var newObj = {};
            for (var objKey in obj) {
                if (keysToProcess.indexOf(objKey) != -1) {
                    var arr = obj[objKey];
                    if (Array.isArray(arr)) {
                        let isSimpleArray = false;
                        if (arr.length > 0) {
                            let firstItem = arr[0];                            
                            if (typeof (firstItem) == 'string' || typeof (firstItem) == 'number') {
                                newObj[objKey] = arr.join(',');
                                isSimpleArray = true;
                            }
                        }
                        if (!isSimpleArray) {
                            newObj[objKey] = self.flattenArrayRecursively(arr);
                        }                        
                    } else {
                        newObj[objKey] = obj[objKey];
                    }
                } else {
                    newObj[objKey] = obj[objKey];
                }
            }
            return newObj;
        },
        flattenArrayRecursively(arr) {
            var self = this;
            var singleObj = {};
            arr.forEach(function(arrObj) {
                for (var arrObjKey in arrObj) {
                    if (Array.isArray(arrObj[arrObjKey])) {
                        singleObj[arrObjKey] = self.flattenArrayRecursively(arrObj[arrObjKey])
                    } else {
                        if (typeof singleObj[arrObjKey] == 'undefined') {
                            singleObj[arrObjKey] = "" + arrObj[arrObjKey];
                        } else {
                            singleObj[arrObjKey] = singleObj[arrObjKey] + "," + arrObj[arrObjKey]
                        }
                    }
                }
            });
            return singleObj;
        },
        injectPostCode() {
            var self = this;
            var script = self.appAction.ActionScript_c;
            let findBegin, findEnd, injectCode;


            findBegin = '/*Post: Injected code begins*/';
            findEnd = '/*Post: Injected code ends*/';


            var keysToProcess = [];
            self.flattenArrayList.forEach(item => {
                if (item.selected) {
                    keysToProcess.push(item.key);
                }
            });

            injectCode = `\nvar keysToProcess = ${JSON.stringify(keysToProcess)};\n`;
            let compareCode = self.appAction.RecordsContainerKey_c != '' ? `responseBody['${self.appAction.RecordsContainerKey_c}']` : 'responseBody';
            injectCode += `${compareCode} = __Lib.simplifyArrayKeys(keysToProcess, ${compareCode});\n`;

            let beginIndex = script.lastIndexOf(findBegin);
            let endIndex = script.lastIndexOf(findEnd);
            if (beginIndex != -1) {
                let code = self.replaceBetween(script, beginIndex + findBegin.length, endIndex, injectCode);
                self.appAction.ActionScript_c = code;

                self.$store.dispatch("toaster/show", {
                    type: "success",
                    message: "Code updated in post function!",
                    time: 2000,
                });
            } else {
                self.$store.dispatch("toaster/show", {
                    type: "warning",
                    message: "Script injection slot missing! You need to update the action script.",
                    time: 5000,
                });
            }

        },
        replaceBetween(origin, startIndex, endIndex, insertion) {
            return origin.substring(0, startIndex) + insertion + origin.substring(endIndex);
        },

        async modifyResonseForWebhook() {
            var self = this;
            var data = self.appAction.ResponseOutputData[self.METHOD_OUTPUT_PARAMETERS.RESP_BODY].data;
            if (data) {
                let details = {
                    result: true, fields: {}, data: data
                };                
                await self.convertDataToWebhookFieldFormat(details);
                if (details.result) {
                    self.appAction.ResponseOutputData[self.METHOD_OUTPUT_PARAMETERS.RESP_BODY].data = JSON.stringify(details.fields, null, 3);
                    self.$store.dispatch("toaster/show", {
                        type: "success",
                        message: "JSON modified successfully.",
                        time: 2000,
                    });
                }
            }
        },
        async generateStandardFieldBody() {
            let methodObject = this.appAction.ResponseOutputData[this.METHOD_OUTPUT_PARAMETERS.RESP_BODY];
            let structuredMethodObject = this.createResponseBodyParameterRecords();

            let fieldParameters = [];
            let createParameters = Utils.deepCopyObject(structuredMethodObject.Create.Parameters);            
            if (methodObject.setSampleValuesToEmptyFields) {
                let noSampleValueParameters = [];
                let parameters = Utils.deepCopyObject(methodObject.parameters);
                for (let i = 0; i < parameters.length; i++) {
                    let parameter = parameters[i];                    
                    if (!Utils.isNullOrEmpty(parameter.Name)
                        && Utils.isNullOrEmpty(parameter.SampleValue_c)) {
                        let details = { Name: parameter.Name, ParentKey_c: parameter.ParentKey_c };
                        let outParameter = this.getInputOutputParameterByKey(details, createParameters);                        
                        if (outParameter == null) {
                            noSampleValueParameters.push(Utils.deepCopyObject(parameter));
                        }
                    }
                }
                fieldParameters = Object.assign([], fieldParameters, createParameters.concat(noSampleValueParameters));
            } else {
                fieldParameters = Object.assign([], fieldParameters, createParameters);
            }

            if (fieldParameters.length > 0) {                
                await this.setFieldsEntityProperties(fieldParameters);
            }            
        },
        async setFieldsEntityProperties(fieldParameters) {
            var self = this;
            let fields = [];
            fieldParameters.forEach(function (field) {
                fields.push({
                    Id: field.ID, Name: field.Name, Label: field.Label_c,
                    ParentKey: field.ParentKey_c, Type: field.Type_c
                });
            });
            let data = {
                actionId: this.appAction.ID,
                appId: this.appAction.AppId_c.ID,
                fields: fields
            };
            var response = await platformAPI.getFieldsEntityProperties(data);            
            if (response.success && response.data && response.data.fields
                && response.data.fields.length > 0) {
                let fields = response.data.fields;
                let parameters = self.getOutputFieldParameters();
                let indices = [];
                let isAnyOutputFieldEdited = false;
                for (let i = 0; i < parameters.length; i++) {
                    let parameter = parameters[i];
                    for (let j = 0; j < fields.length; j++) {
                        let field = fields[j];                        
                        if (field.entityProperty > 0 && parameter.Name == field.name
                            && parameter.ParentKey_c == field.parentKey) {
                            parameter.Entity_Property_c.ID = field.entityProperty;
                            parameter.Entity_Property_c.Name = field.entityName;
                            parameter.SampleValue_c = field.sampleValue;
                            parameter.UI_Variables.IsEdited = true;
                            if (!isAnyOutputFieldEdited) {
                                isAnyOutputFieldEdited = true;
                            }
                            break;
                        }
                    }
                    if ((i !== parameters.length - 1) &&
                        (Utils.isNullOrEmpty(parameter.Name)
                            && Utils.isNullOrEmpty(parameter.Label_c))) {
                        indices.push(i);
                    }
                }

                if (indices.length > 0) {
                    for (let i = (indices.length - 1); i >= 0; i--) {
                        parameters.splice(indices[i], 1)
                    }
                }

                if (isAnyOutputFieldEdited) {
                    self.appAction.UI_Variables.IsOutputParameterEdited = true;
                }
            }
        },

        showEntityPropertiesConfigurationModal() {
            this.entityPropertiesConfiguration.show = true;
        },
        closeEntityPropertiesConfigurationModal() {
            this.entityPropertiesConfiguration.show = false;
            this.entityPropertiesConfiguration.value = 'OnlyEmpty';
        },
        async applyEntityPropertiesConfiguration() {
            let parameters = this.getOutputFieldParameters();
            if (parameters.length > 0) {
                let fieldParameters = [];
                parameters.forEach(function (parameter) {
                    if ((!Utils.isNullOrEmpty(parameter.Name)
                        || !Utils.isNullOrEmpty(parameter.Label_c))) {
                        fieldParameters.push(parameter);
                    }                    
                });
                if (fieldParameters.length > 0) {
                    await this.setLoadingStatus(true);
                    await this.setFieldsEntityProperties(fieldParameters);
                    await this.setLoadingStatus(false);
                }                
            }
        },

        getOutputFieldParameters() {
            return this.appAction.ResponseOutputData[this.METHOD_OUTPUT_PARAMETERS.RESP_BODY].parameters;
        }
    }
}