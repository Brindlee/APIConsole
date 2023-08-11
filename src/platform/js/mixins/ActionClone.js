import ApiHelper from "@/platform/js/APIHelper";
import Constants from "@/platform/js/Constants";
import ActionParameters from "@/platform/js/mixins/ActionParameters";

export default {
	mixins: [ActionParameters],
	data() {
		return {
			SideMenuKeys: Constants.SideMenuKeys,
			METHOD_INPUT_PARAMETERS: ApiHelper.METHOD_INPUT_PARAMETERS,
			METHOD_OUTPUT_PARAMETERS: ApiHelper.METHOD_OUTPUT_PARAMETERS,
			HeaderKeys: {
				APPLICATION_XWWW_FORM_URLENCODED: 'application/x-www-form-urlencoded',
				APPLICATION_JSON: 'application/json'
			}
		};
	},
	computed: {
		selectedApp() {
			return this.$store.getters["platformData/selectedApp"];
		},
		selectedMenuOption() {
			return this.$store.getters["platformData/selectedMenuOption"];
		}
	},
	methods: {
		actionModel() {
			return {
				ActionScript_c: '',
				AppId_c: { ID: 0, Name: '' },
				DelegateActionId_c: { ID: 0, Name: '' },
				DelegateActionLabel_c: '',				
				Description_c: '',
				Entity_c: { ID: 0, Name: '' },
				HasDynamicFields_c: false,
				ID: 0,
				IsHidden_c: false,
				IsTestAction_c: false,
				KeepAsListKey_c: '',
				Label_c: 'Unsaved',
				Method_c: 'GET',
				Name: '',
				Operation_Type_c: '',
				PollingDelegateActionId_c: { ID: 0, Name: '' },
				RecordIdentifierKey_c: '',
				Record_NameKey_c: '',
				RecordsContainerKey_c: '',
				ResourceDelegateActionId_c: { ID: 0, Name: '' },
				StepDescription_c: '',
				TestRecordDescription_c: '',
				SupportsWebhookSubscription_c: false,
				Tag: '',
				Type_c: 'Trigger',
				Url_c: '',
				WebhookUrlPasteLink_c: '',
				Webhook_Description_c: '',
				Webhook_Event_c: ''
			};
		},
		async createNewActionAndGetDetails(type, selectedApp) {
			let action = await this.actionModel();
			action['Type_c'] = type;
			action['AppId_c'].ID = selectedApp.ID;
			action['AppId_c'].Name = selectedApp.Name;

			/*let response = await this.$store.dispatch("platformData/saveActionDetails", Utils.deepCopyObject(action));
			action.ID = response.proccesedRecord.ID;*/
			return action;
		},
		async cloneActionAndGetDetails(selectedApp, action) {
			let model = await this.actionModel();
			let clonedAction = this.mapRecordModel(model, action);
			clonedAction['AppId_c'].ID = selectedApp.ID;
			clonedAction['AppId_c'].Name = selectedApp.Name;
			clonedAction['ID'] = 0;

			return clonedAction;
		},
		async cloneActionAndGetDetailsForBulkAPI(selectedApp, action) {
			let model = await this.actionModel();
			let clonedAction = this.mapRecordModel(model, action);
			clonedAction['AppId_c'] = selectedApp.ID;
			clonedAction['DelegateActionId_c'] = action.DelegateActionId_c.ID;
			clonedAction['Entity_c'] = action.Entity_c.ID;
			clonedAction['PollingDelegateActionId_c'] = action.PollingDelegateActionId_c.ID;
			clonedAction['ResourceDelegateActionId_c'] = action.ResourceDelegateActionId_c.ID;
			clonedAction['ID'] = 0;
			clonedAction['Name'] = '';

			return clonedAction;
		},
		mapRecordModel(model, record) {
			var keys = Object.keys(model);
			let mapping = {};
			for (let i = 0; i < keys.length; i++) {
				let key = keys[i];
				if (typeof(record[key]) != 'undefined') {
					mapping[key] = record[key];
				} else {
					mapping[key] = '';
				}
			}
			return mapping;
		},

		async retrieveActionVariablesData(action) {
			let data = [];

			//inputs
			await this.initiateParamsSection(data, action);
			await this.initiateHeadersSection(data, action);
			await this.initiateBodySection(data, action);
			await this.initiateNoneSection(data, action);

			//outputs
			await this.initiateRespBodySection(data, action);

			return data;
		},

		async initiateParamsSection(data, action) {
			await this.initiateUrlParamsSection(data, action);
			await this.initiateQueryParamsSection(data, action);
		},

		initiateUrlParamsSection(data, action) {
			let Records = this.createURLParameterRecords(action);
			if (Records) {
				data.push({ Records: Records, SelectedType: this.METHOD_INPUT_PARAMETERS.PARAMS_URL });
			}
		},
		createURLParameterRecords(action) {
			let methodObject = action.RequestInputData[this.METHOD_INPUT_PARAMETERS.PARAMS][this.METHOD_INPUT_PARAMETERS.PARAMS_URL];

			return this.createInputParamterRecords(methodObject, true);
		},

		initiateQueryParamsSection(data, action) {
			let Records = this.createQueryParameterRecords(action);
			if (Records) {
				data.push({ Records: Records, SelectedType: this.METHOD_INPUT_PARAMETERS.PARAMS_QUERY });
			}
		},
		createQueryParameterRecords(action) {
			let methodObject = action.RequestInputData[this.METHOD_INPUT_PARAMETERS.PARAMS][this.METHOD_INPUT_PARAMETERS.PARAMS_QUERY];

			return this.createInputParamterRecords(methodObject, true);
		},

		initiateHeadersSection(data, action) {
			let Records = this.createHeaderParameterRecords(action);
			if (Records) {
				data.push({ Records: Records, SelectedType: this.METHOD_INPUT_PARAMETERS.HEADERS });
			}
		},
		createHeaderParameterRecords(action) {
			let methodObject = action.RequestInputData[this.METHOD_INPUT_PARAMETERS.HEADERS];

			return this.createInputParamterRecords(methodObject, true);
		},

		async initiateBodySection(data, action) {
			await this.initiateFormDataSection(data, action);
			await this.initiateXWwwUrlEncodedSection(data, action);
			await this.initiateRawBodySection(data, action);
		},

		initiateFormDataSection(data, action) {
			let Records = this.createFormDataParameterRecords(action);
			if (Records) {
				data.push({ Records: Records, SelectedType: this.METHOD_INPUT_PARAMETERS.REQ_BODY.FORM_DATA });
			}
		},
		createFormDataParameterRecords(action) {
			let methodObject = action.RequestInputData[this.METHOD_INPUT_PARAMETERS.BODY][this.METHOD_INPUT_PARAMETERS.REQ_BODY.FORM_DATA];

			return this.createInputParamterRecords(methodObject, true);
		},

		initiateXWwwUrlEncodedSection(data, action) {
			let Records = this.createXWwwUrlEncodedParameterRecords(action);
			if (Records) {
				data.push({ Records: Records, SelectedType: this.METHOD_INPUT_PARAMETERS.REQ_BODY.X_WWW_FORM_URL_ENCODED });
			}
		},
		createXWwwUrlEncodedParameterRecords(action) {
			let methodObject = action.RequestInputData[this.METHOD_INPUT_PARAMETERS.BODY][this.METHOD_INPUT_PARAMETERS.REQ_BODY.X_WWW_FORM_URL_ENCODED];

			return this.createInputParamterRecords(methodObject, true);
		},

		async initiateRawBodySection(data, action) {
			await this.initiateRawBodyJsonSection(data, action);
		},

		initiateRawBodyJsonSection(data, action) {
			let Records = this.createRawJsonParameterRecords(action);
			if (Records) {
				data.push({
					Records: Records,
					SelectedType: this.METHOD_INPUT_PARAMETERS.REQ_BODY.RAW,
					SelectedSubType: this.METHOD_INPUT_PARAMETERS.REQ_BODY_RAW.JSON
				});
			}
		},
		createRawJsonParameterRecords(action) {
			let methodObject = action.RequestInputData[this.METHOD_INPUT_PARAMETERS.BODY][this.METHOD_INPUT_PARAMETERS.REQ_BODY.RAW][this.METHOD_INPUT_PARAMETERS.REQ_BODY_RAW.JSON];

			return this.createInputParamterRecords(methodObject, true);
		},

		initiateNoneSection(data, action) {
			let Records = this.createNoneParameterRecords(action);
			if (Records) {
				data.push({ Records: Records, SelectedType: this.METHOD_INPUT_PARAMETERS.NONE });
			}
		},
		createNoneParameterRecords(action) {
			let methodObject = action.RequestInputData[this.METHOD_INPUT_PARAMETERS.NONE];

			return this.createInputParamterRecords(methodObject, true);
		},

		initiateRespBodySection(data, action) {
			let Records = this.createResponseBodyParameterRecords(action);
			if (Records) {
				data.push({ Records: Records, SelectedType: this.METHOD_OUTPUT_PARAMETERS.RESP_BODY });
			}
		},
		createResponseBodyParameterRecords(action) {
			let methodObject = action.ResponseOutputData[this.METHOD_OUTPUT_PARAMETERS.RESP_BODY];

			return this.createInputParamterRecords(methodObject, true);
		},

		async updateCloneUIVariables(actionVariablesResponse, action) {

			let proccesedData = actionVariablesResponse.proccesedData;
			for (let i = 0; i < proccesedData.length; i++) {
				let item = proccesedData[i];

				let SelectedType = item.SelectedType;
				if (SelectedType == this.METHOD_INPUT_PARAMETERS.PARAMS_URL) {
					let methodObject = action.RequestInputData[this.METHOD_INPUT_PARAMETERS.PARAMS][this.METHOD_INPUT_PARAMETERS.PARAMS_URL];
					await this.updateUIParametersData(methodObject, item);
				}

				if (SelectedType == this.METHOD_INPUT_PARAMETERS.PARAMS_QUERY) {
					let methodObject = action.RequestInputData[this.METHOD_INPUT_PARAMETERS.PARAMS][this.METHOD_INPUT_PARAMETERS.PARAMS_QUERY];
					await this.updateUIParametersData(methodObject, item);
				}

				if (SelectedType == this.METHOD_INPUT_PARAMETERS.HEADERS) {
					let methodObject = action.RequestInputData[this.METHOD_INPUT_PARAMETERS.HEADERS];
					await this.updateUIParametersData(methodObject, item);
				}

				if (SelectedType == this.METHOD_INPUT_PARAMETERS.REQ_BODY.FORM_DATA) {
					let methodObject = action.RequestInputData[this.METHOD_INPUT_PARAMETERS.BODY][this.METHOD_INPUT_PARAMETERS.REQ_BODY.FORM_DATA];
					await this.updateUIParametersData(methodObject, item);
				}

				if (SelectedType == this.METHOD_INPUT_PARAMETERS.REQ_BODY.X_WWW_FORM_URL_ENCODED) {
					let methodObject = action.RequestInputData[this.METHOD_INPUT_PARAMETERS.BODY][this.METHOD_INPUT_PARAMETERS.REQ_BODY.X_WWW_FORM_URL_ENCODED];
					await this.updateUIParametersData(methodObject, item);
				}

				if (SelectedType == this.METHOD_INPUT_PARAMETERS.REQ_BODY.RAW) {
					let SelectedSubType = item.SelectedSubType;

					if (SelectedSubType == this.METHOD_INPUT_PARAMETERS.REQ_BODY_RAW.JSON) {
						let methodObject = action.RequestInputData[this.METHOD_INPUT_PARAMETERS.BODY][this.METHOD_INPUT_PARAMETERS.REQ_BODY.RAW][this.METHOD_INPUT_PARAMETERS.REQ_BODY_RAW.JSON]
						await this.updateUIParametersData(methodObject, item);
					}
				}

				if (SelectedType == this.METHOD_INPUT_PARAMETERS.NONE) {
					let methodObject = action.RequestInputData[this.METHOD_INPUT_PARAMETERS.NONE];
					await this.updateUIParametersData(methodObject, item);
				}

				if (SelectedType == this.METHOD_OUTPUT_PARAMETERS.RESP_BODY) {
					let methodObject = action.ResponseOutputData[this.METHOD_OUTPUT_PARAMETERS.RESP_BODY];
					await this.updateUIParametersData(methodObject, item);
				}
			}
		},


		//app cloning
		appModel() {
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
				Slug_c: '',
				Tag: '',
				Website_link_c: ''
			};
		},
		async cloneAppAndGetDetails(selectedApp) {
			let model = await this.appModel();
			let clonedApp = this.mapRecordModel(model, selectedApp);
			clonedApp['ID'] = 0;
			clonedApp['Label_c'] = clonedApp.Label_c + ' Copy';
			clonedApp['Name'] = clonedApp.Name + 'Copy';
			clonedApp['Slug_c'] = clonedApp.Slug_c + '-copy';
			clonedApp['Tag'] = '';

			return clonedApp;
		},

		retrieveAuthVariablesData(app) {
			let Records = this.createAuthParameterRecords(app);
			if (Records) {
				return [{ Records: Records, SelectedType: 'Auth' }];
			}
			return [];
		},
		createAuthParameterRecords(app) {
			let methodObject = app.authVariables;

			return this.createInputParamterRecords(methodObject, true);
		},

		//append copy version to action label
		getCopyVersionLabel(label) {
			label = label.trim();
			let existingLabel = label.toLowerCase();
			if (existingLabel.indexOf('copy') != -1) {
				let array = existingLabel.split(' ');
				if (array.length > 1) {
					let lastItem = array[array.length - 1];
					if (lastItem == 'copy') {
						return this.getLabelWithVersion(label+ ' ', 1);
					} else {
						let secondLastItem = array[array.length - 2];
						if (secondLastItem == 'copy') {
							if (lastItem == '') {
								return this.getLabelWithVersion(label, 1);
							} else if (lastItem == ' ') {
								return this.getLabelWithVersion(label+ ' ', 1);
							} else {
								
								if (isNaN(lastItem)) {
									return label + ' Copy';
								} else {
									let version = parseInt(lastItem);
									array.splice((array.length - 1), 1);
									let versionIndex = label.indexOf(lastItem);
									let newString = label.substring(0, versionIndex);
									let newLabel = this.getLabelWithVersion(newString, version);
									return newLabel;
								}
							}
						} else {
							return label + ' Copy';
						}
					}
				} else if (array.length == 1) {
					return this.getLabelWithVersion(label, 1);
				}
			} else {
				if (this.isActionLabelExistWithSameVersion(label + ' Copy')) {
					return this.getLabelWithVersion(label + ' Copy ', 1);
				}
				return label + ' Copy';
			}
		},
		getLabelWithVersion(newString, version) {
			version++;			
			let newLabel = newString + version;
			if (this.isActionLabelExistWithSameVersion(newLabel)) {
				return this.getLabelWithVersion(newString, version);
			} else {
				return newLabel;
			}			
		},
		isActionLabelExistWithSameVersion(label) {			
			let isPresent = false;
			let actionList = this.$store.getters["platformData/getAppActionList"];			
			for (let i = 0; i < actionList.length; i++) {
				let Label_c = actionList[i].Label_c;
				if (Label_c == label) {
					isPresent = true;
					break;
				}
			}
			return isPresent;
		}
	}
}