<script setup>
import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue'
import APIConsole from '@/platform/components/APIConsole/APIConsole'
import AppActions from "@/platform/js/mixins/AppActions";
import {ref, onMounted } from 'vue'

var app = ref( {
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
} );

var appAction = ref({
	"Owner": {
		"ID": 13,
		"Name": "Vivek Gotraj"
	},
	"Type_c": "Action",
	"Label_c": "Create company",
	"AppId_c": {
		"ID": 1185,
		"Name": "VivekCompanyHubScriptTest"
	},
	"Description_c": "",
	"StepDescription_c": "Company created",
	"Url_c": "https://api.companyhub.com/v1/tables/company",
	"Method_c": "POST",
	"ActionScript_c": "var action = {\n    pre: function (request) {\n        var requestBody;\n        if (request.Body != \"\") {\n            requestBody = __Lib.removeNullOrEmptyFields(JSON.parse(request.Body));\n        } else {\n            requestBody = {};\n        }\n        /*Pre: Injected code begins*/\n        /*Pre: Injected code ends*/\n        return {\n            Body: JSON.stringify(requestBody)\n        };\n    },\n    post: function (response) {\n\n        var result = __Lib.checkError(response);\n        if (result.isErrorFound) {\n            return __Lib.returnError(result, response);\n        }\n        var responseBody = JSON.parse(response.Body);\n        /*Post: Injected code begins*/\n        /*Post: Injected code ends*/\n        return success(JSON.stringify(responseBody));\n    },\n    inputFields: function (actionParamsAsJson, supportsStandardDateFormat) {\n        return __Lib.setCustomFields(actionParamsAsJson, \"\");\n    },\n    outputFields: function (actionParamsAsJson, supportsStandardDateFormat) {\n        return __Lib.setCustomFields(actionParamsAsJson, \"\");\n    }\n};",
	"IsTestAction_c": false,
	"IsHidden_c": false,
	"DelegateActionId_c": {
		"ID": 0,
		"Name": ""
	},
	"DelegateActionLabel_c": "",
	"ResourceDelegateActionId_c": {
		"ID": 0,
		"Name": ""
	},
	"RecordsContainerKey_c": "",
	"RecordIdentifierKey_c": "",
	"Tag": null,
	"HasDynamicFields_c": true,
	"Entity_c": {
		"ID": 0,
		"Name": ""
	},
	"Operation_Type_c": null,
	"Webhook_Description_c": "",
	"KeepAsListKey_c": "",
	"SupportsWebhookSubscription_c": true,
	"Webhook_Event_c": "",
	"Record_NameKey_c": "",
	"TestRecordDescription_c": "",
	"PollingDelegateActionId_c": {
		"ID": 0,
		"Name": ""
	},
	"WebhookUrlPasteLink_c": "",
	"Order_c": null,
	"ErrorOnDuplicateEntry_c": false,
	"CreateDelegateActionId_c": {
		"ID": 0,
		"Name": ""
	},
	"UpdateDelegateActionId_c": {
		"ID": 0,
		"Name": ""
	},
	"SupportsPagination_c": false,
	"CreatedOn": "2022-04-27T12:44:17",
	"CreatedBy": {
		"ID": 13,
		"Name": "Vivek Gotraj"
	},
	"ModifiedOn": "2023-03-22T06:32:54",
	"ModifiedBy": {
		"ID": 13,
		"Name": "Vivek Gotraj"
	},
	"ID": 16816,
	"Name": "AA13003",
	"DeletedOn": null,
	"DeletedBy": {
		"ID": 0,
		"Name": ""
	},
	"IsSelected": true,
	"searchKey": "",
	"actionVariablesLoaded": true,
	"selectedUITab": "APIConsole",
	"IsActionTypeChanged": false,
	"metadata": {
		"isFetched": true,
		"meta": "{\"Request\":{\"Raw\":{\"JSON\":\"{\\n\\t\\\"value\\\": \\\"MercadoPago\\\",\\n\\t\\\"htmlName\\\": \\\"MercadoPago\\\"\\n}\"}}}",
		"ID": 6038
	},
	"TestFormUI": {
		"metadata": {
			"outputFields": [],
			"inputFields": [],
			"fieldsLabels": {},
			"searchFieldsLabels": {}
		},
		"refreshFieldCounter": 0,
		"isLoadingByRefreshField": false,
		"IsInputOutputFetched": false,
		"requestBody": null,
		"actionParams": {},
		"searchParams": {},
		"isLoading": false,
		"requestResponseDataModal": {
			"showModal": false,
			"showLink": false,
			"jsonData": {
				"responseJson": "",
				"requestJson": ""
			}
		}
	},
	"UI_Variables": {
		"IsEdited": false,
		"IsLabelUpdated": false,
		"IsInputParameterEdited": false,
		"IsOutputParameterEdited": false
	},
	"RequestInputData": {
		"methodsInputParameter": "Params",
		"None": {
			"selectAllPairs": false,
			"parameters": [
				{
					"ActionId_c": {
						"ID": 16816,
						"Name": "AA13003"
					},
					"Choices_c": "",
					"Date_Format_c": "",
					"DefaultValue_c": "",
					"Description_c": "",
					"Direction_c": "Input",
					"DynamicDropdownKey_c": "",
					"DynamicSearchKey_c": "",
					"Entity_Property_c": {
						"ID": 0,
						"Name": ""
					},
					"ID": 0,
					"IsSampleValueField_c": "",
					"IsRequired_c": "",
					"IsRecordIdentifier_c": "",
					"Label_c": "",
					"Lookup_EntityField_c": "",
					"Lookup_Entity_c": {
						"ID": 0,
						"Name": ""
					},
					"Name": "",
					"Order_c": "",
					"ParentKey_c": "",
					"Placeholder_c": "",
					"Placement_c": "None",
					"SampleValue_c": "",
					"ShowDescriptionAboveField_c": "",
					"SupportsRefreshFields_c": "",
					"Type_c": "String",
					"UI_Variables": {
						"IsSelected": false,
						"IsFixedValue": false,
						"IsExpanded": false,
						"DynamicDropdownSources": {
							"keySource": {
								"id": 0,
								"key": "",
								"displayLabel": ""
							},
							"searchsource": {
								"id": 0,
								"key": "",
								"displayLabel": ""
							}
						}
					}
				}
			],
			"deletedParameters": []
		},
		"Params": {
			"SelectedType": "Url",
			"Query": {
				"selectAllPairs": false,
				"parameters": [
					{
						"ActionId_c": {
							"ID": 16816,
							"Name": "AA13003"
						},
						"Choices_c": "",
						"Date_Format_c": "",
						"DefaultValue_c": "",
						"Description_c": "",
						"Direction_c": "Input",
						"DynamicDropdownKey_c": "",
						"DynamicSearchKey_c": "",
						"Entity_Property_c": {
							"ID": 0,
							"Name": ""
						},
						"ID": 0,
						"IsSampleValueField_c": "",
						"IsRequired_c": "",
						"IsRecordIdentifier_c": "",
						"Label_c": "",
						"Lookup_EntityField_c": "",
						"Lookup_Entity_c": {
							"ID": 0,
							"Name": ""
						},
						"Name": "",
						"Order_c": "",
						"ParentKey_c": "",
						"Placeholder_c": "",
						"Placement_c": "Query",
						"SampleValue_c": "",
						"ShowDescriptionAboveField_c": "",
						"SupportsRefreshFields_c": "",
						"Type_c": "String",
						"UI_Variables": {
							"IsSelected": false,
							"IsFixedValue": false,
							"IsExpanded": false,
							"DynamicDropdownSources": {
								"keySource": {
									"id": 0,
									"key": "",
									"displayLabel": ""
								},
								"searchsource": {
									"id": 0,
									"key": "",
									"displayLabel": ""
								}
							}
						}
					}
				],
				"deletedParameters": []
			},
			"Url": {
				"selectAllPairs": false,
				"parameters": [
					{
						"ActionId_c": {
							"ID": 16816,
							"Name": "AA13003"
						},
						"Choices_c": "",
						"Date_Format_c": "",
						"DefaultValue_c": "",
						"Description_c": "",
						"Direction_c": "Input",
						"DynamicDropdownKey_c": "",
						"DynamicSearchKey_c": "",
						"Entity_Property_c": {
							"ID": 0,
							"Name": ""
						},
						"ID": 0,
						"IsSampleValueField_c": "",
						"IsRequired_c": "",
						"IsRecordIdentifier_c": "",
						"Label_c": "",
						"Lookup_EntityField_c": "",
						"Lookup_Entity_c": {
							"ID": 0,
							"Name": ""
						},
						"Name": "",
						"Order_c": "",
						"ParentKey_c": "",
						"Placeholder_c": "",
						"Placement_c": "Url",
						"SampleValue_c": "",
						"ShowDescriptionAboveField_c": "",
						"SupportsRefreshFields_c": "",
						"Type_c": "String",
						"UI_Variables": {
							"IsSelected": false,
							"IsFixedValue": false,
							"IsExpanded": false,
							"DynamicDropdownSources": {
								"keySource": {
									"id": 0,
									"key": "",
									"displayLabel": ""
								},
								"searchsource": {
									"id": 0,
									"key": "",
									"displayLabel": ""
								}
							}
						}
					}
				],
				"deletedParameters": []
			}
		},
		"Authentication": {
			"useAppAuthentication": true,
			"selectAllPairs": false,
			"parameters": [],
			"deletedParameters": []
		},
		"Headers": {
			"selectAllPairs": false,
			"parameters": [
				{
					"Name": "Content-Type",
					"Owner": {
						"ID": 13,
						"Name": "Vivek Gotraj"
					},
					"Label_c": "Content Type",
					"Type_c": "String",
					"ParentKey_c": "",
					"ActionId_c": {
						"ID": 16816,
						"Name": "AA13003"
					},
					"Placeholder_c": "",
					"DefaultValue_c": "application/json",
					"Description_c": "",
					"Placement_c": "Header",
					"SampleValue_c": "application/json",
					"Choices_c": "",
					"IsRequired_c": false,
					"Direction_c": "Input",
					"DynamicSearchKey_c": "",
					"DynamicDropdownKey_c": "",
					"Tag": null,
					"Entity_Property_c": {
						"ID": 0,
						"Name": ""
					},
					"Date_Format_c": "",
					"Lookup_Entity_c": {
						"ID": 0,
						"Name": ""
					},
					"Lookup_EntityField_c": "",
					"SupportsRefreshFields_c": false,
					"Order_c": null,
					"IsSampleValueField_c": false,
					"ShowDescriptionAboveField_c": false,
					"IsRecordIdentifier_c": false,
					"CreatedOn": "2022-04-27T12:44:18",
					"CreatedBy": {
						"ID": 13,
						"Name": "Vivek Gotraj"
					},
					"ModifiedOn": "2022-04-27T12:44:18",
					"ModifiedBy": {
						"ID": 13,
						"Name": "Vivek Gotraj"
					},
					"ID": 328017,
					"DeletedOn": null,
					"DeletedBy": {
						"ID": 0,
						"Name": ""
					},
					"UI_Variables": {
						"IsSelected": true,
						"IsFixedValue": false,
						"IsExpanded": false,
						"IsEdited": false,
						"DynamicDropdownSources": {
							"keySource": {
								"id": 0,
								"key": "",
								"displayLabel": ""
							},
							"searchsource": {
								"id": 0,
								"key": "",
								"displayLabel": ""
							}
						}
					}
				},
				{
					"ActionId_c": {
						"ID": 16816,
						"Name": "AA13003"
					},
					"Choices_c": "",
					"Date_Format_c": "",
					"DefaultValue_c": "",
					"Description_c": "",
					"Direction_c": "Input",
					"DynamicDropdownKey_c": "",
					"DynamicSearchKey_c": "",
					"Entity_Property_c": {
						"ID": 0,
						"Name": ""
					},
					"ID": 0,
					"IsSampleValueField_c": "",
					"IsRequired_c": "",
					"IsRecordIdentifier_c": "",
					"Label_c": "",
					"Lookup_EntityField_c": "",
					"Lookup_Entity_c": {
						"ID": 0,
						"Name": ""
					},
					"Name": "",
					"Order_c": "",
					"ParentKey_c": "",
					"Placeholder_c": "",
					"Placement_c": "Header",
					"SampleValue_c": "",
					"ShowDescriptionAboveField_c": "",
					"SupportsRefreshFields_c": "",
					"Type_c": "String",
					"UI_Variables": {
						"IsSelected": false,
						"IsFixedValue": false,
						"IsExpanded": false,
						"DynamicDropdownSources": {
							"keySource": {
								"id": 0,
								"key": "",
								"displayLabel": ""
							},
							"searchsource": {
								"id": 0,
								"key": "",
								"displayLabel": ""
							}
						}
					}
				}
			],
			"deletedParameters": []
		},
		"ReqBody": {
			"SelectedType": "raw",
			"SelectedSubType": "JSON",
			"raw": {
				"JSON": {
					"selectAllPairs": false,
					"parameters": [
						{
							"Name": "value",
							"Owner": {
								"ID": 13,
								"Name": "Vivek Gotraj"
							},
							"Label_c": "Value",
							"Type_c": "String",
							"ParentKey_c": "",
							"ActionId_c": {
								"ID": 16816,
								"Name": "AA13003"
							},
							"Placeholder_c": "",
							"DefaultValue_c": "",
							"Description_c": "",
							"Placement_c": "Body",
							"SampleValue_c": "MercadoPago",
							"Choices_c": "",
							"IsRequired_c": false,
							"Direction_c": "Input",
							"DynamicSearchKey_c": "",
							"DynamicDropdownKey_c": "",
							"Tag": null,
							"Entity_Property_c": {
								"ID": 0,
								"Name": ""
							},
							"Date_Format_c": "",
							"Lookup_Entity_c": {
								"ID": 0,
								"Name": ""
							},
							"Lookup_EntityField_c": "",
							"SupportsRefreshFields_c": false,
							"Order_c": 1,
							"IsSampleValueField_c": false,
							"ShowDescriptionAboveField_c": false,
							"IsRecordIdentifier_c": false,
							"CreatedOn": "2023-03-07T10:19:54",
							"CreatedBy": {
								"ID": 13,
								"Name": "Vivek Gotraj"
							},
							"ModifiedOn": "2023-03-07T10:19:54",
							"ModifiedBy": {
								"ID": 13,
								"Name": "Vivek Gotraj"
							},
							"ID": 580958,
							"DeletedOn": null,
							"DeletedBy": {
								"ID": 0,
								"Name": ""
							},
							"UI_Variables": {
								"IsSelected": true,
								"IsFixedValue": false,
								"IsExpanded": false,
								"IsEdited": false,
								"DynamicDropdownSources": {
									"keySource": {
										"id": 0,
										"key": "",
										"displayLabel": ""
									},
									"searchsource": {
										"id": 0,
										"key": "",
										"displayLabel": ""
									}
								}
							}
						},
						{
							"Name": "htmlName",
							"Owner": {
								"ID": 13,
								"Name": "Vivek Gotraj"
							},
							"Label_c": "Html Name",
							"Type_c": "String",
							"ParentKey_c": "",
							"ActionId_c": {
								"ID": 16816,
								"Name": "AA13003"
							},
							"Placeholder_c": "",
							"DefaultValue_c": "",
							"Description_c": "",
							"Placement_c": "Body",
							"SampleValue_c": "MercadoPago",
							"Choices_c": "",
							"IsRequired_c": false,
							"Direction_c": "Input",
							"DynamicSearchKey_c": "",
							"DynamicDropdownKey_c": "",
							"Tag": null,
							"Entity_Property_c": {
								"ID": 0,
								"Name": ""
							},
							"Date_Format_c": "",
							"Lookup_Entity_c": {
								"ID": 0,
								"Name": ""
							},
							"Lookup_EntityField_c": "",
							"SupportsRefreshFields_c": false,
							"Order_c": 2,
							"IsSampleValueField_c": false,
							"ShowDescriptionAboveField_c": false,
							"IsRecordIdentifier_c": false,
							"CreatedOn": "2023-03-07T10:19:54",
							"CreatedBy": {
								"ID": 13,
								"Name": "Vivek Gotraj"
							},
							"ModifiedOn": "2023-03-07T10:19:54",
							"ModifiedBy": {
								"ID": 13,
								"Name": "Vivek Gotraj"
							},
							"ID": 580959,
							"DeletedOn": null,
							"DeletedBy": {
								"ID": 0,
								"Name": ""
							},
							"UI_Variables": {
								"IsSelected": true,
								"IsFixedValue": false,
								"IsExpanded": false,
								"IsEdited": false,
								"DynamicDropdownSources": {
									"keySource": {
										"id": 0,
										"key": "",
										"displayLabel": ""
									},
									"searchsource": {
										"id": 0,
										"key": "",
										"displayLabel": ""
									}
								}
							}
						}
					],
					"data": "{\n\t\"value\": \"MercadoPago\",\n\t\"htmlName\": \"MercadoPago\"\n}",
					"isTable": false,
					"deletedParameters": [],
					"rawJsonDataUpdated": {
						"staus": false,
						"show": false,
						"message": "Json structure saved"
					}
				}
			},
			"form-data": {
				"selectAllPairs": false,
				"parameters": [
					{
						"ActionId_c": {
							"ID": 16816,
							"Name": "AA13003"
						},
						"Choices_c": "",
						"Date_Format_c": "",
						"DefaultValue_c": "",
						"Description_c": "",
						"Direction_c": "Input",
						"DynamicDropdownKey_c": "",
						"DynamicSearchKey_c": "",
						"Entity_Property_c": {
							"ID": 0,
							"Name": ""
						},
						"ID": 0,
						"IsSampleValueField_c": "",
						"IsRequired_c": "",
						"IsRecordIdentifier_c": "",
						"Label_c": "",
						"Lookup_EntityField_c": "",
						"Lookup_Entity_c": {
							"ID": 0,
							"Name": ""
						},
						"Name": "",
						"Order_c": "",
						"ParentKey_c": "",
						"Placeholder_c": "",
						"Placement_c": "Body",
						"SampleValue_c": "",
						"ShowDescriptionAboveField_c": "",
						"SupportsRefreshFields_c": "",
						"Type_c": "String",
						"UI_Variables": {
							"IsSelected": false,
							"IsFixedValue": false,
							"IsExpanded": false,
							"DynamicDropdownSources": {
								"keySource": {
									"id": 0,
									"key": "",
									"displayLabel": ""
								},
								"searchsource": {
									"id": 0,
									"key": "",
									"displayLabel": ""
								}
							}
						}
					}
				],
				"deletedParameters": []
			},
			"x-www-form-urlencoded": {
				"selectAllPairs": false,
				"parameters": [
					{
						"ActionId_c": {
							"ID": 16816,
							"Name": "AA13003"
						},
						"Choices_c": "",
						"Date_Format_c": "",
						"DefaultValue_c": "",
						"Description_c": "",
						"Direction_c": "Input",
						"DynamicDropdownKey_c": "",
						"DynamicSearchKey_c": "",
						"Entity_Property_c": {
							"ID": 0,
							"Name": ""
						},
						"ID": 0,
						"IsSampleValueField_c": "",
						"IsRequired_c": "",
						"IsRecordIdentifier_c": "",
						"Label_c": "",
						"Lookup_EntityField_c": "",
						"Lookup_Entity_c": {
							"ID": 0,
							"Name": ""
						},
						"Name": "",
						"Order_c": "",
						"ParentKey_c": "",
						"Placeholder_c": "",
						"Placement_c": "Body",
						"SampleValue_c": "",
						"ShowDescriptionAboveField_c": "",
						"SupportsRefreshFields_c": "",
						"Type_c": "String",
						"UI_Variables": {
							"IsSelected": false,
							"IsFixedValue": false,
							"IsExpanded": false,
							"DynamicDropdownSources": {
								"keySource": {
									"id": 0,
									"key": "",
									"displayLabel": ""
								},
								"searchsource": {
									"id": 0,
									"key": "",
									"displayLabel": ""
								}
							}
						}
					}
				],
				"deletedParameters": []
			}
		},
		"expandedInputParameter": {
			"parameter": null,
			"SelectedType": "",
			"SelectedSubType": ""
		}
	},
	"ResponseOutputData": {
		"methodsOutputParameter": "RespBody",
		"testResponse": null,
		"IsApiCallTested": false,
		"RespBody": {
			"data": "",
			"setSampleValuesToEmptyFields": true,
			"selectAllPairs": false,
			"shouldSkipAllPairsValueChanged": false,
			"parameters": [
				{
					"Name": "Owner.ID",
					"Owner": {
						"ID": 13,
						"Name": "Vivek Gotraj"
					},
					"Label_c": "Owner Id",
					"Type_c": "Integer",
					"ParentKey_c": "",
					"ActionId_c": {
						"ID": 16816,
						"Name": "AA13003"
					},
					"Placeholder_c": "",
					"DefaultValue_c": "",
					"Description_c": "",
					"Placement_c": "Body",
					"SampleValue_c": "13",
					"Choices_c": "",
					"IsRequired_c": false,
					"Direction_c": "Output",
					"DynamicSearchKey_c": "",
					"DynamicDropdownKey_c": "",
					"Tag": null,
					"Entity_Property_c": {
						"ID": 0,
						"Name": ""
					},
					"Date_Format_c": "",
					"Lookup_Entity_c": {
						"ID": 0,
						"Name": ""
					},
					"Lookup_EntityField_c": "",
					"SupportsRefreshFields_c": false,
					"Order_c": null,
					"IsSampleValueField_c": false,
					"ShowDescriptionAboveField_c": false,
					"IsRecordIdentifier_c": false,
					"CreatedOn": "2023-08-11T11:11:39",
					"CreatedBy": {
						"ID": 13,
						"Name": "Vivek Gotraj"
					},
					"ModifiedOn": "2023-08-11T11:11:39",
					"ModifiedBy": {
						"ID": 13,
						"Name": "Vivek Gotraj"
					},
					"ID": 708232,
					"DeletedOn": null,
					"DeletedBy": {
						"ID": 0,
						"Name": ""
					},
					"UI_Variables": {
						"IsSelected": false,
						"IsFixedValue": false,
						"IsEdited": false,
						"DynamicDropdownSources": {
							"keySource": {
								"id": 0,
								"key": "",
								"displayLabel": ""
							},
							"searchsource": {
								"id": 0,
								"key": "",
								"displayLabel": ""
							}
						}
					}
				},
				{
					"Name": "Owner.Name",
					"Owner": {
						"ID": 13,
						"Name": "Vivek Gotraj"
					},
					"Label_c": "Owner Name",
					"Type_c": "String",
					"ParentKey_c": "",
					"ActionId_c": {
						"ID": 16816,
						"Name": "AA13003"
					},
					"Placeholder_c": "",
					"DefaultValue_c": "",
					"Description_c": "",
					"Placement_c": "Body",
					"SampleValue_c": "Vivek Gotraj",
					"Choices_c": "",
					"IsRequired_c": false,
					"Direction_c": "Output",
					"DynamicSearchKey_c": "",
					"DynamicDropdownKey_c": "",
					"Tag": null,
					"Entity_Property_c": {
						"ID": 0,
						"Name": ""
					},
					"Date_Format_c": "",
					"Lookup_Entity_c": {
						"ID": 0,
						"Name": ""
					},
					"Lookup_EntityField_c": "",
					"SupportsRefreshFields_c": false,
					"Order_c": null,
					"IsSampleValueField_c": false,
					"ShowDescriptionAboveField_c": false,
					"IsRecordIdentifier_c": false,
					"CreatedOn": "2023-08-11T11:11:39",
					"CreatedBy": {
						"ID": 13,
						"Name": "Vivek Gotraj"
					},
					"ModifiedOn": "2023-08-11T11:11:39",
					"ModifiedBy": {
						"ID": 13,
						"Name": "Vivek Gotraj"
					},
					"ID": 708233,
					"DeletedOn": null,
					"DeletedBy": {
						"ID": 0,
						"Name": ""
					},
					"UI_Variables": {
						"IsSelected": false,
						"IsFixedValue": false,
						"IsEdited": false,
						"DynamicDropdownSources": {
							"keySource": {
								"id": 0,
								"key": "",
								"displayLabel": ""
							},
							"searchsource": {
								"id": 0,
								"key": "",
								"displayLabel": ""
							}
						}
					}
				},
				{
					"ActionId_c": {
						"ID": 16816,
						"Name": "AA13003"
					},
					"Choices_c": "",
					"Date_Format_c": "",
					"DefaultValue_c": "",
					"Description_c": "",
					"Direction_c": "Output",
					"DynamicDropdownKey_c": "",
					"DynamicSearchKey_c": "",
					"Entity_Property_c": {
						"ID": 0,
						"Name": ""
					},
					"ID": 0,
					"IsSampleValueField_c": "",
					"IsRequired_c": "",
					"IsRecordIdentifier_c": "",
					"Label_c": "",
					"Lookup_EntityField_c": "",
					"Lookup_Entity_c": {
						"ID": 0,
						"Name": ""
					},
					"Name": "",
					"Order_c": "",
					"ParentKey_c": "",
					"Placeholder_c": "",
					"Placement_c": "Body",
					"SampleValue_c": "",
					"ShowDescriptionAboveField_c": "",
					"SupportsRefreshFields_c": "",
					"Type_c": "String",
					"UI_Variables": {
						"IsSelected": false,
						"IsFixedValue": false,
						"IsExpanded": false,
						"DynamicDropdownSources": {
							"keySource": {
								"id": 0,
								"key": "",
								"displayLabel": ""
							},
							"searchsource": {
								"id": 0,
								"key": "",
								"displayLabel": ""
							}
						}
					}
				}
			],
			"deletedParameters": []
		},
		"Headers": {
			"parameters": {}
		}
	},
	"actionVariables": {
		"inputFields": [
			{
				"Name": "Content-Type",
				"Owner": {
					"ID": 13,
					"Name": "Vivek Gotraj"
				},
				"Label_c": "Content Type",
				"Type_c": "String",
				"ParentKey_c": "",
				"ActionId_c": {
					"ID": 16816,
					"Name": "AA13003"
				},
				"Placeholder_c": "",
				"DefaultValue_c": "application/json",
				"Description_c": "",
				"Placement_c": "Header",
				"SampleValue_c": "application/json",
				"Choices_c": "",
				"IsRequired_c": false,
				"Direction_c": "Input",
				"DynamicSearchKey_c": "",
				"DynamicDropdownKey_c": "",
				"Tag": null,
				"Entity_Property_c": {
					"ID": 0,
					"Name": ""
				},
				"Date_Format_c": "",
				"Lookup_Entity_c": {
					"ID": 0,
					"Name": ""
				},
				"Lookup_EntityField_c": "",
				"SupportsRefreshFields_c": false,
				"Order_c": null,
				"IsSampleValueField_c": false,
				"ShowDescriptionAboveField_c": false,
				"IsRecordIdentifier_c": false,
				"CreatedOn": "2022-04-27T12:44:18",
				"CreatedBy": {
					"ID": 13,
					"Name": "Vivek Gotraj"
				},
				"ModifiedOn": "2022-04-27T12:44:18",
				"ModifiedBy": {
					"ID": 13,
					"Name": "Vivek Gotraj"
				},
				"ID": 328017,
				"DeletedOn": null,
				"DeletedBy": {
					"ID": 0,
					"Name": ""
				},
				"UI_Variables": {
					"IsSelected": true,
					"IsFixedValue": false,
					"IsExpanded": false,
					"IsEdited": false,
					"DynamicDropdownSources": {
						"keySource": {
							"id": 0,
							"key": "",
							"displayLabel": ""
						},
						"searchsource": {
							"id": 0,
							"key": "",
							"displayLabel": ""
						}
					}
				}
			},
			{
				"Name": "value",
				"Owner": {
					"ID": 13,
					"Name": "Vivek Gotraj"
				},
				"Label_c": "Value",
				"Type_c": "String",
				"ParentKey_c": "",
				"ActionId_c": {
					"ID": 16816,
					"Name": "AA13003"
				},
				"Placeholder_c": "",
				"DefaultValue_c": "",
				"Description_c": "",
				"Placement_c": "Body",
				"SampleValue_c": "MercadoPago",
				"Choices_c": "",
				"IsRequired_c": false,
				"Direction_c": "Input",
				"DynamicSearchKey_c": "",
				"DynamicDropdownKey_c": "",
				"Tag": null,
				"Entity_Property_c": {
					"ID": 0,
					"Name": ""
				},
				"Date_Format_c": "",
				"Lookup_Entity_c": {
					"ID": 0,
					"Name": ""
				},
				"Lookup_EntityField_c": "",
				"SupportsRefreshFields_c": false,
				"Order_c": 1,
				"IsSampleValueField_c": false,
				"ShowDescriptionAboveField_c": false,
				"IsRecordIdentifier_c": false,
				"CreatedOn": "2023-03-07T10:19:54",
				"CreatedBy": {
					"ID": 13,
					"Name": "Vivek Gotraj"
				},
				"ModifiedOn": "2023-03-07T10:19:54",
				"ModifiedBy": {
					"ID": 13,
					"Name": "Vivek Gotraj"
				},
				"ID": 580958,
				"DeletedOn": null,
				"DeletedBy": {
					"ID": 0,
					"Name": ""
				},
				"UI_Variables": {
					"IsSelected": true,
					"IsFixedValue": false,
					"IsExpanded": false,
					"IsEdited": false,
					"DynamicDropdownSources": {
						"keySource": {
							"id": 0,
							"key": "",
							"displayLabel": ""
						},
						"searchsource": {
							"id": 0,
							"key": "",
							"displayLabel": ""
						}
					}
				}
			},
			{
				"Name": "htmlName",
				"Owner": {
					"ID": 13,
					"Name": "Vivek Gotraj"
				},
				"Label_c": "Html Name",
				"Type_c": "String",
				"ParentKey_c": "",
				"ActionId_c": {
					"ID": 16816,
					"Name": "AA13003"
				},
				"Placeholder_c": "",
				"DefaultValue_c": "",
				"Description_c": "",
				"Placement_c": "Body",
				"SampleValue_c": "MercadoPago",
				"Choices_c": "",
				"IsRequired_c": false,
				"Direction_c": "Input",
				"DynamicSearchKey_c": "",
				"DynamicDropdownKey_c": "",
				"Tag": null,
				"Entity_Property_c": {
					"ID": 0,
					"Name": ""
				},
				"Date_Format_c": "",
				"Lookup_Entity_c": {
					"ID": 0,
					"Name": ""
				},
				"Lookup_EntityField_c": "",
				"SupportsRefreshFields_c": false,
				"Order_c": 2,
				"IsSampleValueField_c": false,
				"ShowDescriptionAboveField_c": false,
				"IsRecordIdentifier_c": false,
				"CreatedOn": "2023-03-07T10:19:54",
				"CreatedBy": {
					"ID": 13,
					"Name": "Vivek Gotraj"
				},
				"ModifiedOn": "2023-03-07T10:19:54",
				"ModifiedBy": {
					"ID": 13,
					"Name": "Vivek Gotraj"
				},
				"ID": 580959,
				"DeletedOn": null,
				"DeletedBy": {
					"ID": 0,
					"Name": ""
				},
				"UI_Variables": {
					"IsSelected": true,
					"IsFixedValue": false,
					"IsExpanded": false,
					"IsEdited": false,
					"DynamicDropdownSources": {
						"keySource": {
							"id": 0,
							"key": "",
							"displayLabel": ""
						},
						"searchsource": {
							"id": 0,
							"key": "",
							"displayLabel": ""
						}
					}
				}
			}
		],
		"outputFields": [
			{
				"Name": "Owner.ID",
				"Owner": {
					"ID": 13,
					"Name": "Vivek Gotraj"
				},
				"Label_c": "Owner Id",
				"Type_c": "Integer",
				"ParentKey_c": "",
				"ActionId_c": {
					"ID": 16816,
					"Name": "AA13003"
				},
				"Placeholder_c": "",
				"DefaultValue_c": "",
				"Description_c": "",
				"Placement_c": "Body",
				"SampleValue_c": "13",
				"Choices_c": "",
				"IsRequired_c": false,
				"Direction_c": "Output",
				"DynamicSearchKey_c": "",
				"DynamicDropdownKey_c": "",
				"Tag": null,
				"Entity_Property_c": {
					"ID": 0,
					"Name": ""
				},
				"Date_Format_c": "",
				"Lookup_Entity_c": {
					"ID": 0,
					"Name": ""
				},
				"Lookup_EntityField_c": "",
				"SupportsRefreshFields_c": false,
				"Order_c": null,
				"IsSampleValueField_c": false,
				"ShowDescriptionAboveField_c": false,
				"IsRecordIdentifier_c": false,
				"CreatedOn": "2023-08-11T11:11:39",
				"CreatedBy": {
					"ID": 13,
					"Name": "Vivek Gotraj"
				},
				"ModifiedOn": "2023-08-11T11:11:39",
				"ModifiedBy": {
					"ID": 13,
					"Name": "Vivek Gotraj"
				},
				"ID": 708232,
				"DeletedOn": null,
				"DeletedBy": {
					"ID": 0,
					"Name": ""
				},
				"UI_Variables": {
					"IsSelected": false,
					"IsFixedValue": false,
					"IsEdited": false,
					"DynamicDropdownSources": {
						"keySource": {
							"id": 0,
							"key": "",
							"displayLabel": ""
						},
						"searchsource": {
							"id": 0,
							"key": "",
							"displayLabel": ""
						}
					}
				}
			},
			{
				"Name": "Owner.Name",
				"Owner": {
					"ID": 13,
					"Name": "Vivek Gotraj"
				},
				"Label_c": "Owner Name",
				"Type_c": "String",
				"ParentKey_c": "",
				"ActionId_c": {
					"ID": 16816,
					"Name": "AA13003"
				},
				"Placeholder_c": "",
				"DefaultValue_c": "",
				"Description_c": "",
				"Placement_c": "Body",
				"SampleValue_c": "Vivek Gotraj",
				"Choices_c": "",
				"IsRequired_c": false,
				"Direction_c": "Output",
				"DynamicSearchKey_c": "",
				"DynamicDropdownKey_c": "",
				"Tag": null,
				"Entity_Property_c": {
					"ID": 0,
					"Name": ""
				},
				"Date_Format_c": "",
				"Lookup_Entity_c": {
					"ID": 0,
					"Name": ""
				},
				"Lookup_EntityField_c": "",
				"SupportsRefreshFields_c": false,
				"Order_c": null,
				"IsSampleValueField_c": false,
				"ShowDescriptionAboveField_c": false,
				"IsRecordIdentifier_c": false,
				"CreatedOn": "2023-08-11T11:11:39",
				"CreatedBy": {
					"ID": 13,
					"Name": "Vivek Gotraj"
				},
				"ModifiedOn": "2023-08-11T11:11:39",
				"ModifiedBy": {
					"ID": 13,
					"Name": "Vivek Gotraj"
				},
				"ID": 708233,
				"DeletedOn": null,
				"DeletedBy": {
					"ID": 0,
					"Name": ""
				},
				"UI_Variables": {
					"IsSelected": false,
					"IsFixedValue": false,
					"IsEdited": false,
					"DynamicDropdownSources": {
						"keySource": {
							"id": 0,
							"key": "",
							"displayLabel": ""
						},
						"searchsource": {
							"id": 0,
							"key": "",
							"displayLabel": ""
						}
					}
				}
			}
		]
	}
});

onMounted(() => {
  /*console.log('hii');
  var act = AppActions.createNewActionCustom('GET');
  console.log('act:', act);*/
})
</script>

<template>
  <div>
    <TheWelcome :app="app" :appAction="appAction"></TheWelcome>
  </div>
  
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
