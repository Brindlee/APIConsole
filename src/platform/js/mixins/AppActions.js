import EmptyFieldGenerator from "@/platform/js/mixins/EmptyFieldGenerator";
import ActionClone from "@/platform/js/mixins/ActionClone";
//import proxyHelper from "@/platform/js/proxyHelper";
import ApiHelper from "@/platform/js/APIHelper";
import Constants from "@/platform/js/Constants";
import Utils from "@/platform/js/Utils";

export default {
    mixins: [EmptyFieldGenerator, ActionClone],
    data() {
        return {
            SideMenuKeys: Constants.SideMenuKeys,
            //selectedMenuOption: '',
            METHOD_INPUT_PARAMETERS: ApiHelper.METHOD_INPUT_PARAMETERS,
            ACTION_VARIABLE_TYPES: ApiHelper.ACTION_VARIABLE_TYPES,
            HeaderKeys: {
                APPLICATION_XWWW_FORM_URLENCODED: 'application/x-www-form-urlencoded',
                APPLICATION_JSON: 'application/json'
            }
        };
    },
    computed: {
        selectedApp() {
            /*return this.$store.getters["platformData/selectedApp"];*/
            return { app : {
                "ID": 116,
                      "Name": "CompanyHub",
                      "CreatedOn": "2020-05-19T19:02:22",
                      "CreatedBy": {
                          "ID": 1,
                          "Name": "Nabiya Khan"
                      },
                      "ModifiedOn": "2023-08-08T11:49:59",
                      "ModifiedBy": {
                          "ID": 35,
                          "Name": "Ankita Saxena"
                      },
                      "DeletedOn": null,
                      "DeletedBy": {
                          "ID": 0,
                          "Name": ""
                      },
                      "Owner": {
                          "ID": 1,
                          "Name": "Nabiya Khan"
                      },
                      "Label_c": "CompanyHub",
                      "LogoUrl_c": "https://integrately-app-logos.s3-us-west-2.amazonaws.com/CompanyHub.png",
                      "IsStandard_c": false,
                      "Description_c": "CompanyHub is a cloud-based solution for seamless sales and marketing automation. It helps businesses manage their sales pipelines from lead generation to campaign execution, and eventually, to sales closure.",
                      "AuthType_c": "ApiKey",
                      "AuthMapping_c": "{\"Authorization\":\"{{subdomain}} {{apikey}}\",\"Accept\":\"application/json\"}",
                      "AuthTitleMapping_c": "{{Name}} - CompanyHub",
                      "AuthTokenPlacement_c": "Header",
                      "ClientId_c": "",
                      "ClientSecret_c": "",
                      "AuthorizationUrl_c": "",
                      "AccessTokenUrl_c": "",
                      "RequestTokenUrl_c": "",
                      "RefreshTokenUrl_c": "",
                      "Scopes_c": "",
                      "IsPublic_c": false,
                      "Tag": "Test-Deployed,Production-Deployed",
                      "OAuth_AppDashboardUrl_c": null,
                      "API_DocumentationUrl_c": "https://companyhub.com/docs/api-documentation",
                      "Is_Module_c": false,
                      "AppScript_c": "var app = {\n    toIntegratelyFields: function (fields, isInput, isUpdate) {\n        var typeMap = {\n            unicode: 'String',\n            int: 'Integer',\n            decimal: 'Float',\n            bool: 'Boolean',\n            datetime: 'Date',\n            text: 'MultilineString'\n        };\n\n        var dropdownMap = {\n            Contact: 'Contact is created',\n            Company: 'Company is created',\n            Deal: 'Deal is created',\n            Quote: 'Quote is created',\n            SalesOrder: 'Sales order is created',\n            Task: 'Task is created',\n            User: 'Get User'\n        };\n\n        var searchMap = {\n            Company: 'Search company',\n            Contact: 'Search contact',\n            Deal: 'Search deal',\n            Quote: 'Search quote',\n            Task: 'Search task',\n            User: 'Search User'\n        };\n        //\n\n        var transformedFields = [];\n        for (var i = 0; i < fields.length; i++) {\n            var field = fields[i];\n            var name = field.key;\n            //parentkey\n            var parentkey = '';\n            if (field.parent_key && field.parent_key != null) {\n                parentkey = field.parent_key;\n                var fieldKeySegments = field.name.split(\"__\");\n                name = fieldKeySegments[1];\n            }\n            if (!typeMap.hasOwnProperty(field.type))\n                continue;\n\n            var type = typeMap[field.type];\n            var description = field.help_text;\n            var isRequired = false;\n            if (isInput == true && isUpdate == false) {\n                isRequired = field.required;\n                var choices = '';\n\n                if (field.choices && field.choices != null) {\n                    type = 'Dropdown';\n                    choices = field.choices.join();\n                }\n                if (field.type == \"Boolean\" || field.type == \"bool\") {\n                    type = 'Dropdown';\n                    choices = \"true|Yes,false|No\"\n                }\n            }\n\n\n            var dropdownKey = '';\n            var searchKey = '';\n            if (field.reference) {\n                if (isInput) {\n                    if (dropdownMap.hasOwnProperty(field.reference_table)) {\n                        type = 'DynamicDropdown';\n                        dropdownKey = getActionIdByName(dropdownMap[field.reference_table]) + '.ID|Name';\n                    }\n\n                    if (searchMap.hasOwnProperty(field.reference_table)) {\n                        searchKey = getActionIdByName(searchMap[field.reference_table]) + '.ID|Name';\n                    }\n                } else {\n                    if (field.label == \"Assigned To\") {\n                        name = \"AssignedToUserId\" + \".ID\"\n                        transformedFields.push({\n                            name: name,\n                            label: field.label + \" ID\",\n                            type: 'Integer',\n                            isRequired: isRequired,\n                            description: description,\n                            choices: choices,\n                            parentKey: parentkey,\n                            dynamicDropdownKey: dropdownKey,\n                            dynamicSearchKey: searchKey\n                        });\n                        name = \"AssignedToUserId.Name\"\n                        field.label = field.label + \" Name\"\n                        type = \"String\"\n                    } else {\n                        name = field.key + \".ID\"\n                        transformedFields.push({\n                            name: name,\n                            label: field.label + \" ID\",\n                            type: 'Integer',\n                            isRequired: isRequired,\n                            description: description,\n                            choices: choices,\n                            parentKey: parentkey,\n                            dynamicDropdownKey: dropdownKey,\n                            dynamicSearchKey: searchKey\n                        });\n                        name = field.key + \".Name\"\n                        field.label = field.label + \" Name\"\n                        type = \"String\"\n\n                    }\n                }\n            }\n            transformedFields.push({\n                name: name,\n                label: field.label,\n                type: type,\n                isRequired: isRequired,\n                description: description,\n                choices: choices,\n                parentKey: parentkey,\n                dynamicDropdownKey: dropdownKey,\n                dynamicSearchKey: searchKey\n            });\n\n        }\n        return transformedFields;\n    },\n    inputFields: function (table, operation) {\n        var actionResponseAsJson = executeAction(\"Get Fields\", JSON.stringify({\n            table: table,\n            update: false,\n            readable: false\n        }));\n        try {\n            var fields = JSON.parse(actionResponseAsJson);\n            var isUpdate = false;\n            if (operation == \"update\") {\n                isUpdate = true;\n            }\n            if (table == \"task\") {\n                var arr = [];\n                for (var i = 0; i < fields.length; i++) {\n                    if (fields[i].key != \"Status\") {\n                        arr.push(fields[i]);\n                    }\n                }\n                fields = arr;\n            }\n            return JSON.stringify(this.toIntegratelyFields(fields, true, isUpdate));\n        } catch (error) {\n            return \"[]\";\n        }\n    },\n    outputFields: function (table, operation) {\n        var actionResponseAsJson = executeAction(\"Get Fields\", JSON.stringify({\n            table: table,\n            update: false,\n            readable: true\n        }));\n        try {\n            var fields = JSON.parse(actionResponseAsJson);\n            return JSON.stringify(this.toIntegratelyFields(fields, false, false));\n        } catch (error) {\n            return \"[]\";\n        }\n    },\n    errorResponse: function (res) {\n        var object = JSON.parse(res);\n        var message = 'CompanyHub: ';\n        if (object.Errors) {\n            var keyLength = Object.keys(object.Errors).length;\n            if (keyLength > 0) {\n                var Errors = object.Errors;\n                var i = 0;\n                var length = Object.keys(Errors).length;\n                var errorArray = [];\n                Object.keys(Errors).forEach(function(property) {\n                    var values = Errors[property].Errors;\n                    var stringValue = values.toString();\n                    if (errorArray.indexOf(stringValue) === -1) {\n                        errorArray.push(values.toString());\n                    }\n                });\n                message += errorArray.join();\n            } else {\n                if (object.Message) {\n                    message += object.Message;\n                } else {\n                    message += \" Action failed\"\n                }\n            }\n        } else {\n            if (object.Message) {\n                message += object.Message;\n            } else {\n                message += \" Action failed\"\n            }\n        }\n        return message;\n    },\n    removeEmptyOrNull: function (obj) {\n        var keys = Object.keys(obj)\n        for (var k = 0; k < keys.length; k++) {\n            var key = keys[k]\n            if (obj[key] && typeof obj[key] === 'object') {\n                this.removeEmptyOrNull(obj[key])\n            } else if (Array.isArray(obj[key])) {\n                this.removeEmptyOrNull(obj[key][0])\n            } else if (!obj[key] || obj[key] == undefined || obj[key] == \"\") {\n                delete obj[key]\n            }\n        }\n\n        return obj;\n    },\n    isValid: function (response) {\n        var responseResult = {\n            IsError: false,\n            Body: response.Body,\n            Message: \"\",\n            Prefix: \"\",\n            ErrorType: \"SoftError\"\n        }\n        if (response.Body.startsWith(\"{\") || response.Body.startsWith(\"[\")) {\n            var responseBody = JSON.parse(response.Body);\n            var errMessage = \"\";\n\n            if (responseBody.Message) {\n                responseResult.IsError = true;\n                responseResult.Message = app.errorResponse(response.Body);\n                responseResult.Message = responseResult.Message.replace(\"CompanyHub: \", \"\");\n            }\n\n            if (responseResult.IsError) {\n                if (response.StatusCode == 200 || response.StatusCode == 400) {\n                    responseResult.ErrorType = \"SoftError\";\n                } else if (response.StatusCode == 429) {\n                    responseResult.ErrorType = \"rateLimitError\";\n                } else if (response.StatusCode == 401 || response.StatusCode == 403) {\n                    responseResult.ErrorType = \"expiredAuth\";\n                } else if (response.StatusCode == 500) {\n                    responseResult.ErrorType = \"retry\";\n                } else if (response.StatusCode > 500 || response.StatusCode == 0) {\n                    responseResult.ErrorType = \"downTimeError\";\n                } else {\n                    responseResult.ErrorType = \"Error\";\n                }\n\n                if (responseBody.Message.includes(\"Something went wrong\") || responseBody.Message.includes(\"Deadlock found\") || responseBody.Message.includes(\"try restarting\") || responseBody.Message.includes(\"deadlock found\")) {\n                    responseResult.ErrorType = \"retry\";\n                } else if (responseBody.Message == \"The API Key is not found.\" || responseBody.Message == \"User not found\" || responseBody.Message == \"Invalid header\") {\n                    responseResult.ErrorType = \"expiredAuth\";\n                } else if (responseBody.Message == \"Subdomain does not exist\") {\n                    responseResult.ErrorType = \"expiredAuth\";\n                }\n            }\n        } else {\n            if (response.StatusCode != 429) {\n                if (response.Body != \"\") {\n                    if (response.StatusCode != 404) {\n                        if (response.Body.startsWith(\"<\")||response.Body.startsWith(\"\\n<\")) {\n                            responseResult.IsError = true;\n                            responseResult.Message = \"Failed to get response from CompanyHub try again..\";\n                            responseResult.Prefix = \"Integrately\";\n                            responseResult.ErrorType = \"downTimeError\";\n                        } else {\n                            responseResult.IsError = true;\n                            responseResult.Message = response.Body;\n                            responseResult.ErrorType = \"Error\";\n                            //\"Failed to get response from CompanyHub...\";\n                        }\n                    } else {\n                        responseResult.IsError = true;\n                        responseResult.Message = \"Page Not Found\";\n                        responseResult.ErrorType = \"SoftError\";\n                    }\n                }\n            } else {\n                responseResult.IsError = true;\n                responseResult.Message = \"Too many Requests\";\n                responseResult.ErrorType = \"rateLimitError\";\n            }\n        }\n        return responseResult;\n    }\n};",
                      "AuthVideoUrl_c": "https://integrately-app-videos.s3.us-west-2.amazonaws.com/Companyhub.mp4",
                      "AppWebhookDescription_c": "",
                      "Primary_Color_c": "133 73 255",
                      "HasCustomOAuth_c": false,
                      "DeAuthorizationUrl_c": "",
                      "Website_link_c": "https://companyhub.com/",
                      "Slug_c": "companyhub",
                      "IsPremium_c": false,
                      "IntegrationPageUrl_c": "https://integrately.companyhub.com/settings/integration",
                      "IntegratelyTags_c": null,
                      "Current_Developer_c": {
                          "ID": 4,
                          "Name": "Akshay Saundane"
                      }
            }};
        },
        selectedMenuOption() {
            return this.$store.getters["platformData/selectedMenuOption"];
        }
    },
    methods: {
        openTriggerSection(option) {
            let app = this.selectedApp.app;
            if (app) {
                if ((typeof app.isActionsFetched == 'undefined') || !app.isActionsFetched) {
                    //fetch app actions
                    this.fetchAppActions(app, option);
                } else {
                    //open actions section and set defalt action if not presetnt
                    this.setDefaultActionIfNotSet(option);
                }
            }
        },
        async fetchAppActions(app, option) {
            var self = this;

            await self.setLoadingStatus(true);
            let payload = proxyHelper.getAppActionsByAppId(app.ID);
            let response = await self.$store.dispatch("platformData/performWebAPICall", payload);
            if (response.Success) {
                await self.setActionsToApp(response.Data, option);

                await self.loadDefaultActions();

                await self.setLoadingStatus(false);
            } else {
                self.$store.dispatch("toaster/show", { type: "error", message: response.Message });
                await self.setLoadingStatus(false);
            }
        },
        async setActionsToApp(actionsData) {
            let actionList = [{
                ID: 0,
                Name: 'Select Action',
                Label_c: 'Select Action',
            }];
            let triggers = [];
            let actions = [];
            let selectedTrigger = null;
            let selectedAction = null;

            let isDefaultTriggerSet = false,
                isDefaultActionSet = false;

            for (let i = 0; i < actionsData.length; i++) {
                let action = actionsData[i];
                this.setExtraKeysToAction(action);

                if (this.isTriggerType(action)) {
                    if (!isDefaultTriggerSet) {
                        action['IsSelected'] = true;
                        isDefaultTriggerSet = true;
                        selectedTrigger = action;
                    }
                    triggers.push(action);
                } else {
                    if (!isDefaultActionSet) {
                        action['IsSelected'] = true;
                        isDefaultActionSet = true;
                        selectedAction = action;
                    }
                    actions.push(action);
                }

                actionList.push({
                    ID: action.ID,
                    Name: action.Name,
                    Label_c: action.Label_c,
                    Type_c: action.Type_c,
                    variablesLoaded: action.actionVariablesLoaded
                });
            }

            let data = {
                actionsData: {
                    triggers: triggers,
                    actions: actions,
                    selectedTrigger: selectedTrigger,
                    selectedAction: selectedAction
                },
                isActionsFetched: true,
                actionList: actionList
            }
            await this.$store.dispatch("platformData/setAppsTriggerAndActionsData", data);
        },
        setExtraKeysToAction(action) {

            let queryKey = this.METHOD_INPUT_PARAMETERS.PARAMS_QUERY;
            let urlKey = this.METHOD_INPUT_PARAMETERS.PARAMS_URL;

            let form_data = this.METHOD_INPUT_PARAMETERS.REQ_BODY.FORM_DATA;
            let x_www_form_urlencoded = this.METHOD_INPUT_PARAMETERS.REQ_BODY.X_WWW_FORM_URL_ENCODED;

            action['IsSelected'] = false;
            action['searchKey'] = '';
            action['actionVariablesLoaded'] = false;
            action['selectedUITab'] = 'APIConsole';
            action['IsActionTypeChanged'] = false;
            action['metadata'] = {
                isFetched: false,
                meta: '',
                ID: 0
            };
            action['TestFormUI'] = {
                metadata: {
                    outputFields: [],
                    inputFields: [],
                    fieldsLabels: {},
                    searchFieldsLabels: {}
                },
                refreshFieldCounter: 0,
                isLoadingByRefreshField: false,
                IsInputOutputFetched: false,
                requestBody: null,
                actionParams: {},
                searchParams: {},
                isLoading: false,
                requestResponseDataModal: {
                    showModal: false,
                    showLink: false,
                    jsonData: { responseJson: '', requestJson: '' }
                }
            };
            action['UI_Variables'] = {
                IsEdited: false,
                IsLabelUpdated: false,
                IsInputParameterEdited: false,
                IsOutputParameterEdited: false
            };
            action['RequestInputData'] = {
                methodsInputParameter: 'Params',
                None: {
                    selectAllPairs: false,
                    parameters: [],
                    deletedParameters: []
                },
                Params: {
                    SelectedType: 'Url'
                },
                Authentication: {
                    useAppAuthentication: true,
                    selectAllPairs: false,
                    parameters: [],
                    deletedParameters: []
                },
                Headers: {
                    selectAllPairs: false,
                    parameters: [],
                    deletedParameters: []
                },
                ReqBody: {
                    SelectedType: 'raw',
                    SelectedSubType: 'JSON',
                    raw: {
                        JSON: {
                            data: ''
                        }
                    }
                }
            };

            action['RequestInputData']['Params'][queryKey] = {
                selectAllPairs: false,
                parameters: [],
                deletedParameters: []
            };
            action['RequestInputData']['Params'][urlKey] = {
                selectAllPairs: false,
                parameters: [],
                deletedParameters: []
            };

            action['RequestInputData']['ReqBody'][form_data] = {
                selectAllPairs: false,
                parameters: [],
                deletedParameters: []
            };
            action['RequestInputData']['ReqBody'][x_www_form_urlencoded] = {
                selectAllPairs: false,
                parameters: [],
                deletedParameters: []
            };
            action['RequestInputData']['ReqBody']['raw']['JSON'] = {
                selectAllPairs: false,
                parameters: [],
                data: '',
                isTable: false,
                deletedParameters: [],
                rawJsonDataUpdated: {
                    staus: false,
                    show: false,
                    message: 'Json structure saved'
                }
            };

            action['RequestInputData']['expandedInputParameter'] = {
                parameter: null,
                SelectedType: '',
                SelectedSubType: '',
            }

            action['ResponseOutputData'] = {
                methodsOutputParameter: 'RespBody',
                testResponse: null,
                IsApiCallTested: false,
                RespBody: {
                    data: '',
                    setSampleValuesToEmptyFields: true,
                    selectAllPairs: false,
                    shouldSkipAllPairsValueChanged: false,
                    parameters: [],
                    deletedParameters: []
                },
                Headers: {
                    parameters: {},
                }
            }
        },
        setDefaultActionIfNotSet(option) {
            let actionsData = this.selectedApp.app.actionsData;
            if (this.SideMenuKeys.TRIGGERS == option) {
                if (typeof actionsData.selectedTrigger == 'undefined') {
                    let action = actionsData.triggers[0];
                    action['IsSelected'] = true;
                    actionsData.selectedTrigger = action;
                } else {
                    this.openSelectedAction('Trigger');
                }
            } else {
                if (typeof actionsData.selectedAction == 'undefined') {
                    let action = actionsData.actions[0];
                    action['IsSelected'] = true;
                    actionsData.selectedAction = action;
                } else {
                    this.openSelectedAction('Action');
                }
            }
        },
        async loadDefaultActions() {
            var self = this;

            if (self.selectedApp.app && self.selectedApp.app.actionsData) {
                let isTriggerSet = false;
                let isActionSet = false;

                let trigger = self.selectedApp.app.actionsData.selectedTrigger;
                if (trigger) {
                    await self.selectAppAction(trigger, true);
                    isTriggerSet = true;
                }

                let action = self.selectedApp.app.actionsData.selectedAction;
                if (action) {
                    await self.selectAppAction(action, true);
                    isActionSet = true;
                }

                let data = { action: null };
                if (isTriggerSet && self.selectedMenuOption == self.SideMenuKeys.TRIGGERS) {
                    data.action = trigger;
                }
                if (isActionSet && self.selectedMenuOption == self.SideMenuKeys.ACTIONS) {
                    data.action = action;
                }

                if (data.action) {
                    await this.$store.dispatch("platformData/setSelectedActionType", data);
                }

                await this.$store.dispatch("platformData/setInitialActionProcessingCompleteStatus", true);
            }
        },
        isTriggerType(action) {
            let actionType = action.Type_c;
            if (actionType == 'Trigger' || actionType == 'InstantTrigger') {
                return true;
            } else {
                return false;
            }
        },
        checkIfActionVariablesAreLoaded(action) {
            var self = this;
            let result = false;

            let actionsData = self.selectedApp.app.actionsData;
            let existingActions = null;
            if (self.isTriggerType(action)) {
                existingActions = actionsData.triggers;
            } else {
                existingActions = actionsData.actions;
            }

            for (let i = 0; i < existingActions.length; i++) {
                let item = existingActions[i];
                if (item.ID == action.ID) {
                    result = item.actionVariablesLoaded;
                    break;
                }
            }
            return result;
        },
        async selectAppAction(action, shouldSkip) {
            var self = this;

            if (!self.checkIfActionVariablesAreLoaded(action)) {
                let shouldProceed = false;
                if (shouldSkip) {
                    shouldProceed = true;
                } else {
                    let oldAction = null;
                    if (self.isTriggerType(action)) {
                        oldAction = self.selectedApp.app.actionsData.selectedTrigger;
                    } else {
                        oldAction = self.selectedApp.app.actionsData.selectedAction;
                    }

                    if (oldAction == null) {
                        shouldProceed = true;
                    } else {
                        if (oldAction.ID != action.ID) {
                            shouldProceed = true;
                        }
                    }
                }

                if (shouldProceed) {
                    await self.fetchActionVariablesByActionId(action, false);
                    if (action.ID > 0) {
                        await self.fetchActionMetadataById(action);
                    }
                }
            } else {
                //open action section
                let data = {
                    action: action,
                };
                await this.$store.dispatch("platformData/updateSelectedAppActionData", data);
                if (action.ID > 0) {
                    await self.fetchActionMetadataById(action);
                }
            }
        },
        async fetchActionMetadataById(action) {
            if (!action.metadata.isFetched) {
                await this.$store.dispatch("platformData/fetchActionMetadata", action);
            }
        },
        async fetchActionVariablesByActionId(action, isMultipleSelectedActions) {
            var self = this;

            await self.setLoadingStatus(true);
            let payload = proxyHelper.getActionVariablesByActionId(action.ID);
            let response = await self.$store.dispatch("platformData/performWebAPICall", payload);
            if (response.Success) {
                await self.setActionVariableToAction(response.Data, action, isMultipleSelectedActions);
                await self.setLoadingStatus(false);
            } else {
                self.$store.dispatch("toaster/show", { type: "error", message: response.Message });
                await self.setLoadingStatus(false);
            }
        },
        async setActionVariableToAction(actionVariables, action, isMultipleSelectedActions) {
            let inputFields = [];
            let outputFields = [];
            var inputData = {
                None: { parameters: [] },
                Params: { Query: { parameters: [] }, Url: { parameters: [] } },
                Authentication: { parameters: [] },
                Headers: { parameters: [] },
                ReqBody: {
                    'form-data': { parameters: [] },
                    'x-www-form-urlencoded': { parameters: [] },
                    'raw': { 'JSON': { parameters: [] }, isJson: false },
                    defaultType: 'raw'
                },
                ContentType: []
            };

            var outputData = { RespBody: { parameters: [] } };

            for (let i = 0; i < actionVariables.length; i++) {
                let actionVariable = actionVariables[i];
                if (actionVariable.Direction_c == 'Input' &&
                    actionVariable.Placement_c == "Header") {
                    if (actionVariable.SampleValue_c == '') {
                        actionVariable.SampleValue_c = actionVariable.DefaultValue_c;
                    }

                    //add content-type to list
                    if (inputData.ContentType.indexOf(actionVariable.SampleValue_c) == -1) {
                        inputData.ContentType.push(actionVariable.SampleValue_c);
                    }
                }
            }

            for (let i = 0; i < actionVariables.length; i++) {
                let actionVariable = actionVariables[i];
                if (actionVariable.Direction_c == 'Input') {
                    actionVariable['UI_Variables'] = {
                        IsSelected: true,
                        IsFixedValue: false,
                        IsExpanded: false,
                        IsEdited: false,
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

                    if (actionVariable.Type_c == 'Dropdown' || actionVariable.Type_c == 'DynamicDropdown') {
                        actionVariable.UI_Variables.IsFixedValue = true;
                        if (actionVariable.Type_c == 'DynamicDropdown') {
                            actionVariable.UI_Variables.DynamicDropdownSources.keySource = this.getDynamicDropdownSourceActionId(actionVariable.DynamicDropdownKey_c);
                            actionVariable.UI_Variables.DynamicDropdownSources.searchsource = this.getDynamicDropdownSourceActionId(actionVariable.DynamicSearchKey_c);
                        }
                    }

                    await this.addInputInRequestInputData(inputData, actionVariable);
                    inputFields.push(actionVariable);
                } else {
                    actionVariable['UI_Variables'] = {
                        IsSelected: false,
                        IsFixedValue: false,
                        IsEdited: false,
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
                    if (actionVariable.Type_c == 'Dropdown' || actionVariable.Type_c == 'DynamicDropdown') {
                        actionVariable.UI_Variables.IsFixedValue = true;
                        if (actionVariable.Type_c == 'DynamicDropdown') {
                            actionVariable.UI_Variables.DynamicDropdownSources.keySource = this.getDynamicDropdownSourceActionId(actionVariable.DynamicDropdownKey_c);
                            actionVariable.UI_Variables.DynamicDropdownSources.searchsource = this.getDynamicDropdownSourceActionId(actionVariable.DynamicSearchKey_c);
                        }
                    }

                    if (actionVariable.SampleValue_c == '') {
                        actionVariable.SampleValue_c = actionVariable.DefaultValue_c;
                    }

                    await this.addOutputInResponseOutputData(outputData, actionVariable);
                    outputFields.push(actionVariable);
                }
            }

            await this.setDefaultRequestBodyData(inputData, action);
            await this.addEmptyInputFieldRecord(inputData, action);
            await this.addEmptyOutputFieldRecord(outputData, action);

            action['IsSelected'] = true;
            let data = {
                action: action,
                actionVariables: {
                    inputFields: inputFields,
                    outputFields: outputFields
                },
                requestResponseData: {
                    inputData: inputData,
                    outputData: outputData
                }
            }
            if (!isMultipleSelectedActions) {
                await this.$store.dispatch("platformData/setActionVarabileDataToAction", data);
            } else {
                action.actionVariables = data.actionVariables;
            }
        },
        getDynamicDropdownSourceActionId(value) {
            let object = { id: 0, key: '', displayLabel: '' };
            if (!Utils.isNullOrEmpty(value) && value.indexOf('.') != -1 && value.indexOf('|') != -1) {
                let array = value.split('|');
                if (array.length > 1) {
                    let sourceKey = array[0];
                    let sourceArray = sourceKey.split('.');
                    if (sourceArray.length > 1) {
                        object.id = sourceArray[0];
                        let key = '';
                        for (let i = 1; i < sourceArray.length; i++) {
                            if (key != '') {
                                key += '.';
                            }
                            key += sourceArray[i];
                        }
                        object.key = key;
                    }

                    let displayLabel = '';
                    for (let j = 1; j < array.length; j++) {
                        if (displayLabel != '') {
                            displayLabel += '.';
                        }
                        displayLabel += array[j];
                    }
                    object.displayLabel = displayLabel;
                }
                //let value = actionVariable[key];
                /*let array = value.split('.');
                if (array.length > 1) {					
                	object.id = array[0];
                	let textArray = array[1].split('|');
                	if(textArray.length > 1) {
                		object.key = textArray[0];
                		object.displayLabel = textArray[1];
                	}					
                	return object;
                }*/
            }
            return object;
        },
        setDefaultRequestBodyData(inputData, action) {
            let type = inputData.ReqBody.defaultType;
            action['RequestInputData']['ReqBody'].SelectedType = type;
            //this.processRawJsonData(inputData, action);
        },
        processRawJsonData(inputData, action) {
            if (inputData.ReqBody[this.METHOD_INPUT_PARAMETERS.REQ_BODY.RAW][this.METHOD_INPUT_PARAMETERS.REQ_BODY_RAW.JSON].isJson) {
                let parameters = inputData[this.METHOD_INPUT_PARAMETERS.BODY][this.METHOD_INPUT_PARAMETERS.REQ_BODY.RAW][this.METHOD_INPUT_PARAMETERS.REQ_BODY_RAW.JSON].parameters;
                let jsonData = this.generateJSONData(parameters);

                if (jsonData) {
                    action['RequestInputData']['ReqBody']['raw']['JSON'].data = JSON.stringify(jsonData, null, "\t");
                }
            }
        },
        generateJSONData(parameters) {
            var keyValuePairObj = {};

            for (let i = 0; i < parameters.length; i++) {
                let parameter = parameters[i];
                let key = parameter.Name;
                let value = parameter.SampleValue_c;
                let type = parameter.Type_c;

                if (key.indexOf('.') != -1) {
                    //object
                    let splits = key.split('.');
                    this.createObjectsAndAddData(splits, keyValuePairObj, value);
                } else {
                    let pairValue = this.getPairValue(type, value);
                    keyValuePairObj[key] = pairValue;
                }
            }

            return keyValuePairObj;
        },
        createObjectsAndAddData(array, keyValuePairObj, value) {
            for (let i = 0; i < array.length; i++) {
                let key = array[i];
                if (keyValuePairObj && keyValuePairObj[key]) {
                    //key is present
                    if (i == (array.length - 1)) {
                        keyValuePairObj[key] = value;
                    } else {
                        array.shift();
                        this.createObjectsAndAddData(array, keyValuePairObj[key], value);
                    }
                } else {
                    if (i == (array.length - 1)) {
                        keyValuePairObj[key] = value;
                    } else {
                        keyValuePairObj[key] = {};
                        array.shift();
                        this.createObjectsAndAddData(array, keyValuePairObj[key], value);
                    }
                }
            }
        },
        getPairValue(type, value) {
            let pairValue = null;

            if (type == 'Integer' || type == 'Float') {
                let array = value.split('.');
                if (array.length > 1) {
                    let length = array[1].length;
                    pairValue = parseFloat(value).toFixed(length);
                } else {
                    pairValue = parseInt(value);
                }
            } else if (type == 'Boolean') {
                switch (value) {
                    case 'Yes':
                    case 'True':
                        pairValue = true;
                        break;
                    default:
                        pairValue = false;
                        break;
                }
            } else {
                pairValue = value;
            }

            if (pairValue == null) {
                pairValue = '';
            }

            return pairValue;
        },
        async openSelectedAction(type) {
            var self = this;

            let actionsData = self.selectedApp.app.actionsData;
            let existingAction = null;
            if (type == 'Trigger') {
                existingAction = actionsData.selectedTrigger;
            } else {
                existingAction = actionsData.selectedAction;
            }

            let data = { action: null };
            if (existingAction) {
                data.action = existingAction;
                await self.$store.dispatch("platformData/setSelectedActionType", data);
            }
        },
        addInputInRequestInputData(inputData, actionVariable) {
            let placement = actionVariable.Placement_c;

            if (placement == 'None') {
                inputData.None.parameters.push(actionVariable);
            }

            if (placement == 'Url') {
                inputData.Params.Url.parameters.push(actionVariable);
            }

            if (placement == 'Query') {
                inputData.Params.Query.parameters.push(actionVariable);
            }

            if (placement == 'Header') {
                inputData.Headers.parameters.push(actionVariable);
            }

            if (placement == 'Body') {
                /*let sampleValue = actionVariable.SampleValue_c;
                let defaultValue = actionVariable.DefaultValue_c;*/
                if (inputData.ContentType.length > 0) {
                    let contentType = inputData.ContentType[0];
                    let isAdded = false;
                    if (contentType == this.HeaderKeys.APPLICATION_XWWW_FORM_URLENCODED) {
                        inputData.ReqBody[this.METHOD_INPUT_PARAMETERS.REQ_BODY.X_WWW_FORM_URL_ENCODED].parameters.push(actionVariable);
                        inputData.ReqBody.defaultType = this.METHOD_INPUT_PARAMETERS.REQ_BODY.X_WWW_FORM_URL_ENCODED;
                        isAdded = true;
                    }

                    if (contentType == this.HeaderKeys.APPLICATION_JSON) {
                        /*inputData.ReqBody[this.METHOD_INPUT_PARAMETERS.REQ_BODY.RAW][this.METHOD_INPUT_PARAMETERS.REQ_BODY_RAW.JSON].parameters.push(actionVariable);
                        inputData.ReqBody[this.METHOD_INPUT_PARAMETERS.REQ_BODY.RAW][this.METHOD_INPUT_PARAMETERS.REQ_BODY_RAW.JSON].isJson = true;
                        inputData.ReqBody.defaultType = this.METHOD_INPUT_PARAMETERS.REQ_BODY.RAW;*/
                        this.setRawJsonDataInRequestInputBody(inputData, actionVariable);
                        isAdded = true;
                    }

                    if (!isAdded) {
                        this.setRawJsonDataInRequestInputBody(inputData, actionVariable);
                    }
                } else {
                    this.setRawJsonDataInRequestInputBody(inputData, actionVariable);
                }
            }
        },
        setRawJsonDataInRequestInputBody(inputData, actionVariable) {
            inputData.ReqBody[this.METHOD_INPUT_PARAMETERS.REQ_BODY.RAW][this.METHOD_INPUT_PARAMETERS.REQ_BODY_RAW.JSON].parameters.push(actionVariable);
            inputData.ReqBody[this.METHOD_INPUT_PARAMETERS.REQ_BODY.RAW][this.METHOD_INPUT_PARAMETERS.REQ_BODY_RAW.JSON].isJson = true;
            inputData.ReqBody.defaultType = this.METHOD_INPUT_PARAMETERS.REQ_BODY.RAW;
        },
        addOutputInResponseOutputData(outputData, actionVariable) {
            let placement = actionVariable.Placement_c;
            if (placement == 'Body') {
                outputData.RespBody.parameters.push(actionVariable);
            }
        },
        addEmptyInputFieldRecord(inputData, action) {
            inputData.None.parameters.push(this.getEmptyFieldRecord('None', 'Input', action));

            inputData.Params.Url.parameters.push(this.getEmptyFieldRecord('Url', 'Input', action));
            inputData.Params.Query.parameters.push(this.getEmptyFieldRecord('Query', 'Input', action));

            inputData.Headers.parameters.push(this.getEmptyFieldRecord('Header', 'Input', action));

            inputData.ReqBody[this.METHOD_INPUT_PARAMETERS.REQ_BODY.FORM_DATA].parameters.push(this.getEmptyFieldRecord('Body', 'Input', action));
            inputData.ReqBody[this.METHOD_INPUT_PARAMETERS.REQ_BODY.X_WWW_FORM_URL_ENCODED].parameters.push(this.getEmptyFieldRecord('Body', 'Input', action));
        },
        addEmptyOutputFieldRecord(outputData, action) {
            outputData.RespBody.parameters.push(this.getEmptyFieldRecord('Body', 'Output', action));
        },
        async setLoadingStatus(status) {
            await this.$store.dispatch("platformData/setLoadingStatus", status);
        },

        async createNewAction(type) {
            let action = await this.createNewActionAndGetDetails(type, this.selectedApp.app);

            let selectedTrigger = null;
            let selectedAction = null;

            this.setExtraKeysToAction(action);
            action.UI_Variables.IsEdited = true;
            action['selectedUITab'] = 'Setup';
            action['IsSelected'] = true;

            let option = '';
            if (this.isTriggerType(action)) {
                selectedTrigger = action;
                option = this.SideMenuKeys.TRIGGERS;
            } else {
                selectedAction = action;
                option = this.SideMenuKeys.ACTIONS;
            }

            let actionObject = {
                ID: action.ID,
                Name: action.Name,
                Label_c: action.Label_c,
                Type_c: action.Type_c
            };

            let data = {
                actionsData: {
                    type: type,
                    selectedTrigger: selectedTrigger,
                    selectedAction: selectedAction
                },
                actionObject: actionObject
            };

            await this.$store.dispatch("platformData/setAppsNewlyCreatedActionData", data);

            await this.$store.dispatch("platformData/setSelectedActionType", { action: action });

            await this.setActionVariableToAction([], action, false);

            await this.$store.dispatch("platformData/setSelectedMenuOption", option);

            await this.$store.dispatch("platformData/refreshActionListData");
        },

        async createNewActionCustom(type) {
            let action = await this.createNewActionAndGetDetails(type, this.selectedApp.app);

            let selectedTrigger = null;
            let selectedAction = null;

            this.setExtraKeysToAction(action);
            action.UI_Variables.IsEdited = true;
            action['selectedUITab'] = 'Setup';
            action['IsSelected'] = true;

            let option = '';
            if (this.isTriggerType(action)) {
                selectedTrigger = action;
                option = this.SideMenuKeys.TRIGGERS;
            } else {
                selectedAction = action;
                option = this.SideMenuKeys.ACTIONS;
            }

            let actionObject = {
                ID: action.ID,
                Name: action.Name,
                Label_c: action.Label_c,
                Type_c: action.Type_c
            };

            let data = {
                actionsData: {
                    type: type,
                    selectedTrigger: selectedTrigger,
                    selectedAction: selectedAction
                },
                actionObject: actionObject
            };

          /*  await this.$store.dispatch("platformData/setAppsNewlyCreatedActionData", data);

            await this.$store.dispatch("platformData/setSelectedActionType", { action: action });

            await this.setActionVariableToAction([], action, false);

            /*await this.$store.dispatch("platformData/setSelectedMenuOption", option);

            await this.$store.dispatch("platformData/refreshActionListData");*/
            return action;
        },
        async cloneAction(oldSelectedAction, type) {
            if (typeof(oldSelectedAction.actionVariablesLoaded) == 'undefined') {
                this.$store.dispatch("toaster/show", { type: "warning", message: 'Please fetch action variables', time: 2500 });
            } else if (!oldSelectedAction.actionVariablesLoaded) {
                this.$store.dispatch("toaster/show", { type: "warning", message: 'Please fetch action variables', time: 2500 });
            } else {
                await this.$store.dispatch("platformData/setActionCloningModalStatus", true);
                await this.$store.dispatch("platformData/setActionCloningStatus", 'processing...');
                let action = Utils.deepCopyObject(oldSelectedAction);
                action.Label_c = this.getCopyVersionLabel(action.Label_c);
                let clonedAction = await this.cloneActionAndGetDetails(this.selectedApp.app, action);

                let response = await this.$store.dispatch("platformData/saveActionDetails", clonedAction);

                if (response.errorsData.length > 0) {
                    this.$store.dispatch("toaster/show", { type: "error", message: 'Error occured while creating action', time: 2500 });
                } else {
                    clonedAction.ID = response.proccesedRecord.ID;
                    clonedAction.Name = response.proccesedRecord.Name;

                    //set action details as parameter to show in modal 
                    let parameter = {
                        Name: clonedAction.Name,
                        Label_c: clonedAction.Label_c,
                        Type_c: clonedAction.Type_c,
                        Direction_c: '',
                        Placement_c: '',
                        OperationStatus: 'Created',
                        ParameterType: 'Action'
                    }

                    await this.$store.dispatch("platformData/addActionCloningParameterInData", parameter);

                    oldSelectedAction['IsSelected'] = false;

                    //set action structure

                    let selectedTrigger = null;
                    let selectedAction = null;

                    await this.setExtraKeysToAction(clonedAction);
                    clonedAction.UI_Variables.IsEdited = true;
                    clonedAction['selectedUITab'] = 'APIConsole';
                    clonedAction['IsSelected'] = true;
                    clonedAction['actionVariablesLoaded'] = true;
                    if (this.isTriggerType(clonedAction)) {
                        selectedTrigger = clonedAction;
                    } else {
                        selectedAction = clonedAction;
                    }

                    let actionObject = {
                        ID: clonedAction.ID,
                        Name: clonedAction.Name,
                        Label_c: clonedAction.Label_c,
                        Type_c: clonedAction.Type_c
                    };

                    let data = {
                        actionsData: {
                            type: type,
                            selectedTrigger: selectedTrigger,
                            selectedAction: selectedAction
                        },
                        actionObject: actionObject
                    };

                    await this.$store.dispatch("platformData/setAppsNewlyCreatedActionData", data);

                    await this.$store.dispatch("platformData/setSelectedActionType", { action: clonedAction });

                    await this.setActionVariableToAction([], clonedAction, false);

                    //initialize action variable clonings
                    let RequestInputData = action.RequestInputData;
                    let ResponseOutputData = action.ResponseOutputData;

                    await this.setRequestInputDataToClonedAction(RequestInputData, clonedAction);
                    await this.setResponseOutputDataToClonedAction(ResponseOutputData, clonedAction);

                    await this.setupActionVariablesData(clonedAction, true);
                    await this.processClonedActionRawJsonData(clonedAction, oldSelectedAction);
                    await this.$store.dispatch("platformData/setActionCloningStatus", 'completed');

                    await this.$store.dispatch("platformData/refreshActionListData");
                }
            }
        },
        async processClonedActionRawJsonData(clonedAction, oldSelectedAction) {
            let parameters = clonedAction.RequestInputData.ReqBody[this.METHOD_INPUT_PARAMETERS.REQ_BODY.RAW][this.METHOD_INPUT_PARAMETERS.REQ_BODY_RAW.JSON].parameters;
            if (parameters && parameters.length > 0) {
                let rawJson = oldSelectedAction['RequestInputData']['ReqBody']['raw']['JSON'].data;
                clonedAction['RequestInputData']['ReqBody']['raw']['JSON'].data = rawJson;

                let details = {
                    rawJson: rawJson,
                    action: clonedAction
                };
                await this.$store.dispatch("platformData/saveActionMetadataInTable", details);
            }
            /*//if (inputData.ReqBody[this.METHOD_INPUT_PARAMETERS.REQ_BODY.RAW][this.METHOD_INPUT_PARAMETERS.REQ_BODY_RAW.JSON].isJson) {
            	let parameters = inputData[this.METHOD_INPUT_PARAMETERS.BODY][this.METHOD_INPUT_PARAMETERS.REQ_BODY.RAW][this.METHOD_INPUT_PARAMETERS.REQ_BODY_RAW.JSON].parameters;
            	if (parameters && parameters.length > 0) {
            		let jsonData = this.generateJSONData(parameters);

            		if (jsonData) {
            			action['RequestInputData']['ReqBody']['raw']['JSON'].data = JSON.stringify(jsonData, null, "\t");
            		}
            	}				
            //}*/
        },
        async setRequestInputDataToClonedAction(RequestInputData, clonedAction) {
            //request input data
            let clonedRequestInputData = clonedAction.RequestInputData;

            let Headers = RequestInputData.Headers;
            let None = RequestInputData.None;
            let Url = RequestInputData.Params.Url;
            let Query = RequestInputData.Params.Query;

            let form_data = this.METHOD_INPUT_PARAMETERS.REQ_BODY.FORM_DATA;
            let x_www_form_urlencoded = this.METHOD_INPUT_PARAMETERS.REQ_BODY.X_WWW_FORM_URL_ENCODED;

            let formDataReqBody = RequestInputData.ReqBody[form_data];
            let xWwwUrlEncodedReqBody = RequestInputData.ReqBody[x_www_form_urlencoded];
            let rawJsonReqBody = RequestInputData.ReqBody['raw']['JSON'];

            let newHeaderParameters = await this.getUpdatedRequestParameters(Headers.parameters, clonedAction);
            clonedRequestInputData.Headers.parameters = newHeaderParameters;
            clonedRequestInputData.Headers.deletedParameters = [];

            let newNoneParameters = await this.getUpdatedRequestParameters(None.parameters, clonedAction);
            clonedRequestInputData.None.parameters = newNoneParameters;
            clonedRequestInputData.None.deletedParameters = [];

            let newUrlParameters = await this.getUpdatedRequestParameters(Url.parameters, clonedAction);
            clonedRequestInputData.Params.Url.parameters = newUrlParameters;
            clonedRequestInputData.Params.Url.deletedParameters = [];

            let newQueryParameters = await this.getUpdatedRequestParameters(Query.parameters, clonedAction);
            clonedRequestInputData.Params.Query.parameters = newQueryParameters;
            clonedRequestInputData.Params.Query.deletedParameters = [];

            let newFormDataParameters = await this.getUpdatedRequestParameters(formDataReqBody.parameters, clonedAction);
            clonedRequestInputData.ReqBody[form_data].parameters = newFormDataParameters;
            clonedRequestInputData.ReqBody[form_data].deletedParameters = [];

            let newXWwwUrlEncodedParameters = await this.getUpdatedRequestParameters(xWwwUrlEncodedReqBody.parameters, clonedAction);
            clonedRequestInputData.ReqBody[x_www_form_urlencoded].parameters = newXWwwUrlEncodedParameters;
            clonedRequestInputData.ReqBody[x_www_form_urlencoded].deletedParameters = [];

            let newRawJsonParameters = await this.getUpdatedRequestParameters(rawJsonReqBody.parameters, clonedAction);
            clonedRequestInputData.ReqBody['raw']['JSON'].parameters = newRawJsonParameters;
            clonedRequestInputData.ReqBody['raw']['JSON'].deletedParameters = [];
        },
        async setResponseOutputDataToClonedAction(ResponseOutputData, clonedAction) {
            //request input data
            let clonedResponseOutputData = clonedAction.ResponseOutputData;

            let RespBody = ResponseOutputData.RespBody;

            let newRespBodyParameters = await this.getUpdatedRequestParameters(RespBody.parameters, clonedAction);
            clonedResponseOutputData.RespBody.parameters = newRespBodyParameters;
            clonedResponseOutputData.RespBody.deletedParameters = [];
        },
        getUpdatedRequestParameters(parameters, clonedAction) {
            let newParameters = [];
            for (let i = 0; i < parameters.length; i++) {
                let parameter = parameters[i];
                if (parameter.ID > 0) {
                    parameter.ID = 0;
                    parameter['ActionId_c'].ID = clonedAction.ID;
                    parameter['ActionId_c'].Name = clonedAction.Name;

                    newParameters.push(parameter);
                }
            }
            return newParameters;
        },
        async setupActionVariablesData(action, showToastMessage) {
            let actionVariables = await this.retrieveActionVariablesData(action);
            let actionVaraiblesObject = {
                shouldAddParameters: true,
                actionVariables: actionVariables
            };

            let response = await this.$store.dispatch("platformData/saveActionVariablesInBulkMode", actionVaraiblesObject);
            await this.updateCloneUIVariables(response, action, showToastMessage);
            await this.setEmptyRecordsToNewlyCreatedAction(action);

            if (showToastMessage) {
                let hasError = false;

                let actionVariableErrorsData = response.errorsData;
                if (actionVariableErrorsData.length > 0) {
                    hasError = true;
                }
                if (hasError) {
                    this.$store.dispatch("toaster/show", { type: "success", message: 'Action cloned with some errors.', time: 2000 });
                } else {
                    this.$store.dispatch("toaster/show", { type: "success", message: 'Action cloned successfully..', time: 2000 });
                }
            }

        },
        setEmptyRecordsToNewlyCreatedAction(action) {
            action.RequestInputData.None.parameters.push(this.getEmptyFieldRecord('None', 'Input', action));

            action.RequestInputData.Params.Url.parameters.push(this.getEmptyFieldRecord('Url', 'Input', action));
            action.RequestInputData.Params.Query.parameters.push(this.getEmptyFieldRecord('Query', 'Input', action));

            action.RequestInputData.Headers.parameters.push(this.getEmptyFieldRecord('Header', 'Input', action));

            action.RequestInputData.ReqBody[this.METHOD_INPUT_PARAMETERS.REQ_BODY.FORM_DATA].parameters.push(this.getEmptyFieldRecord('Body', 'Input', action));
            action.RequestInputData.ReqBody[this.METHOD_INPUT_PARAMETERS.REQ_BODY.X_WWW_FORM_URL_ENCODED].parameters.push(this.getEmptyFieldRecord('Body', 'Input', action));
        },

        async createNewApp() {
            let app = this.getAppModel();

            app['selectedUITab'] = 'Details';
            await this.$store.dispatch("platformData/setSelectedApp", app);
            await this.$store.dispatch("platformData/setCreateNewAppStatus", false);
            await this.$store.dispatch("platformData/setNewAppInProcessStatus", true);
        },

        getAppModel() {
            return {
                API_DocumentationUrl_c: '',
                AccessTokenUrl_c: '',
                AppScript_c: '',
                AppWebhookDescription_c: '',
                AuthMapping_c: '',
                AuthTitleMapping_c: '',
                AuthTokenPlacement_c: 'None',
                AuthType_c: 'None',
                AuthVideoUrl_c: '',
                AuthorizationUrl_c: '',
                ClientId_c: '',
                ClientSecret_c: '',
                DeAuthorizationUrl_c: '',
                Description_c: '',
                HasCustomOAuth_c: false,
                ID: 0,
                IntegrationPageUrl_c: '',
                IsPremium_c: false,
                IsPublic_c: false,
                IsStandard_c: false,
                Is_Module_c: false,
                Label_c: 'New App',
                LogoUrl_c: '',
                ModifiedBy: {ID: 0, Name: ""},
                ModifiedOn: "",
                Name: 'NewApp',
                OAuth_AppDashboardUrl_c: '',
                Primary_Color_c: '',
                RefreshTokenUrl_c: '',
                RequestTokenUrl_c: '',
                Scopes_c: '',
                Slug_c: 'new-app',
                Tag: '',
                Website_link_c: '',
                UI_Variables: {
                    IsEdited: false,
                    IsAppDetailsEditedInAppSection: false,
                    IsAppDetailsEditedInAuthenticationSection: false,
                    IsAppCategoryParameterEdited: false,
                    IsAuthParameterEdited: false
                },
                OAuth: {
                    parameters: [],
                    IsEdited: false
                },
                AppCategories: {
                    deletedParameters: [],
                    parameters: [],
                    isLoaded: true,
                    IsEdited: false
                }
            };
        },
        async fetchAllActionsData(actionsData) {
            let actionIds = [],
                counter = 0;
            let triggers = actionsData.triggers;
            for (let i = 0; i < triggers.length; i++) {
                let action = triggers[i];
                //if (!this.checkIfActionVariablesAreLoaded(action)) {
                await this.fetchActionVariablesByActionId(action, false);
                //}
                if (action.ID > 0) {
                    actionIds.push({ oldActionId: action.ID, newActionId: 0, position: counter });
                }
                counter++;
            }

            let actions = actionsData.actions;
            for (let i = 0; i < actions.length; i++) {
                let action = actions[i];
                //if (!this.checkIfActionVariablesAreLoaded(action)) {
                await this.fetchActionVariablesByActionId(action, false);
                //}
                if (action.ID > 0) {
                    actionIds.push({ oldActionId: action.ID, newActionId: 0, position: counter });
                }
                counter++;
            }
            return actionIds;
        },
        async cloneAllActions(actionsData, app) {
            let triggers = Utils.deepCopyObject(actionsData.triggers);
            for (let i = 0; i < triggers.length; i++) {
                let action = triggers[i];
                await this.cloneActionForApp(action, 'Trigger', app);
            }

            let actions = Utils.deepCopyObject(actionsData.actions);
            for (let i = 0; i < actions.length; i++) {
                let action = actions[i];
                await this.cloneActionForApp(action, 'Action', app);
            }
        },
        async cloneActionForApp(oldSelectedAction, type, app) {
            let action = Utils.deepCopyObject(oldSelectedAction);
            //action.Label_c = action.Label_c + '-v2';
            let clonedAction = await this.cloneActionAndGetDetails(app, action);

            let response = await this.$store.dispatch("platformData/saveActionDetails", clonedAction);

            if (response.errorsData.length > 0) {
                this.$store.dispatch("toaster/show", { type: "error", message: 'Error occured while creating action', time: 2500 });
            } else {
                clonedAction.ID = response.proccesedRecord.ID;
                clonedAction.Name = response.proccesedRecord.Name;

                //set action details as parameter to show in modal 
                let parameter = {
                    Name: clonedAction.Name,
                    Label_c: clonedAction.Label_c,
                    Type_c: clonedAction.Type_c,
                    Direction_c: '',
                    Placement_c: '',
                    OperationStatus: 'Created',
                    ParameterType: 'Action'
                }

                await this.$store.dispatch("platformData/addActionCloningParameterInData", parameter);

                oldSelectedAction['IsSelected'] = false;

                //set action structure

                let selectedTrigger = null;
                let selectedAction = null;

                await this.setExtraKeysToAction(clonedAction);
                clonedAction.UI_Variables.IsEdited = true;
                clonedAction['selectedUITab'] = 'APIConsole';
                clonedAction['IsSelected'] = false;
                clonedAction['actionVariablesLoaded'] = true;
                if (this.isTriggerType(clonedAction)) {
                    selectedTrigger = clonedAction;
                } else {
                    selectedAction = clonedAction;
                }

                let actionObject = {
                    ID: clonedAction.ID,
                    Name: clonedAction.Name,
                    Label_c: clonedAction.Label_c,
                    Type_c: clonedAction.Type_c
                };

                let data = {
                    actionsData: {
                        type: type,
                        selectedTrigger: selectedTrigger,
                        selectedAction: selectedAction
                    },
                    actionObject: actionObject
                };

                if (type == 'Trigger') {
                    app.actionsData.triggers.push(data.actionsData.selectedTrigger);
                } else {
                    app.actionsData.actions.push(data.actionsData.selectedAction);
                }

                //await this.$store.dispatch("platformData/setAppsNewlyCreatedActionData", data);

                //await this.$store.dispatch("platformData/setSelectedActionType", { action: clonedAction });

                await this.setActionVariableToAction([], clonedAction, false);

                //initialize action variable clonings
                let RequestInputData = action.RequestInputData;
                let ResponseOutputData = action.ResponseOutputData;

                await this.setRequestInputDataToClonedAction(RequestInputData, clonedAction);
                await this.setResponseOutputDataToClonedAction(ResponseOutputData, clonedAction);

                await this.setupActionVariablesData(clonedAction, false);
            }
        },
        async cloneAllAuthVariables(app) {
            let authVariables = await this.retrieveAuthVariablesData(app);
            let authVaraiblesObject = {
                shouldAddParameters: true,
                authVariables: authVariables
            };

            await this.$store.dispatch("platformData/saveAuthVariablesInBulkMode", authVaraiblesObject);
        },
        addAuthVariablesToClonedApp(clonedApp) {
            let parameters = clonedApp.authVariables.parameters;
            for (let i = 0; i < parameters.length; i++) {
                let parameter = parameters[i];
                if (parameter.ID > 0) {
                    parameter.ID = 0;
                    parameter['AppId_c'].ID = clonedApp.ID;
                    parameter['AppId_c'].Name = clonedApp.Name;
                }
            }
        },
        async cloneApp() {
            let app = this.selectedApp.app;
            let clonedApp = await this.cloneAppAndGetDetails(app);
            let response = await this.$store.dispatch("platformData/saveAppDetails", clonedApp);
            if (response.errorsData.length > 0) {
                this.$store.dispatch("toaster/show", { type: "error", message: 'Error occured while creating app', time: 2500 });
            } else {
                clonedApp.ID = response.proccesedRecord.ID;
                /*clonedApp.Label_c = response.proccesedRecord.Label_c + ' Copy';
                clonedApp.Name = response.proccesedRecord.Name + 'Copy';*/
                clonedApp['authVariables'] = {
                    deletedParameters: [],
                    parameters: []
                };

                await this.$store.dispatch("platformData/setCloningAppId", clonedApp.ID);

                let parameter = {
                    Name: clonedApp.Name,
                    Label_c: clonedApp.Label_c,
                    Type_c: 'App',
                    Direction_c: '',
                    Placement_c: '',
                    OperationStatus: 'Created',
                    ParameterType: 'App'
                }

                await this.$store.dispatch("platformData/addActionCloningParameterInData", parameter);

                await this.$store.dispatch("platformData/setActionCloningModalStatus", true);
                await this.$store.dispatch("platformData/setActionCloningStatus", 'processing...');

                //handle app categories
                await this.fetchAndCloneAllAppCategories(app, clonedApp);

                //handle auth variables
                clonedApp['authVariables']['parameters'] = Utils.deepCopyObject(app.authVariables.parameters);
                await this.addAuthVariablesToClonedApp(clonedApp);
                await this.cloneAllAuthVariables(clonedApp);

                let actionsData = app.actionsData;
                if (actionsData) {
                    await this.$store.dispatch("platformData/setActionCloningStatus", 'fetching app actions data');
                    var oldActionIdsData = await this.fetchAllActionsData(actionsData);
                    await this.$store.dispatch("platformData/setActionCloningStatus", 'processing...');
                    let clonedActionsData = Utils.deepCopyObject(app.actionsData);
                    clonedApp = Utils.deepCopyObject(clonedApp);
                    clonedApp['actionsData'] = clonedActionsData;
                    //await this.cloneAllActions(clonedActionsData, clonedApp);
                    if (clonedActionsData && ((clonedActionsData.triggers && clonedActionsData.triggers.length > 0) ||
                            (clonedActionsData.actions && clonedActionsData.actions.length > 0))) {
                        await this.cloneAllActionsInBulk(clonedActionsData, clonedApp, oldActionIdsData, true);
                    }
                    await this.$store.dispatch("platformData/setActionCloningStatus", 'completed');

                    this.$store.dispatch("toaster/show", { type: "success", message: 'App cloned successfully..', time: 2000 });

                    await this.$store.dispatch("platformData/fetchApps");
                }
            }
        },

        async fetchAndCloneAllAppCategories(app, clonedApp) {
            let parameters = [];
            if (!app.AppCategories.isLoaded) {
                await this.$store.dispatch("platformData/setActionCloningStatus", 'fetching app categories');
                let response = await this.$store.dispatch("platformData/fetchAppCategoriesData", app.ID);
                if (response.Success && response.Data) {
                    let appCategories = app.AppCategories;
                    appCategories.parameters = Utils.deepCopyObject(response.Data);
                    appCategories.deletedParameters = [];
                    appCategories.isLoaded = true;
                    parameters = response.Data;
                }
            } else {
                parameters = Utils.deepCopyObject(app.AppCategories.parameters);
            }

            if (parameters.length > 0) {
                for (let i = 0; i < parameters.length; i++) {
                    let parameter = parameters[i];
                    parameter.ID = 0;
                    parameter.App_c.ID = clonedApp.ID;
                    parameter.App_c.Name = clonedApp.Name;
                }

                clonedApp.AppCategories = {
                    parameters: Utils.deepCopyObject(parameters),
                    deletedParameters: []
                };

                let Records = this.createAppCategoryParameterRecords(clonedApp);
                if (Records) {
                    await this.$store.dispatch("platformData/setActionCloningStatus", 'saving app categories');
                    let data = [{ Records: Records, SelectedType: 'AppCategory' }];

                    let appCategoryVaraiblesObject = {
                        shouldAddParameters: true,
                        appCategories: data
                    };

                    await this.$store.dispatch("platformData/saveAppCategoriesInBulkMode", appCategoryVaraiblesObject);
                }
            }
        },

        createAppCategoryParameterRecords(app) {
            let methodObject = app.AppCategories;

            return this.createInputParamterRecords(methodObject, false);
        },

        async fetchSelectedActionsData(actionsData) {
            let actionIds = [],
                counter = 0;
            for (let i = 0; i < actionsData.length; i++) {
                let action = actionsData[i];
                await this.fetchActionVariablesByActionId(action, true);
                if (action.ID > 0) {
                    actionIds.push({ oldActionId: action.ID, newActionId: 0, position: counter });
                }
                counter++;
            }
            return actionIds;
        },

        async cloneMulitpleActionsFromOneAppToAnother(actionsData, clonedApp) {
            await this.$store.dispatch("platformData/setCloningAppId", clonedApp.ID);
            await this.$store.dispatch("platformData/setCloningMultipleActionStatus", true);
            await this.$store.dispatch("platformData/setActionCloningModalStatus", true);
            await this.$store.dispatch("platformData/setActionCloningStatus", 'processing...');

            await this.$store.dispatch("platformData/setActionCloningStatus", 'fetching actions data');
            var oldActionIdsData = await this.fetchSelectedActionsData(actionsData);

            await this.$store.dispatch("platformData/setActionCloningStatus", 'processing...');

            let clonedActionsData = Utils.deepCopyObject(actionsData);
            clonedApp = Utils.deepCopyObject(clonedApp);
            clonedApp['actionsData'] = clonedActionsData;
            await this.cloneAllActionsInBulk(clonedActionsData, clonedApp, oldActionIdsData, false);
            await this.$store.dispatch("platformData/setActionCloningStatus", 'completed');

            this.$store.dispatch("toaster/show", { type: "success", message: 'All Action cloned successfully..', time: 2000 });
        },

        async cloneAllActionsInBulk(actionsData, app, oldActionIdsData, isAll) {
            await this.setLoadingStatus(true);
            var allActions = [];
            var actionsWithVariables = [];
            var delegatesData = [];
            if (isAll) {
                //isAll variable = true: to clone all actions for app
                let triggers = Utils.deepCopyObject(actionsData.triggers);
                for (let i = 0; i < triggers.length; i++) {
                    let action = triggers[i];
                    actionsWithVariables.push({
                        oldActionId: action.ID,
                        actionVariables: action.actionVariables
                    });

                    await this.addDelegatesDataForCloning(action, delegatesData);

                    let clonedAction = await this.cloneActionAndGetDetailsForBulkAPI(app, action);
                    delete clonedAction['CreatedBy'];
                    delete clonedAction['CreatedOn'];
                    delete clonedAction['ModifiedBy'];
                    delete clonedAction['ModifiedOn'];
                    delete clonedAction['Owner'];
                    allActions.push(clonedAction);
                }

                let actions = Utils.deepCopyObject(actionsData.actions);
                for (let i = 0; i < actions.length; i++) {
                    let action = actions[i];
                    actionsWithVariables.push({
                        oldActionId: action.ID,
                        actionVariables: action.actionVariables
                    });

                    await this.addDelegatesDataForCloning(action, delegatesData);

                    let clonedAction = await this.cloneActionAndGetDetailsForBulkAPI(app, action);
                    delete clonedAction['CreatedBy'];
                    delete clonedAction['CreatedOn'];
                    delete clonedAction['ModifiedBy'];
                    delete clonedAction['ModifiedOn'];
                    delete clonedAction['Owner'];
                    allActions.push(clonedAction);
                }
            } else {
                //isAll variable = false: clone selected actions to destination app
                let actions = Utils.deepCopyObject(actionsData);
                for (let i = 0; i < actions.length; i++) {
                    let action = actions[i];
                    actionsWithVariables.push({
                        oldActionId: action.ID,
                        actionVariables: action.actionVariables
                    });

                    let clonedAction = await this.cloneActionAndGetDetailsForBulkAPI(app, action);
                    delete clonedAction['CreatedBy'];
                    delete clonedAction['CreatedOn'];
                    delete clonedAction['ModifiedBy'];
                    delete clonedAction['ModifiedOn'];
                    delete clonedAction['Owner'];
                    allActions.push(clonedAction);
                }
            }

            await this.$store.dispatch("platformData/setActionCloningStatus", 'cloning all action...');

            let data = await proxyHelper.createAppActionInBulkMode();
            data['payload'] = allActions;

            let response = await this.$store.dispatch("platformData/performWebAPICall", data);
            if (response) {
                for (var j = 0; j < response.Data.length; j++) {
                    let errorObject = { isError: false, message: '' };
                    let recordResponse = response.Data[j];
                    let record = allActions[j];
                    if (recordResponse.IsSuccessful) {
                        let details = { newActionId: recordResponse.InsertedId, index: j };
                        this.updateNewActionIdToOldActionIdsData(oldActionIdsData, details);

                        allActions[j].ID = recordResponse.InsertedId;
                        allActions[j].Name = recordResponse.Record.Name;
                        allActions[j]['Error'] = false;

                        if (isAll) {
                            delegatesData[j].newActionId = recordResponse.InsertedId;
                            delegatesData[j].record = recordResponse.Record;
                        }
                    } else {
                        var errorMessage = Utils.getErrorStringFromErrors(recordResponse.Errors);
                        errorObject = { isError: true, message: errorMessage };
                        allActions[j]['Error'] = true;
                    }

                    if (errorObject.isError) {
                        record['OperationStatus'] = 'Failed';
                    } else {
                        record['OperationStatus'] = 'Created';
                    }

                    record['ParameterType'] = 'Action';

                    await this.$store.dispatch("platformData/addActionCloningParameterInData", record);
                }
                //after cloning all actions scroll to bottom
                //this.scrollToBottomOfModal();

                await this.updateDelegatesDataIfNeedInNewlyCreatedActions(delegatesData);

                var allActionVariables = [];
                for (let i = 0; i < allActions.length; i++) {
                    if (!allActions[i].Error) {
                        var actionDetails = allActions[i];
                        var actionVariables = actionsWithVariables[i].actionVariables;
                        for (let inputs = 0; inputs < actionVariables.inputFields.length; inputs++) {
                            let inputField = actionVariables.inputFields[inputs];
                            let newField = this.getProperActionVariableData(inputField);
                            newField['ActionId_c'] = actionDetails.ID;
                            await this.handleDynamicDropdownFieldData(newField, oldActionIdsData);

                            allActionVariables.push(newField);
                        }

                        for (let outputs = 0; outputs < actionVariables.outputFields.length; outputs++) {
                            let outputField = actionVariables.outputFields[outputs];
                            let newField = this.getProperActionVariableData(outputField);
                            newField['ActionId_c'] = actionDetails.ID;

                            allActionVariables.push(newField);
                        }
                    }
                }

                if (allActionVariables.length > 0) {
                    await this.$store.dispatch("platformData/setActionCloningStatus", 'cloning all action variables...');
                    await this.cloneAllActionVariablesInBulkMode(allActionVariables);
                    //after cloning all action-variables scroll to bottom
                    //this.scrollToBottomOfModal();
                } else {
                    await this.setLoadingStatus(false);
                }
            } else {
                await this.setLoadingStatus(false);
            }
        },

        async updateDelegatesDataIfNeedInNewlyCreatedActions(delegatesData) {
            if (delegatesData && delegatesData.length > 0) {
                var updatedActions = [];
                let delegateKeys = [
                    'DelegateActionId_c', 'PollingDelegateActionId_c',
                    'ResourceDelegateActionId_c'
                ];
                for (let i = 0; i < delegatesData.length; i++) {
                    let item = delegatesData[i];
                    if (item.hasDelegates && item.newActionId != 0 && item.record != null) {
                        let foundDelegate = false;
                        for (let j = 0; j < delegateKeys.length; j++) {
                            let delegateKey = delegateKeys[j];
                            let delegate = item.data[delegateKey];
                            if (delegate.oldId > 0) {
                                let newActionId = await this.findNewDelegateActionIdByOldId(delegatesData, delegate.oldId);
                                if (newActionId > 0) {
                                    delegate.newId = newActionId;
                                    item.record[delegateKey] = delegate.newId;
                                    foundDelegate = true;
                                }
                            }
                        }
                        if (foundDelegate) {
                            item.record.AppId_c = (item.record.AppId_c.ID) ? item.record.AppId_c.ID : 0;
                            item.record.Entity_c = (item.record.Entity_c.ID) ? item.record.Entity_c.ID : 0;
                            delete item.record['CreatedBy'];
                            delete item.record['CreatedOn'];
                            delete item.record['ModifiedBy'];
                            delete item.record['ModifiedOn'];
                            delete item.record['Owner'];
                            delete item.record['IsDeleted'];
                            updatedActions.push(item.record);
                        }
                    }
                }

                if (updatedActions.length > 0) {
                    //update actions delegates details here
                    let data = await proxyHelper.updateAppActionInBulkMode();
                    data['payload'] = updatedActions;
                    let response = await this.$store.dispatch("platformData/performWebAPICall", data);
                    if (response.success) {
                        //this.scrollToBottomOfModal();
                    }
                }
            }
        },

        findNewDelegateActionIdByOldId(delegatesData, oldActionId) {
            let newActionId = 0;
            for (let i = 0; i < delegatesData.length; i++) {
                if (delegatesData[i].oldActionId === oldActionId) {
                    newActionId = delegatesData[i].newActionId;
                    break;
                }
            }
            return newActionId;
        },

        addDelegatesDataForCloning(action, delegatesData) {
            let object = {
                DelegateActionId_c: { oldId: 0, newId: 0 },
                PollingDelegateActionId_c: { oldId: 0, newId: 0 },
                ResourceDelegateActionId_c: { oldId: 0, newId: 0 }
            };
            let found = false;
            for (let key in object) {
                if (action[key] && action[key].ID &&
                    action[key].ID > 0) {
                    found = true;
                    object[key].oldId = action[key].ID;
                }
            }

            delegatesData.push({
                oldActionId: action.ID,
                newActionId: 0,
                data: object,
                record: null,
                hasDelegates: found
            });
        },

        scrollToBottomOfModal() {
            let element = document.getElementById('appActionCloningModal');
            if (element) {
                let body = element.querySelector('.itlModalBody');
                setTimeout(function() {
                    body.scroll({ top: body.scrollHeight, behavior: 'smooth' });
                }, 20);
            }
        },

        updateNewActionIdToOldActionIdsData(oldActionIdsData, details) {
            for (let i = 0; i < oldActionIdsData.length; i++) {
                if (oldActionIdsData[i].position == details.index) {
                    oldActionIdsData[i].newActionId = details.newActionId;
                    break;
                }
            }
        },

        handleDynamicDropdownFieldData(newField, oldActionIdsData) {
            if (newField.Type_c == this.ACTION_VARIABLE_TYPES.DYNAMIC_DROPDOWN) {
                //DynamicDropdownKey_c
                this.checkAndUpdateActionIdForDynamicDropdownField(newField, oldActionIdsData, 'DynamicDropdownKey_c');

                //DynamicSearchKey_c
                this.checkAndUpdateActionIdForDynamicDropdownField(newField, oldActionIdsData, 'DynamicSearchKey_c');
            }
        },

        checkAndUpdateActionIdForDynamicDropdownField(newField, oldActionIdsData, key) {
            if (!Utils.isNullOrEmpty(newField[key]) && newField[key].indexOf('.') != -1) {
                let value = newField[key];
                let array = value.split('.');
                if (array.length > 1) {
                    let oldActionId = array[0];
                    for (let i = 0; i < oldActionIdsData.length; i++) {
                        if (oldActionIdsData[i].oldActionId == oldActionId) {
                            newField[key] = oldActionIdsData[i].newActionId + '.' + array[1];
                            break;
                        }
                    }
                }
            }
        },

        async cloneAllActionVariablesInBulkMode(allActionVariables) {
            let data = await proxyHelper.createActionVariableInBulkMode();
            data['payload'] = allActionVariables;

            let response = await this.$store.dispatch("platformData/performWebAPICall", data);
            if (response && response.Data) {
                for (var j = 0; j < response.Data.length; j++) {
                    let errorObject = { isError: false, message: '' };
                    let recordResponse = response.Data[j];
                    let record = allActionVariables[j];
                    if (recordResponse.IsSuccessful) {
                        allActionVariables[j].ID = recordResponse.InsertedId;
                        allActionVariables[j].Name = recordResponse.Record.Name;
                        allActionVariables[j]['Error'] = false;
                    } else {
                        var errorMessage = Utils.getErrorStringFromErrors(recordResponse.Errors);
                        errorObject = { isError: true, message: errorMessage };
                        allActionVariables[j]['Error'] = true;
                    }

                    if (errorObject.isError) {
                        record['OperationStatus'] = 'Failed';
                    } else {
                        record['OperationStatus'] = 'Created';
                    }

                    record['ParameterType'] = 'ActionVariable';

                    await this.$store.dispatch("platformData/addActionCloningParameterInData", record);
                }
                await this.setLoadingStatus(false);
            } else {
                await this.setLoadingStatus(false);
            }
        },

        getProperActionVariableData(field) {
            field['ActionId_c'] = field.ActionId_c.ID;
            field['Entity_Property_c'] = field.Entity_Property_c.ID;
            field['Lookup_Entity_c'] = field.Lookup_Entity_c.ID;
            field['ID'] = 0;
            delete field['CreatedBy'];
            delete field['CreatedOn'];
            delete field['ModifiedBy'];
            delete field['ModifiedOn'];
            delete field['DeletedBy'];
            delete field['DeletedOn'];
            delete field['Owner'];
            delete field['UI_Variables'];
            return field;
        },

        variablesAreLoadedOrNot(actionId) {
            for (let i = 0; i < this.actionList.length; i++) {
                if (this.actionList[i].ID == actionId) {
                    return this.actionList[i].variablesLoaded;
                }
            }
            return false;
        },

        getActionByIdFromAppActions(actionId) {
            var self = this;

            let action = null;
            let actionsData = self.selectedApp.app.actionsData;
            action = self.findActionByActionId(actionsData.triggers, actionId);
            if (action == null) {
                action = self.findActionByActionId(actionsData.actions, actionId);
            }

            return action;
        },
        findActionByActionId(actions, actionId) {
            let action = null;
            for (let i = 0; i < actions.length; i++) {
                let item = actions[i];
                if (item.ID == actionId) {
                    action = item;
                    break;
                }
            }
            return action;
        }
    }
}