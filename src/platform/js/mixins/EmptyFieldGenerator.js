import ApiHelper from "@/platform/js/APIHelper";

export default {
	data() {
		return {
			METHOD_INPUT_PARAMETERS: ApiHelper.METHOD_INPUT_PARAMETERS,
		};
	},
	methods: {
		getPlacementType(requestDetails, appAction) {
			let requestType = requestDetails.requestType;
			if (requestType == this.METHOD_INPUT_PARAMETERS.PARAMS) {
				return appAction.RequestInputData.Params.SelectedType;
			} else if (requestType == this.METHOD_INPUT_PARAMETERS.BODY) {
				return 'Body';
			} else if (requestType == this.METHOD_INPUT_PARAMETERS.HEADERS) {
				return 'Header';
			} else {
				return requestType;
			}
		},
		getEmptyFieldInputParameter(requestDetails, appAction) {
			let placement = this.getPlacementType(requestDetails, appAction);			
			return this.getEmptyFieldRecord(placement, 'Input', appAction);
		},
        getEmptyFieldRecord(placement, direction, action) {
			return {
				ActionId_c: { ID: action.ID, Name: action.Name },
				Choices_c: '',
				Date_Format_c: '',
				DefaultValue_c: '',
				Description_c: '',
				Direction_c: direction,
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
					IsFixedValue: false,
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
		getEmptyFieldRecordForAuthentication(app) {
			return {
				AppId_c: { ID: app.ID, Name: app.Name },
				Choices_c: '',
				DefaultValue_c: '',
				Description_c: '',
				ID: 0,
				IsRequired_c: true,
				Label_c: '',
				Name: '',
				Order_c: '',
				Placeholder_c: '',
				Tag: '',
				Type_c: 'String',
				UI_Variables: {
					IsSelected: true,
					IsExpanded: false,
					IsEdited: false,
					SampleValue: '',
					IsSampleValueUpdated: false
				}
			};
		},
		getAppCategoryEmptyFieldRecord(app) {
			return {
				App_c: { ID: app.ID, Name: app.Name },
				Category_c: { ID: 0, Name: "" },
				Is_Primary_c: false,
				ID: 0,
				Name: "",
				UI_Variables: { IsSelected: false, IsEdited: false }
			};
		}
    }
}