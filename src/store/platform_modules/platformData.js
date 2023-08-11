import platformAPI from '@/platform/js/api/platformAPI';
//import proxyHelper from "@/platform/js/proxyHelper";
import Utils from "@/platform/js/Utils";
//import AppLogoUrl from '@/js/AppLogoUrl';

async function setActionVariableToAction(actionsData, data) {
    let selectedNewAction = null;
    let actionId = data.action.ID;
    //let actionType = data.action.Type_c;
    let isTrigger = isTriggerType(data.action);
    let oldAction = null;

    setSelectedActionType(actionsData, isTrigger);

    var actions = [];
    if (isTrigger) {
        actions = actionsData.triggers;
        oldAction = actionsData.selectedTrigger;
    } else {
        actions = actionsData.actions;
        oldAction = actionsData.selectedAction;
    }

    for (let i = 0; i < actions.length; i++) {
        let action = actions[i];
        if (action.ID == actionId) {
            if (typeof action.actionVariables == 'undefined') {
                action.actionVariables = data.actionVariables;
            } else {
                action.actionVariables = data.actionVariables;
            }
            action['IsSelected'] = true;
            action['actionVariablesLoaded'] = true;
            if (isTrigger) {
                actionsData.selectedTrigger = action;
            } else {
                actionsData.selectedAction = action;
            }
            await setRequestInputResponseOutputDataToAction(action, data.requestResponseData);
            selectedNewAction = action;
            break;
        }
    }

    if (oldAction && (oldAction.ID != actionId)) {
        removeOldActionSelection(actionsData, actions, oldAction, isTrigger, data.action);
    }
    return selectedNewAction;
}

function setRequestInputResponseOutputDataToAction(action, requestResponseData) {

    //input variables
    //action.RequestInputData.None['oldParameter'] = deepCopyObject(requestResponseData.inputData.None.parameters);
    action.RequestInputData.None.parameters = requestResponseData.inputData.None.parameters;

    //action.RequestInputData.Params.Query['oldParameter'] = deepCopyObject(requestResponseData.inputData.Params.Query.parameters);
    action.RequestInputData.Params.Query.parameters = requestResponseData.inputData.Params.Query.parameters;

    //action.RequestInputData.Params.Url['oldParameter'] = deepCopyObject(requestResponseData.inputData.Params.Url.parameters);
    action.RequestInputData.Params.Url.parameters = requestResponseData.inputData.Params.Url.parameters;

    action.RequestInputData.Authentication.parameters = requestResponseData.inputData.Authentication.parameters;

    //action.RequestInputData.Headers['oldParameter'] = deepCopyObject(requestResponseData.inputData.Headers.parameters);
    action.RequestInputData.Headers.parameters = requestResponseData.inputData.Headers.parameters;

    //action.RequestInputData.ReqBody['form-data']['oldParameter'] = deepCopyObject(requestResponseData.inputData.ReqBody['form-data'].parameters);
    action.RequestInputData.ReqBody['form-data'].parameters = requestResponseData.inputData.ReqBody['form-data'].parameters;

    //action.RequestInputData.ReqBody['x-www-form-urlencoded']['oldParameter'] = deepCopyObject(requestResponseData.inputData.ReqBody['x-www-form-urlencoded'].parameters);
    action.RequestInputData.ReqBody['x-www-form-urlencoded'].parameters = requestResponseData.inputData.ReqBody['x-www-form-urlencoded'].parameters;

    //action.RequestInputData.ReqBody['raw']['JSON']['oldParameter'] = deepCopyObject(requestResponseData.inputData.ReqBody['raw']['JSON'].parameters);
    action.RequestInputData.ReqBody['raw']['JSON'].parameters = requestResponseData.inputData.ReqBody['raw']['JSON'].parameters;

    //output variables
    //action.ResponseOutputData.RespBody['oldParameter'] = deepCopyObject(requestResponseData.outputData.RespBody.parameters);
    action.ResponseOutputData.RespBody.parameters = requestResponseData.outputData.RespBody.parameters;
}

/*function deepCopyObject(data) {
    return JSON.parse(JSON.stringify(data));
}*/

function updateSelectedAppAction(actionsData, data) {
    let selectedNewAction = null;
    let actionId = data.action.ID;
    let isTrigger = isTriggerType(data.action);
    let oldAction = null;

    setSelectedActionType(actionsData, isTrigger);

    var actions = [];
    if (isTrigger) {
        actions = actionsData.triggers;
        oldAction = actionsData.selectedTrigger;
    } else {
        actions = actionsData.actions;
        oldAction = actionsData.selectedAction;
    }

    for (let i = 0; i < actions.length; i++) {
        let action = actions[i];
        if (action.ID == actionId) {
            action['IsSelected'] = true;
            selectedNewAction = action;
            if (isTrigger) {
                actionsData.selectedTrigger = action;
            } else {
                actionsData.selectedAction = action;
            }
            break;
        }
    }

    if (oldAction && (oldAction.ID != actionId)) {
        removeOldActionSelection(actionsData, actions, oldAction, isTrigger, data.action);
    }
    return selectedNewAction;
}

function removeOldActionSelection(actionsData, actions, oldAction, isTrigger, newAction) {
    for (let i = 0; i < actions.length; i++) {
        let action = actions[i];
        if (action.ID == oldAction.ID) {
            action['IsSelected'] = false;
            break;
        }
    }

    if (isTrigger) {
        actionsData.selectedTrigger = newAction;
    } else {
        actionsData.selectedAction = newAction;
    }
}

function setSelectedActionType(actionsData, isTrigger) {
    if (actionsData.selectedActionType == 'undefined') {
        actionsData.selectedActionType = '';
    }

    if (isTrigger) {
        actionsData.selectedActionType = 'Trigger';
    } else {
        actionsData.selectedActionType = 'Action';
    }
}

function isTriggerType(action) {
    let actionType = action.Type_c;
    if (actionType == 'Trigger' || actionType == 'InstantTrigger') {
        return true;
    }
    return false;
}

async function deleteNotRequiredActionVariableKeys(data) {
    //Delete the keys which are not required
    delete data.UI_Variables;
}

function getActionVariableModel() {
    return {
        Choices_c: '',
        Date_Format_c: '',
        DefaultValue_c: '',
        Description_c: '',
        Direction_c: '',
        DynamicDropdownKey_c: '',
        DynamicSearchKey_c: '',
        IsRequired_c: '',
        IsRecordIdentifier_c: '',
        IsSampleValueField_c: '',
        Label_c: '',
        Lookup_EntityField_c: '',
        Name: '',
        Order_c: '',
        ParentKey_c: '',
        Placeholder_c: '',
        Placement_c: '',
        SampleValue_c: '',
        ShowDescriptionAboveField_c: '',
        SupportsRefreshFields_c: '',
        Type_c: 'String'
    };
}

function getAuthVariableModel() {
    return {
        Choices_c: '',
        DefaultValue_c: '',
        Description_c: '',
        FieldPageUrl_c: '',
        IsRequired_c: true,
        Label_c: '',
        Name: '',
        Order_c: '',
        Placeholder_c: '',
        Tag: '',
        Type_c: 'String'
    };
}

function getAppCategoryVariableModel() {
    return {
        Is_Primary_c: false,
        Category_c: 0,
        App_c: 0
    };
}

function mapRecordModel(model, record) {
    var keys = Object.keys(model);
    let mapping = {};
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        if (record[key]) {
            mapping[key] = record[key];
        } else {
            mapping[key] = '';
        }
    }
    return mapping;
}

function getActionDMLList(array, model) {
    let records = [];
    for (let j = 0; j < array.length; j++) {
        let record = array[j];
        let mapping = mapRecordModel(model, record);
        mapping['ActionId_c'] = record['ActionId_c'].ID;
        mapping['Entity_Property_c'] = record['Entity_Property_c'].ID;
        mapping['Lookup_Entity_c'] = record['Lookup_Entity_c'].ID;

        deleteNotRequiredActionVariableKeys(mapping);

        records.push(mapping);
    }
    return records;
}

function getAuthDMLList(array, model) {
    let records = [];
    for (let j = 0; j < array.length; j++) {
        let record = array[j];
        let mapping = mapRecordModel(model, record);
        mapping['AppId_c'] = record['AppId_c'].ID;

        deleteNotRequiredActionVariableKeys(mapping);

        records.push(mapping);
    }
    return records;
}

function getAppCategoryDMLList(array, model) {
    let records = [];
    for (let j = 0; j < array.length; j++) {
        let record = array[j];
        let mapping = mapRecordModel(model, record);
        mapping['App_c'] = record['App_c'].ID;
        mapping['Category_c'] = record['Category_c'].ID;

        deleteNotRequiredActionVariableKeys(mapping);

        records.push(mapping);
    }
    return records;
}

function getMappedParameters(recordParameters, model, type) {
    if (type == 'Action') {
        return getActionDMLList(recordParameters, model);
    } else if (type == 'AppCategory') {
        return getAppCategoryDMLList(recordParameters, model);
    } else {
        return getAuthDMLList(recordParameters, model);
    }
}

function processActionVariablesBeforeSave(variablesData, type) {
    let model = null;
    if (type == 'Action') {
        model = getActionVariableModel();
    } else if (type == 'AppCategory') {
        model = getAppCategoryVariableModel();
    } else {
        model = getAuthVariableModel();
    }

    let newData = [];
    for (let i = 0; i < variablesData.length; i++) {
        let Records = Object.assign({}, variablesData[i].Records);
        let proccessedRecords = {
            Create: { Parameters: [] },
            Update: { Parameters: [] },
            Delete: { Parameters: [] }
        };

        if (Records.Create.Parameters.length > 0) {
            proccessedRecords.Create.Parameters = getMappedParameters(Records.Create.Parameters, model, type); //getActionDMLList();
        }

        if (Records.Update.Parameters.length > 0) {
            proccessedRecords.Update.Parameters = getMappedParameters(Records.Update.Parameters, model, type); //getActionDMLList(Records.Update.Parameters, model);
        }

        if (Records.Delete.Parameters.length > 0) {
            proccessedRecords.Delete.Parameters = getMappedParameters(Records.Delete.Parameters, model, type); //getActionDMLList(Records.Delete.Parameters, model);
        }

        let object = {
            ProccessedRecords: proccessedRecords,
            Records: variablesData[i].Records,
            SelectedType: variablesData[i].SelectedType
        };

        if (variablesData[i].SelectedSubType) {
            object['SelectedSubType'] = variablesData[i].SelectedSubType;
        }

        newData.push(object);
    }
    return newData;
}

async function deleteNotRequiredActionDetailsKeys(data) {
    //Delete the keys which are not required
    delete data.ID;
    delete data.UI_Variables;
}

function getActionModel() {
    return {
        ActionScript_c: '',
        DelegateActionLabel_c: '',
        Description_c: '',
        HasDynamicFields_c: false,
        IsHidden_c: false,
        IsTestAction_c: false,
        KeepAsListKey_c: '',
        Label_c: '',
        Method_c: '',
        Name: '',
        Operation_Type_c: '',
        RecordIdentifierKey_c: '',
        Record_NameKey_c: '',
        RecordsContainerKey_c: '',
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
}

function processActionDetailsBeforeSave(actionsData) {
    let record = Object.assign({}, actionsData);
    let model = getActionModel();
    let mapping = mapRecordModel(model, record);
    mapping['AppId_c'] = record['AppId_c'].ID;
    mapping['DelegateActionId_c'] = record['DelegateActionId_c'].ID;
    mapping['Entity_c'] = record['Entity_c'].ID;
    mapping['PollingDelegateActionId_c'] = record['PollingDelegateActionId_c'].ID;
    mapping['ResourceDelegateActionId_c'] = record['ResourceDelegateActionId_c'].ID;

    deleteNotRequiredActionDetailsKeys(mapping);

    return mapping;
}

function processAppDetailsBeforeSave(record) {
    let mapping = Object.assign({}, record);
    deleteNotRequiredActionDetailsKeys(mapping);

    return mapping;
}

async function moveActionToAnotherMenuOption(actionsData, selectedAction) {
    let isTrigger = isTriggerType(selectedAction);
    let triggers = actionsData.triggers;
    let actions = actionsData.actions;

    setSelectedActionType(actionsData, isTrigger);

    if (!isTrigger) {
        //remove from triggers
        let triggerIndex = await findActionIndexFromActions(triggers, selectedAction);
        if (triggerIndex != -1) {

            if (actionsData.selectedAction) {
                let actionIndex = await findActionIndexFromActions(actions, actionsData.selectedAction);
                if (actionIndex != -1) {
                    actions[actionIndex].IsSelected = false;
                }
            }

            actions.push(selectedAction);
            triggers.splice(triggerIndex, 1);

            actionsData.selectedAction = selectedAction;
            actionsData.selectedTrigger = null;
        }
    } else {
        //remove from action
        let actionIndex = await findActionIndexFromActions(actions, selectedAction);
        if (actionIndex != -1) {

            if (actionsData.selectedTrigger) {
                let triggerIndex = await findActionIndexFromActions(triggers, actionsData.selectedTrigger);
                if (triggerIndex != -1) {
                    triggers[triggerIndex].IsSelected = false;
                }
            }

            triggers.push(selectedAction);
            actions.splice(actionIndex, 1);

            actionsData.selectedTrigger = selectedAction;
            actionsData.selectedAction = null;
        }
    }
}

function findActionIndexFromActions(actions, selectedAction) {
    for (let i = 0; i < actions.length; i++) {
        let action = actions[i];
        if (action.ID == selectedAction.ID) {
            return i;
        }
    }
    return -1;
}

async function deleteActionFromApp(actionsData, selectedAction) {
    let isTrigger = isTriggerType(selectedAction);
    let triggers = actionsData.triggers;
    let actions = actionsData.actions;

    if (isTrigger) {
        let triggerIndex = await findActionIndexFromActions(triggers, selectedAction);
        if (triggerIndex != -1) {
            triggers.splice(triggerIndex, 1);
            actionsData.selectedTrigger = null;
        }
    } else {
        let actionIndex = await findActionIndexFromActions(actions, selectedAction);
        if (actionIndex != -1) {
            actions.splice(actionIndex, 1);
            actionsData.selectedAction = null;
        }
    }
}

async function setAppMetadataAndAuthParametersTestValues(selectedApp, record) {
    let parameters = selectedApp.app.authVariables.parameters;
    let oAuthParameters = selectedApp.app.OAuth.parameters;

    selectedApp.metadata = { isFetched: true, meta: record.Meta_c, ID: record.ID };

    let meta = JSON.parse(record.Meta_c);
    if (meta) {
        if (meta.AuthParametersCredentials) {
            let credentials = meta.AuthParametersCredentials;
            for (let i = 0; i < parameters.length; i++) {
                let name = parameters[i].Name;
                if (credentials[name]) {
                    parameters[i].UI_Variables.SampleValue = credentials[name];
                }
            }
        }

        if (meta.OAuth) {
            let credentials = meta.OAuth;
            for (let key of Object.keys(credentials)) {
                oAuthParameters.push({
                    Name: key,
                    Value: credentials[key]
                });
            }
        }
    }
}

function getProcessedAuthParameterData(selectedApp, recordDetails) {
    let metadata = selectedApp.metadata;

    let meta = null;
    if (metadata.meta != '') {
        meta = JSON.parse(metadata.meta);
    }

    if ((typeof(meta) == 'undefined') || meta == null) {
        meta = {};
    }
    if (recordDetails.type == 'OAuth') {
        if (typeof(meta.OAuth) == 'undefined') {
            meta['OAuth'] = {};
        }
        meta.OAuth = recordDetails.credentials;
    } else {
        if (typeof(meta.AuthParametersCredentials) == 'undefined') {
            meta['AuthParametersCredentials'] = {};
        }
        meta.AuthParametersCredentials = recordDetails.credentials;
    }

    let metaString = JSON.stringify(meta);
    selectedApp.metadata.meta = metaString;
    return {
        ActionId_c: recordDetails.actionId,
        AppId_c: selectedApp.app.ID,
        Meta_c: metaString,
        ID: metadata.ID
    };
}

async function setActionMetadataToAction(actionsData, record, selectedAction) {
    var actions = [];
    if (isTriggerType(selectedAction)) {
        actions = actionsData.triggers;
    } else {
        actions = actionsData.actions;
    }

    for (let i = 0; i < actions.length; i++) {
        let action = actions[i];
        if (action.ID == selectedAction.ID) {
            action.metadata = { isFetched: true, meta: record.Meta_c, ID: record.ID };
            let meta = JSON.parse(record.Meta_c);
            let rawJson = meta.Request.Raw.JSON;
            if (rawJson && rawJson != '') {
                action['RequestInputData']['ReqBody']['raw']['JSON'].data = JSON.stringify(JSON.parse(rawJson), null, "\t");
            }
            break;
        }
    }
}

function getProcessedActionMetadata(recordDetails) {
    let metadata = recordDetails.action.metadata;
    //let rawJson = JSON.parse(recordDetails.rawJson);
    let Request = { Raw: { JSON: recordDetails.rawJson } };
    let meta = JSON.stringify({ Request });
    return {
        ActionId_c: recordDetails.action.ID,
        AppId_c: recordDetails.action.AppId_c.ID,
        Meta_c: meta,
        ID: metadata.ID
    };
}

function getErrorStringFromErrors(errors) {
    return Utils.getErrorStringFromErrors(errors);
}

function getAssociatedRecordFromPosition(proccesedData, AllDetails, keyName, CurrentPosition) {
    var record = null;
    var item = AllDetails[CurrentPosition];

    for (let i = 0; i < proccesedData.length; i++) {
        var Records = proccesedData[i];
        if (Records.SelectedType == item.SelectedType) {
            record = Records.ProccessedRecords[keyName].Parameters[item.Position];
            break;
        }
    }

    return record;
}

export default {
    namespaced: true,
    state: {
        isLoading: false,
        availableApps: [],
        selectedApp: {
            isSelected: false,
            app: null
        },
        selectedMenuOption: '',
        setAppDetailsInNavbar: false,
        isInitialActionProcessingCompleted: false,
        isAppLoaded: false,
        selectedActionId: 0,
        selectedAppId: 0,
        isAppSelected: false,
        shouldLoadApp: false,
        createNewAppStatus: false,
        isNewAppInProcess: false,
        cloningData: {
            show: false,
            data: [],
            status: 'processing...',
            appId: 0,
            isMultipleActionCloning: false
        },
        entityMetadata: {
            standardFields: [],
            standardEntities: { isLoaded: false, entities: [] }
        },
        appCategoriesData: { isLoaded: false, categories: null, categoriesExceptGroup: null }
    },
    mutations: {
        SET_LOADING_STATUS(state, status) {
            state.isLoading = status;
        },
        SET_AVAILABLE_APPS(state, apps) {
            let isMobile = Utils.isMobileBrowser();

            apps.forEach(function(app) {
                app.LogoUrl_c = AppLogoUrl.getImageUrl(app.LogoUrl_c, 52, 36, isMobile);
            });
            
            state.availableApps = apps;
        },
        UPDATE_APP_DETAILS_IN_AVAILABLE_APP(state, details) {
            let appId = details.appId;
            let record = details.record;

            let app = state.availableApps[appId];
            if (app) {
                app.Name = record.Name;
                app.Label_c = record.Label_c;
                app.LogoUrl_c = record.LogoUrl_c;

            }

        },
        SET_SELECTED_APP(state, app) {
            state.selectedApp = app;
            if (state.selectedApp.resultSection == undefined) {
                state.selectedApp.resultSection = { status: false, actionData: null, variablesData: [] };
            } else {
                state.selectedApp.resultSection = { status: false, actionData: null, variablesData: [] };
            }

            if (state.selectedApp.app.authVariables == undefined) {
                state.selectedApp.app.authVariables = { parameters: [], deletedParameters: [] };
            } else {
                state.selectedApp.app.authVariables = { parameters: [], deletedParameters: [] };
            }

            if (state.selectedApp.metadata == undefined) {
                state.selectedApp.metadata = { isFetched: false, meta: '', ID: 0 };
            } else {
                state.selectedApp.metadata = { isFetched: false, meta: '', ID: 0 };
            }
        },
        CLEAR_SELECTED_APP(state) {
            state.selectedApp = { isSelected: false, app: null };
        },
        SET_SELECTED_APP_AUTH_VARIABLES(state, authVariables) {
            let selectedApp = state.selectedApp.app;
            if (typeof selectedApp.authVariables == 'undefined') {
                selectedApp.authVariables = authVariables;
            } else {
                selectedApp.authVariables = authVariables;
            }
        },
        SET_APP_LOADED_STATUS(state, status) {
            state.isAppLoaded = status;
        },
        UPDATE_SELECTED_APP_ACTIONS_DATA(state, data) {
            let selectedApp = state.selectedApp.app;
            if (typeof selectedApp.actionsData == 'undefined') {
                selectedApp.actionsData = data.actionsData;
                selectedApp.actionsData.selectedActionType = '';
            } else {
                selectedApp.actionsData = data.actionsData;
            }

            if (typeof selectedApp.isActionsFetched == 'undefined') {
                selectedApp.isActionsFetched = data.isActionsFetched;
            } else {
                selectedApp.isActionsFetched = data.isActionsFetched;
            }

            if (typeof selectedApp.actionList == 'undefined') {
                selectedApp.actionList = data.actionList;
            } else {
                selectedApp.actionList = data.actionList;
            }
        },
        ADD_NEW_ACTION_DATA_IN_SELECTED_APP(state, data) {
            let selectedApp = state.selectedApp.app;
            let type = data.actionsData.type;
            if (type == 'Trigger') {
                selectedApp.actionsData.triggers.push(data.actionsData.selectedTrigger);
            } else {
                selectedApp.actionsData.actions.push(data.actionsData.selectedAction);
            }
            selectedApp.actionList.push(data.actionObject);
        },
        /*SET_APP_SELECTED_NEW_ACTION(state, newAction) {
            state.selectedApp = newAction;
        },*/
        SET_CREATE_NEW_APP_STATUS(state, status) {
            state.createNewAppStatus = status;
        },
        SET_NEW_APP_IN_PROCESS_STATUS(state, status) {
            state.isNewAppInProcess = status;
        },
        SET_SELECTED_ACTION_ID(state, actionId) {
            state.selectedActionId = actionId;
        },
        SET_SELECTED_APP_ID(state, appId) {
            state.selectedAppId = appId;
        },
        SET_IS_SELECTED_APP_STATUS(state, status) {
            state.isAppSelected = status;
        },
        /*SET_CREATE_NEW_APP_STATUS(state, appId) {
            state.selectedAppId = appId;
        },*/
        SET_SHOULD_LOAD_APP_STATUS(state, status) {
            state.shouldLoadApp = status;
        },
        SET_SELECTED_MENU_OPTION(state, option) {
            state.selectedMenuOption = option;
        },
        SET_SELECTED_APP_DETAILS_IN_NAVBAR(state, status) {
            state.setAppDetailsInNavbar = status;
        },
        SET_INITIAL_ACTION_PROCESSING_COMPLETE(state, status) {
            state.isInitialActionProcessingCompleted = status;
        },
        SET_OPERATION_ERROR_DATA(state, data) {
            state.selectedApp.resultSection.actionData = data.actionData;
            state.selectedApp.resultSection.variablesData = data.variablesData;
            state.selectedApp.resultSection.status = true;
        },
        CLEAR_OPERATION_ERROR_DATA(state, data) {
            state.selectedApp.resultSection.actionData = data.actionData;
            state.selectedApp.resultSection.variablesData = data.variablesData;
            state.selectedApp.resultSection.status = false;
        },
        SET_ACTION_CLONING_MODAL_STATUS(state, show) {
            state.cloningData.show = show;
        },
        SET_ACTION_CLONING_STATUS(state, status) {
            state.cloningData.status = status;
        },
        SET_CLONING_APP_ID(state, appId) {
            state.cloningData.appId = appId;
        },
        SET_MULTIPLE_ACTIONS_CLONING_STATUS(state, status) {
            state.cloningData.isMultipleActionCloning = status;
        },
        CLOSE_AND_CLEAR_ACTION_CLONE_MODAL(state) {
            state.cloningData.show = false;
            state.cloningData.data = [];
            state.cloningData.appId = 0;
        },
        UPDATE_ACTION_CLOINING_DATA(state, parameter) {
            state.cloningData.data.push(parameter);
        },
        SET_STANDARD_FIELDS_METADATA(state, data) {
            state.entityMetadata.standardFields = data;
        },
        SET_STANDARD_ENTITIES_METADATA(state, data) {
            state.entityMetadata.standardEntities.entities = data;
            state.entityMetadata.standardEntities.isLoaded = true;
        },
        SET_APP_CATEGORIES_DATA(state, data) {
            state.appCategoriesData.categories = data.categories;
            state.appCategoriesData.categoriesExceptGroup = data.filteredCategories;
            state.appCategoriesData.isLoaded = true;
        }
    },
    actions: {
        isTriggerType(action) {
            let actionType = action.Type_c;
            if (actionType == 'Trigger' || actionType == 'InstantTrigger') {
                return true;
            }
            return false;
        },
        async fetchApps(context) {
            context.commit('SET_LOADING_STATUS', true);
            let data = await proxyHelper.getAppList();
            let response = await context.dispatch("performWebAPICall", data);
            if (response.Success) {
                context.commit('SET_AVAILABLE_APPS', response.Data);
            } else {
                context.commit('SET_AVAILABLE_APPS', []);
            }
            context.commit('SET_LOADING_STATUS', false);
            return response;
        },
        async updateAppDetailsOfAvailableApps(context, details) {
            
            context.commit('UPDATE_APP_DETAILS_IN_AVAILABLE_APP', details);
        },
        async setLoadingStatus(context, status) {
            context.commit('SET_LOADING_STATUS', status);
        },
        async performWebAPICall(context, data) {
            let response = null;
            if (data.method == 'GET') {
                response = await platformAPI.companyHubProxyGET(data.url);
            } else if (data.method == 'POST') {
                response = await platformAPI.companyHubProxyPOST(data.url, data.payload);
            } else if (data.method == 'PUT') {
                response = await platformAPI.companyHubProxyPUT(data.url, data.payload);
            } else if (data.method == 'DELETE') {
                response = await platformAPI.companyHubProxyDELETE(data.url, data.payload);
            }
            /*else {
                           response = { Success: false, Message: 'Method or Function not found' };
                       }*/

            return response;
        },
        async setSelectedApp(context, selectedApp) {
            context.commit('SET_SELECTED_APP', { isSelected: true, app: selectedApp });
        },
        async setSelectedActionId(context, actionId) {
            context.commit('SET_SELECTED_ACTION_ID', actionId);
        },
        async setSelectedAppId(context, appId) {
            context.commit('SET_SELECTED_APP_ID', appId);
        },
        async setIsSelectedAppStatus(context, status) {
            context.commit('SET_IS_SELECTED_APP_STATUS', status);
        },
        async setShouldLoadAppStatus(context, status) {
            context.commit('SET_SHOULD_LOAD_APP_STATUS', status);
        },
        async setAppAuthVariables(context, authVariables) {
            context.commit('SET_SELECTED_APP_AUTH_VARIABLES', authVariables);
            context.commit('SET_APP_LOADED_STATUS', true);
        },
        async setAppsTriggerAndActionsData(context, data) {
            context.commit('UPDATE_SELECTED_APP_ACTIONS_DATA', data);
        },
        async setAppsNewlyCreatedActionData(context, data) {
            context.commit('ADD_NEW_ACTION_DATA_IN_SELECTED_APP', data);
        },
        async setActionVarabileDataToAction(context, data) {
            let actionsData = context.state.selectedApp.app.actionsData;
            await setActionVariableToAction(actionsData, data);
        },
        async updateSelectedAppActionData(context, data) {
            let actionsData = context.state.selectedApp.app.actionsData;
            await updateSelectedAppAction(actionsData, data);
        },
        async setSelectedActionType(context, data) {
            let actionsData = context.state.selectedApp.app.actionsData;
            let isTrigger = isTriggerType(data.action);
            await setSelectedActionType(actionsData, isTrigger);
        },
        async setSelectedMenuOption(context, option) {
            context.commit('SET_SELECTED_MENU_OPTION', option);
        },
        async setSelectedAppDetailsInNavbar(context, status) {
            context.commit('SET_SELECTED_APP_DETAILS_IN_NAVBAR', status);
        },
        async setCreateNewAppStatus(context, status) {
            context.commit('SET_CREATE_NEW_APP_STATUS', status);
        },
        async setNewAppInProcessStatus(context, status) {
            context.commit('SET_NEW_APP_IN_PROCESS_STATUS', status);
        },
        async setInitialActionProcessingCompleteStatus(context, status) {
            context.commit('SET_INITIAL_ACTION_PROCESSING_COMPLETE', status);
        },
        async setOperationErrorData(context, data) {
            context.commit('SET_OPERATION_ERROR_DATA', data);
        },
        async clearOperationErrorData(context, data) {
            context.commit('CLEAR_OPERATION_ERROR_DATA', data);
        },
        async saveAppDetails(context, appData) {
            await context.dispatch('setLoadingStatus', true);

            var record = await processAppDetailsBeforeSave(appData);
            let data = null;
            let object = null;
            let errors = [];

            if (appData.ID > 0) {
                //update app
                data = await proxyHelper.updateAppDetailsByAppId(appData.ID);
                data['payload'] = record;
                object = { type: 'Update', data: data, operationType: 'App' };
            } else {
                //create app
                data = await proxyHelper.createNewApp();
                data['payload'] = record;
                object = { type: 'Create', data: data, record: record, operationType: 'App' };
            }

            let errorObject = await context.dispatch("performCreateUpdateDeleteOperationForAction", object);
            record['error'] = errorObject;
            if (errorObject.isError) {
                errors.push(record);
            }

            await context.dispatch('setLoadingStatus', false);
            return {
                errorsData: errors,
                proccesedRecord: record
            };
        },
        async saveAppCategoriesInBulkMode(context, variablesObject) {
            await context.dispatch('setLoadingStatus', true);

            let recordType = 'AppCategory';
            let variablesData = variablesObject.appCategories;
            let shouldAdd = variablesObject.shouldAddParameters;

            var proccesedData = await processActionVariablesBeforeSave(variablesData, recordType);

            let errorsData = [];

            var newProccesedData = {
                Create: { Parameters: [], Details: [] },
                Update: { Parameters: [], Details: [], OldParameters: [] },
                Delete: { Parameters: [], Details: [], OldParameters: [] }
            };

            for (let i = 0; i < proccesedData.length; i++) {
                let item = proccesedData[i];

                if (item.ProccessedRecords.Create.Parameters.length > 0) {
                    for (let j = 0; j < item.ProccessedRecords.Create.Parameters.length; j++) {
                        let object = { SelectedType: item.SelectedType, Position: j, CurrentPosition: i };
                        newProccesedData.Create.Parameters.push(item.ProccessedRecords.Create.Parameters[j]);
                        newProccesedData.Create.Details.push(object);
                    }
                }

                if (item.ProccessedRecords.Update.Parameters.length > 0) {
                    for (let j = 0; j < item.ProccessedRecords.Update.Parameters.length; j++) {
                        let object = { SelectedType: item.SelectedType, Position: j, CurrentPosition: i, OldRecordId: item.Records.Update.Parameters[j].ID };
                        newProccesedData.Update.Parameters.push(item.ProccessedRecords.Update.Parameters[j]);
                        newProccesedData.Update.OldParameters.push(item.Records.Update.Parameters[j]);
                        newProccesedData.Update.Details.push(object);
                    }
                }

                if (item.ProccessedRecords.Delete.Parameters.length > 0) {
                    for (let j = 0; j < item.ProccessedRecords.Delete.Parameters.length; j++) {
                        let object = { SelectedType: item.SelectedType, Position: j, CurrentPosition: i, OldRecordId: item.Records.Delete.Parameters[j].ID };
                        newProccesedData.Delete.Parameters.push(item.ProccessedRecords.Delete.Parameters[j]);
                        newProccesedData.Delete.OldParameters.push(item.Records.Delete.Parameters[j]);
                        newProccesedData.Delete.Details.push(object);
                    }
                }
            }

            if (newProccesedData.Create.Parameters.length > 0) {
                let result = await context.dispatch('createActionVariablesInBulkMode', {
                    Records: newProccesedData.Create.Parameters,
                    AllDetails: newProccesedData.Create.Details,
                    proccesedData: proccesedData,
                    shouldAdd: shouldAdd,
                    type: recordType
                });

                errorsData = errorsData.concat(result);
            }

            if (newProccesedData.Update.Parameters.length > 0) {
                let result = await context.dispatch('updateActionVariablesInBulkMode', {
                    Records: newProccesedData.Update.Parameters,
                    AllDetails: newProccesedData.Update.Details,
                    proccesedData: proccesedData,
                    shouldAdd: shouldAdd,
                    type: recordType
                });

                errorsData = errorsData.concat(result);
            }

            if (newProccesedData.Delete.Parameters.length > 0) {
                let result = await context.dispatch('deleteActionVariables', {
                    Records: newProccesedData.Delete.Parameters,
                    AllDetails: newProccesedData.Delete.Details,
                    proccesedData: proccesedData,
                    shouldAdd: shouldAdd,
                    type: recordType
                });
                errorsData = errorsData.concat(result);
            }

            await context.dispatch('setLoadingStatus', false);

            return {
                errorsData: errorsData,
                proccesedData: proccesedData
            };
        },
        async saveAuthVariablesInBulkMode(context, variablesObject) {
            await context.dispatch('setLoadingStatus', true);
            let variablesData = variablesObject.authVariables;
            let shouldAdd = variablesObject.shouldAddParameters;

            var proccesedData = await processActionVariablesBeforeSave(variablesData, 'Auth');

            let errorsData = [];

            var newProccesedData = {
                Create: { Parameters: [], Details: [] },
                Update: { Parameters: [], Details: [], OldParameters: [] },
                Delete: { Parameters: [], Details: [], OldParameters: [] }
            };

            for (let i = 0; i < proccesedData.length; i++) {
                let item = proccesedData[i];

                if (item.ProccessedRecords.Create.Parameters.length > 0) {
                    for (let j = 0; j < item.ProccessedRecords.Create.Parameters.length; j++) {
                        let object = { SelectedType: item.SelectedType, Position: j, CurrentPosition: i };
                        newProccesedData.Create.Parameters.push(item.ProccessedRecords.Create.Parameters[j]);
                        newProccesedData.Create.Details.push(object);
                    }
                }

                if (item.ProccessedRecords.Update.Parameters.length > 0) {
                    for (let j = 0; j < item.ProccessedRecords.Update.Parameters.length; j++) {
                        let object = { SelectedType: item.SelectedType, Position: j, CurrentPosition: i, OldRecordId: item.Records.Update.Parameters[j].ID };
                        newProccesedData.Update.Parameters.push(item.ProccessedRecords.Update.Parameters[j]);
                        newProccesedData.Update.OldParameters.push(item.Records.Update.Parameters[j]);
                        newProccesedData.Update.Details.push(object);
                    }
                }

                if (item.ProccessedRecords.Delete.Parameters.length > 0) {
                    for (let j = 0; j < item.ProccessedRecords.Delete.Parameters.length; j++) {
                        let object = { SelectedType: item.SelectedType, Position: j, CurrentPosition: i, OldRecordId: item.Records.Delete.Parameters[j].ID };
                        newProccesedData.Delete.Parameters.push(item.ProccessedRecords.Delete.Parameters[j]);
                        newProccesedData.Delete.OldParameters.push(item.Records.Delete.Parameters[j]);
                        newProccesedData.Delete.Details.push(object);
                    }
                }
            }

            if (newProccesedData.Create.Parameters.length > 0) {
                let result = await context.dispatch('createActionVariablesInBulkMode', {
                    Records: newProccesedData.Create.Parameters,
                    AllDetails: newProccesedData.Create.Details,
                    proccesedData: proccesedData,
                    shouldAdd: shouldAdd,
                    type: 'Auth'
                });

                errorsData = errorsData.concat(result);
            }

            if (newProccesedData.Update.Parameters.length > 0) {
                let result = await context.dispatch('updateActionVariablesInBulkMode', {
                    Records: newProccesedData.Update.Parameters,
                    //OldRecords: newProccesedData[i].Records.Update.Parameters,
                    AllDetails: newProccesedData.Update.Details,
                    proccesedData: proccesedData,
                    shouldAdd: shouldAdd,
                    type: 'Auth'
                });

                errorsData = errorsData.concat(result);
            }

            if (newProccesedData.Delete.Parameters.length > 0) {
                let result = await context.dispatch('deleteActionVariables', {
                    Records: newProccesedData.Delete.Parameters,
                    //OldRecords: proccesedData[i].Records.Delete.Parameters,
                    AllDetails: newProccesedData.Delete.Details,
                    proccesedData: proccesedData,
                    shouldAdd: shouldAdd,
                    type: 'Auth'
                });
                errorsData = errorsData.concat(result);
            }

            /*for (let i = 0; i < proccesedData.length; i++) {
                let Records = proccesedData[i].ProccessedRecords;

                if (Records.Create.Parameters.length > 0) {
                    let result = await context.dispatch('createActionVariablesInBulkMode', {
                        Records: Records.Create.Parameters,
                        shouldAdd: shouldAdd,
                        type: 'Auth'
                    });
                    errorsData = errorsData.concat(result);
                }

                if (Records.Update.Parameters.length > 0) {
                    let result = await context.dispatch('updateActionVariablesInBulkMode', {
                        Records: Records.Update.Parameters,
                        OldRecords: proccesedData[i].Records.Update.Parameters,
                        shouldAdd: shouldAdd,
                        type: 'Auth'
                    });
                    errorsData = errorsData.concat(result);
                }

                if (Records.Delete.Parameters.length > 0) {
                    let result = await context.dispatch('deleteActionVariables', {
                        Records: Records.Delete.Parameters,
                        OldRecords: proccesedData[i].Records.Delete.Parameters,
                        shouldAdd: shouldAdd,
                        type: 'Auth'
                    });
                    errorsData = errorsData.concat(result);
                }
            }*/

            await context.dispatch('setLoadingStatus', false);
            return {
                errorsData: errorsData,
                proccesedData: proccesedData
            };
        },
        async saveAuthVariables(context, variablesObject) {
            await context.dispatch('setLoadingStatus', true);
            let variablesData = variablesObject.authVariables;
            let shouldAdd = variablesObject.shouldAddParameters;

            var proccesedData = await processActionVariablesBeforeSave(variablesData, 'Auth');

            let errorsData = [];

            for (let i = 0; i < proccesedData.length; i++) {
                let Records = proccesedData[i].ProccessedRecords;

                if (Records.Create.Parameters.length > 0) {
                    let result = await context.dispatch('createActionVariables', {
                        Records: Records.Create.Parameters,
                        shouldAdd: shouldAdd,
                        type: 'Auth'
                    });
                    errorsData = errorsData.concat(result);
                }

                if (Records.Update.Parameters.length > 0) {
                    let result = await context.dispatch('updateActionVariables', {
                        Records: Records.Update.Parameters,
                        OldRecords: proccesedData[i].Records.Update.Parameters,
                        shouldAdd: shouldAdd,
                        type: 'Auth'
                    });
                    errorsData = errorsData.concat(result);
                }

                if (Records.Delete.Parameters.length > 0) {
                    let result = await context.dispatch('deleteActionVariables', {
                        Records: Records.Delete.Parameters,
                        OldRecords: proccesedData[i].Records.Delete.Parameters,
                        shouldAdd: shouldAdd,
                        type: 'Auth'
                    });
                    errorsData = errorsData.concat(result);
                }
            }

            await context.dispatch('setLoadingStatus', false);
            return {
                errorsData: errorsData,
                proccesedData: proccesedData
            };
        },
        async saveActionDetails(context, actionData) {
            await context.dispatch('setLoadingStatus', true);

            var record = await processActionDetailsBeforeSave(actionData);
            let data = null;
            let object = null;
            let errors = [];

            if (actionData.ID > 0) {
                //update action
                data = await proxyHelper.updateActionDetailsByActionId(actionData.ID);
                data['payload'] = record;
                object = { type: 'Update', data: data, operationType: 'Action' };
            } else {
                //create action
                data = await proxyHelper.createAppAction();
                data['payload'] = record;
                object = { type: 'Create', data: data, record: record, operationType: 'Action' };
            }

            let errorObject = await context.dispatch("performCreateUpdateDeleteOperationForAction", object);
            record['error'] = errorObject;
            if (errorObject.isError) {
                errors.push(record);
            }

            await context.dispatch('setLoadingStatus', false);
            return {
                errorsData: errors,
                proccesedRecord: record
            };
        },
        async performCreateUpdateDeleteOperationForAction(context, object) {
            let response = await context.dispatch("performWebAPICall", object.data);
            let errorObject = { isError: false, message: '' };
            if (response.Success) {
                if (object.type == 'Create') {
                    object.record.ID = response.Id;
                    if (object.operationType == 'Action') {
                        let payload = proxyHelper.getActionById(response.Id);
                        let innerResponse = await context.dispatch("performWebAPICall", payload);
                        if (innerResponse.Success) {
                            object.record.Name = innerResponse.Data.Name;
                        }
                    }
                }
            } else {
                var errorMessage = getErrorStringFromErrors(response.Errors);
                errorObject = { isError: true, message: errorMessage };
            }
            return errorObject;
        },
        async saveActionVariablesInBulkMode(context, variablesObject) {
            await context.dispatch('setLoadingStatus', true);
            let variablesData = variablesObject.actionVariables;
            let shouldAdd = variablesObject.shouldAddParameters;

            var proccesedData = await processActionVariablesBeforeSave(variablesData, 'Action');

            let errorsData = [];
            var newProccesedData = {
                Create: { Parameters: [], Details: [] },
                Update: { Parameters: [], Details: [], OldParameters: [] },
                Delete: { Parameters: [], Details: [], OldParameters: [] }
            };

            for (let i = 0; i < proccesedData.length; i++) {
                let item = proccesedData[i];

                if (item.ProccessedRecords.Create.Parameters.length > 0) {
                    for (let j = 0; j < item.ProccessedRecords.Create.Parameters.length; j++) {
                        let object = { SelectedType: item.SelectedType, Position: j, CurrentPosition: i };
                        newProccesedData.Create.Parameters.push(item.ProccessedRecords.Create.Parameters[j]);
                        newProccesedData.Create.Details.push(object);
                    }
                }

                if (item.ProccessedRecords.Update.Parameters.length > 0) {
                    for (let j = 0; j < item.ProccessedRecords.Update.Parameters.length; j++) {
                        let object = { SelectedType: item.SelectedType, Position: j, CurrentPosition: i, OldRecordId: item.Records.Update.Parameters[j].ID };
                        newProccesedData.Update.Parameters.push(item.ProccessedRecords.Update.Parameters[j]);
                        newProccesedData.Update.OldParameters.push(item.Records.Update.Parameters[j]);
                        newProccesedData.Update.Details.push(object);
                    }
                }

                if (item.ProccessedRecords.Delete.Parameters.length > 0) {
                    for (let j = 0; j < item.ProccessedRecords.Delete.Parameters.length; j++) {
                        let object = { SelectedType: item.SelectedType, Position: j, CurrentPosition: i, OldRecordId: item.Records.Delete.Parameters[j].ID };
                        newProccesedData.Delete.Parameters.push(item.ProccessedRecords.Delete.Parameters[j]);
                        newProccesedData.Delete.OldParameters.push(item.Records.Delete.Parameters[j]);
                        newProccesedData.Delete.Details.push(object);
                    }
                }
            }

            if (newProccesedData.Create.Parameters.length > 0) {
                let result = await context.dispatch('createActionVariablesInBulkMode', {
                    Records: newProccesedData.Create.Parameters,
                    AllDetails: newProccesedData.Create.Details,
                    proccesedData: proccesedData,
                    shouldAdd: shouldAdd,
                    type: 'Action'
                });

                errorsData = errorsData.concat(result);
            }

            if (newProccesedData.Update.Parameters.length > 0) {
                let result = await context.dispatch('updateActionVariablesInBulkMode', {
                    Records: newProccesedData.Update.Parameters,
                    //OldRecords: newProccesedData[i].Records.Update.Parameters,
                    AllDetails: newProccesedData.Update.Details,
                    proccesedData: proccesedData,
                    shouldAdd: shouldAdd,
                    type: 'Action'
                });

                errorsData = errorsData.concat(result);
            }

            if (newProccesedData.Delete.Parameters.length > 0) {
                let result = await context.dispatch('deleteActionVariables', {
                    Records: newProccesedData.Delete.Parameters,
                    //OldRecords: proccesedData[i].Records.Delete.Parameters,
                    AllDetails: newProccesedData.Delete.Details,
                    proccesedData: proccesedData,
                    shouldAdd: shouldAdd,
                    type: 'Action'
                });
                errorsData = errorsData.concat(result);
            }

            /*for (let i = 0; i < proccesedData.length; i++) {
                let Records = proccesedData[i].ProccessedRecords;

                if (Records.Create.Parameters.length > 0) {
                    let result = await context.dispatch('createActionVariablesInBulkMode', {
                        Records: Records.Create.Parameters,
                        shouldAdd: shouldAdd,
                        type: 'Action'
                    });
                    
                    errorsData = errorsData.concat(result);
                }

                if (Records.Update.Parameters.length > 0) {
                    let result = await context.dispatch('updateActionVariablesInBulkMode', {
                        Records: Records.Update.Parameters,
                        OldRecords: proccesedData[i].Records.Update.Parameters,
                        shouldAdd: shouldAdd,
                        type: 'Action'
                    });

                    errorsData = errorsData.concat(result);
                }

                if (Records.Delete.Parameters.length > 0) {
                    let result = await context.dispatch('deleteActionVariables', {
                        Records: Records.Delete.Parameters,
                        OldRecords: proccesedData[i].Records.Delete.Parameters,
                        shouldAdd: shouldAdd,
                        type: 'Action'
                    });
                    errorsData = errorsData.concat(result);
                }
            }*/

            await context.dispatch('setLoadingStatus', false);
            return {
                errorsData: errorsData,
                proccesedData: proccesedData
            };
        },
        async createActionVariablesInBulkMode(context, recordsData) {
            let shouldAdd = recordsData.shouldAdd;
            let Records = recordsData.Records;
            let recordType = recordsData.type;

            let data = null;
            if (recordType == 'Action') {
                data = await proxyHelper.createActionVariableInBulkMode();
            } else if (recordType == 'AppCategory') {
                data = await proxyHelper.createAppCategoryVariableInBulkMode();
            } else {
                data = await proxyHelper.createAuthVariableInBulkMode();
            }

            data['payload'] = Records;
            let object = { type: 'Create', data: data };
            let createResponse = await context.dispatch("performCreateUpdateDeleteOperationForActionVariablesInBulkMode", object);

            let errors = [];
            if (createResponse.Data && createResponse.Data != null) {
                for (var j = 0; j < createResponse.Data.length; j++) {
                    let errorObject = { isError: false, message: '' };
                    let recordResponse = createResponse.Data[j];
                    //let record = Records[j];
                    let record = getAssociatedRecordFromPosition(recordsData.proccesedData, recordsData.AllDetails, 'Create', j);
                    if (recordResponse.IsSuccessful) {
                        record.ID = recordResponse.InsertedId;
                        Records[j].ID = recordResponse.InsertedId;
                    } else {
                        var errorMessage = getErrorStringFromErrors(recordResponse.Errors);
                        errorObject = { isError: true, message: errorMessage };
                    }

                    record['error'] = errorObject;

                    if (errorObject.isError) {
                        errors.push(record);
                    }

                    if (shouldAdd) {
                        if (errorObject.isError) {
                            record['OperationStatus'] = 'Failed';
                        } else {
                            record['OperationStatus'] = 'Created';
                        }

                        if (recordType == 'AppCategory') {
                            record['Name'] = record.Category_c;
                            record['Type_c'] = 'Category';
                            record['Label_c'] = record.Is_Primary_c ? 'Primary' : '-';
                            record['ParameterType'] = recordType;
                        } else {
                            record['ParameterType'] = 'ActionVariable';
                        }

                        await context.dispatch("addActionCloningParameterInData", record);
                    }
                }
            }
            return errors;
        },
        async updateActionVariablesInBulkMode(context, recordsData) {
            let shouldAdd = recordsData.shouldAdd;
            let Records = recordsData.Records;
            let recordType = recordsData.type;

            for (var i = 0; i < Records.length; i++) {
                Records[i]['ID'] = recordsData.AllDetails[i].OldRecordId;
            }

            let data = null;
            if (recordType == 'Action') {
                data = await proxyHelper.updateActionVariableInBulkMode();
            } else if (recordType == 'AppCategory') {
                data = await proxyHelper.updateAppCategoryVariableInBulkMode();
            } else {
                data = await proxyHelper.updateAuthVariableInBulkMode();
            }

            data['payload'] = Records;
            let object = { type: 'Update', data: data };
            let updateResponse = await context.dispatch("performCreateUpdateDeleteOperationForActionVariablesInBulkMode", object);

            let errors = [];
            if (updateResponse.Data && updateResponse.Data != null) {
                for (var j = 0; j < updateResponse.Data.length; j++) {
                    let errorObject = { isError: false, message: '' };
                    let recordResponse = updateResponse.Data[j];
                    //let record = Records[j];
                    let record = getAssociatedRecordFromPosition(recordsData.proccesedData, recordsData.AllDetails, 'Update', j);
                    if (!recordResponse.IsSuccessful) {
                        var errorMessage = getErrorStringFromErrors(recordResponse.Errors);
                        errorObject = { isError: true, message: errorMessage };
                    }

                    record['error'] = errorObject;

                    if (errorObject.isError) {
                        errors.push(record);
                    }

                    if (shouldAdd) {
                        if (errorObject.isError) {
                            record['OperationStatus'] = 'Failed';
                        } else {
                            record['OperationStatus'] = 'Created';
                        }

                        record['ParameterType'] = 'ActionVariable';

                        await context.dispatch("addActionCloningParameterInData", record);
                    }
                }
            }
            return errors;
        },
        async saveActionVariables(context, variablesObject) {
            await context.dispatch('setLoadingStatus', true);
            let variablesData = variablesObject.actionVariables;
            let shouldAdd = variablesObject.shouldAddParameters;

            var proccesedData = await processActionVariablesBeforeSave(variablesData, 'Action');

            let errorsData = [];

            for (let i = 0; i < proccesedData.length; i++) {
                let Records = proccesedData[i].ProccessedRecords;

                if (Records.Create.Parameters.length > 0) {
                    let result = await context.dispatch('createActionVariables', {
                        Records: Records.Create.Parameters,
                        shouldAdd: shouldAdd,
                        type: 'Action'
                    });
                    errorsData = errorsData.concat(result);
                }

                if (Records.Update.Parameters.length > 0) {
                    let result = await context.dispatch('updateActionVariables', {
                        Records: Records.Update.Parameters,
                        OldRecords: proccesedData[i].Records.Update.Parameters,
                        shouldAdd: shouldAdd,
                        type: 'Action'
                    });
                    errorsData = errorsData.concat(result);
                }

                if (Records.Delete.Parameters.length > 0) {
                    let result = await context.dispatch('deleteActionVariables', {
                        Records: Records.Delete.Parameters,
                        OldRecords: proccesedData[i].Records.Delete.Parameters,
                        shouldAdd: shouldAdd,
                        type: 'Action'
                    });
                    errorsData = errorsData.concat(result);
                }
            }

            await context.dispatch('setLoadingStatus', false);
            return {
                errorsData: errorsData,
                proccesedData: proccesedData
            };
        },
        async createActionVariables(context, recordsData) {
            let shouldAdd = recordsData.shouldAdd;
            let records = recordsData.Records;
            let recordType = recordsData.type;
            let data = null;
            if (recordType == 'Action') {
                data = await proxyHelper.createActionVariable();
            } else {
                data = await proxyHelper.createAuthVariable();
            }

            let errors = [];

            for (let i = 0; i < records.length; i++) {
                let record = records[i];
                data['payload'] = record;
                let object = { type: 'Create', data: data, record: record };
                let errorObject = await context.dispatch("performCreateUpdateDeleteOperationForActionVariables", object);
                record['error'] = errorObject;
                data['payload'] = {};
                if (errorObject.isError) {
                    errors.push(record);
                }

                if (shouldAdd) {
                    if (errorObject.isError) {
                        record['OperationStatus'] = 'Failed';
                    } else {
                        record['OperationStatus'] = 'Created';
                    }

                    if (recordType == 'Action') {
                        record['ParameterType'] = 'ActionVariable';
                    } else {
                        record['ParameterType'] = 'AuthVariable';
                    }

                    await context.dispatch("addActionCloningParameterInData", record);
                }
            }
            return errors;
        },
        async updateActionVariables(context, recordsData) {
            let records = recordsData.Records;
            let errors = [];
            let recordType = recordsData.type;

            for (let i = 0; i < records.length; i++) {
                let record = records[i];

                let data = null;
                if (recordType == 'Action') {
                    data = await proxyHelper.updateActionVariableByActionVariableId(recordsData.OldRecords[i].ID);
                } else {
                    data = await proxyHelper.updateAuthVariableByAuthVariableId(recordsData.OldRecords[i].ID);
                }

                data['payload'] = record;
                let object = { type: 'Update', data: data };
                let errorObject = await context.dispatch("performCreateUpdateDeleteOperationForActionVariables", object);
                record['error'] = errorObject;
                if (errorObject.isError) {
                    errors.push(record);
                }
            }
            return errors;
        },
        async deleteActionVariables(context, recordsData) {
            let errors = [];
            let deletedIds = [];
            for (let i = 0; i < recordsData.AllDetails.length; i++) {
                deletedIds.push(recordsData.AllDetails[i].OldRecordId);
            }
            let recordType = recordsData.type;
            let data = null;
            if (recordType == 'Action') {
                data = await proxyHelper.deleteActionVariable();
            } else if (recordType == 'AppCategory') {
                data = await proxyHelper.deleteAppCategoryVariable();
            } else {
                data = await proxyHelper.deleteAuthVariable();
            }
            data['payload'] = { deletedIds: deletedIds };
            let object = { type: 'Delete', data: data };

            let errorData = await context.dispatch("performCreateUpdateDeleteOperationForActionVariables", object);
            //data['payload'] = {};
            for (let i = 0; i < recordsData.Records.length; i++) {
                let item = errorData[i];
                let errorObject = { isError: false, message: '' };
                if (!item.Success) {
                    errorObject = { isError: true, message: getErrorStringFromErrors(item.Errors), Errors: item.Errors }
                    errors.push(errorObject);
                }
                let record = getAssociatedRecordFromPosition(recordsData.proccesedData, recordsData.AllDetails, 'Delete', i);
                //recordsData.Records[i]['error'] = errorObject;
                record['error'] = errorObject;
            }
            return errors;
        },
        async performCreateUpdateDeleteOperationForActionVariablesInBulkMode(context, object) {
            let response = await context.dispatch("performWebAPICall", object.data);
            return response;
            /*let errorObject = { isError: false, message: '' };
            if (object.type == 'Delete') {
                return response;
            } else {
                if (response.Success) {
                    /*if (object.type == 'Create') {
                        object.record.ID = response.Id;
                    }*
                } else {
                    errorObject = { isError: true, message: response.Message };
                }
                return errorObject;
            }*/
        },
        async performCreateUpdateDeleteOperationForActionVariables(context, object) {
            let response = await context.dispatch("performWebAPICall", object.data);

            let errorObject = { isError: false, message: '' };
            if (object.type == 'Delete') {
                return response;
            } else {
                if (response.Success) {
                    if (object.type == 'Create') {
                        object.record.ID = response.Id;
                    }
                } else {
                    errorObject = { isError: true, message: response.Message };
                }
                return errorObject;
            }
        },
        async refreshActionListData(context) {
            let actionsData = context.state.selectedApp.app.actionsData;
            let triggers = actionsData.triggers;
            let actions = actionsData.actions;
            let actionList = [{
                ID: 0,
                Name: 'Select Action',
                Label_c: 'Select Action',
            }];

            triggers.forEach(function(action) {
                actionList.push({
                    ID: action.ID,
                    Name: action.Name,
                    Label_c: action.Label_c,
                    Type_c: action.Type_c,
                    variablesLoaded: action.actionVariablesLoaded
                });
            });

            actions.forEach(function(action) {
                actionList.push({
                    ID: action.ID,
                    Name: action.Name,
                    Label_c: action.Label_c,
                    Type_c: action.Type_c,
                    variablesLoaded: action.actionVariablesLoaded
                });
            });

            context.state.selectedApp.app.actionList = actionList;
        },
        async setActionCloningModalStatus(context, show) {
            context.commit('SET_ACTION_CLONING_MODAL_STATUS', show);
        },
        async setActionCloningStatus(context, status) {
            context.commit('SET_ACTION_CLONING_STATUS', status);
        },
        async setCloningAppId(context, status) {
            context.commit('SET_CLONING_APP_ID', status);
        },
        async setCloningMultipleActionStatus(context, status) {
            context.commit('SET_MULTIPLE_ACTIONS_CLONING_STATUS', status);
        },
        async closeAndClearActionCloneModal(context) {
            context.commit('CLOSE_AND_CLEAR_ACTION_CLONE_MODAL');
        },
        async addActionCloningParameterInData(context, parameter) {
            context.commit('UPDATE_ACTION_CLOINING_DATA', parameter);
        },
        async moveActionToAnotherMenuOption(context, action) {
            let actionsData = context.state.selectedApp.app.actionsData;
            await moveActionToAnotherMenuOption(actionsData, action);
        },
        async deleteActionFromApp(context, action) {
            let actionsData = context.state.selectedApp.app.actionsData;
            await deleteActionFromApp(actionsData, action);
        },
        async fetchAppMetadata(context, appId) {
            await context.dispatch('setLoadingStatus', true);
            let data = await proxyHelper.getAppMetadataById(appId);
            let response = await context.dispatch("performWebAPICall", data);
            if (response.Success) {
                if (response.Data.length > 0) {
                    let record = response.Data[0];
                    let selectedApp = context.state.selectedApp;
                    await setAppMetadataAndAuthParametersTestValues(selectedApp, record);
                }
            }
            await context.dispatch('setLoadingStatus', false);
        },
        async saveAuthParameterSampleCredentials(context, recordDetails) {
            await context.dispatch('setLoadingStatus', true);
            let selectedApp = context.state.selectedApp;
            let record = getProcessedAuthParameterData(selectedApp, recordDetails);

            let data = null;
            if (record.ID > 0) {
                let recordId = record.ID;
                data = await proxyHelper.updateAppAndActionMetadataById(recordId);
            } else {
                data = await proxyHelper.createAppAndActionMetadata();
            }
            delete record.ID;
            data['payload'] = record;

            let response = await context.dispatch("performWebAPICall", data);
            if (response.Success) {
                context.state.selectedApp.metadata.ID = response.Id;
            }

            await context.dispatch('setLoadingStatus', false);
        },
        async fetchActionMetadata(context, action) {
            await context.dispatch('setLoadingStatus', true);
            let data = await proxyHelper.getActionMetadataById(action.AppId_c.ID, action.ID);
            let response = await context.dispatch("performWebAPICall", data);
            if (response.Success) {
                if (response.Data.length > 0) {
                    let record = response.Data[0];
                    let actionsData = context.state.selectedApp.app.actionsData;
                    await setActionMetadataToAction(actionsData, record, action);
                } else {
                    action.metadata = { isFetched: true, meta: '', ID: 0 };
                }
            }
            await context.dispatch('setLoadingStatus', false);
        },
        async saveActionMetadataInTable(context, recordDetails) {
            await context.dispatch('setLoadingStatus', true);
            let record = getProcessedActionMetadata(recordDetails);

            let data = null;
            if (record.ID > 0) {
                let recordId = record.ID;
                data = await proxyHelper.updateAppAndActionMetadataById(recordId);
            } else {
                data = await proxyHelper.createAppAndActionMetadata();
            }
            delete record.ID;
            data['payload'] = record;

            let response = await context.dispatch("performWebAPICall", data);
            if (response.Success) {
                recordDetails.action.metadata.ID = response.Id;
            }

            await context.dispatch('setLoadingStatus', false);
        },
        clearSelectedApp(context) {
            context.commit('CLEAR_SELECTED_APP');
        },
        async setStandardFieldsMetadata(context, data) {
            context.commit('SET_STANDARD_FIELDS_METADATA', data);
        },
        async fetchStandardEntitiesMetadata(context) {
            if (!context.state.entityMetadata.standardEntities.isLoaded) {
                await context.dispatch('setLoadingStatus', true);
                let payload = proxyHelper.getStandardEntities();
                let response = await context.dispatch("performWebAPICall", payload);
                if (response.Success && response.Data && response.Data.length > 0) {
                    context.commit('SET_STANDARD_ENTITIES_METADATA', response.Data);
                }
                await context.dispatch('setLoadingStatus', false);
            }
        },
        async fetchAllCategoriesData(context) {
            if (!context.state.appCategoriesData.isLoaded) {
                await context.dispatch('setLoadingStatus', true);
                let payload = proxyHelper.getAllCategories();
                let response = await context.dispatch("performWebAPICall", payload);
                if (response.Success && response.Data && response.Data.length > 0) {
                    var categories = {},
                        filteredCategories = {};
                    for (var i = 0; i < response.Data.length; i++) {
                        var category = response.Data[i];
                        if (!category.Show_asGroup_c) {
                            filteredCategories["_" + category.ID] = Utils.deepCopyObject(category);
                        }
                        categories["_" + category.ID] = category;
                    }
                    context.commit('SET_APP_CATEGORIES_DATA', {
                        categories: categories,
                        filteredCategories: filteredCategories
                    });
                }
                await context.dispatch('setLoadingStatus', false);
            }
        },
        async fetchAppCategoriesData(context, appId) {
            let data = await proxyHelper.getAppCategoriesByAppId(appId);
            let response = await context.dispatch("performWebAPICall", data);
            if (response.Success && response.Data) {
                let parameters = response.Data;
                if (response.Data.length > 0) {
                    for (let i = 0; i < parameters.length; i++) {
                        let parameter = parameters[i];
                        parameter['UI_Variables'] = { IsSelected: false, IsEdited: false };
                    }
                }
            }
            return response;
        }
    },
    getters: {
        isLoading(state) {
            return state.isLoading;
        },
        availableApps(state) {
            return state.availableApps;
        },
        selectedApp(state) {
            return state.selectedApp;
        },
        selectedMenuOption(state) {
            return state.selectedMenuOption;
        },
        setAppDetailsInNavbar(state) {
            return state.setAppDetailsInNavbar;
        },
        isInitialActionProcessingCompleted(state) {
            return state.isInitialActionProcessingCompleted;
        },
        isAppLoaded(state) {
            return state.isAppLoaded;
        },
        showResultErrorSection(state) {
            if (state.selectedApp && state.selectedApp.resultSection) {
                return state.selectedApp.resultSection.status;
            }
            return false;
        },
        getAppActionList(state) {
            if (state.selectedApp && state.selectedApp.app && state.selectedApp.app.actionList) {
                return state.selectedApp.app.actionList;
            } else {
                return [];
            }
        },
        selectedActionId(state) {
            return state.selectedActionId;
        },
        selectedAppId(state) {
            return state.selectedAppId;
        },
        shouldLoadApp(state) {
            return state.shouldLoadApp;
        },
        shouldShowActionCloning(state) {
            return state.cloningData.show;
        },
        cloningData(state) {
            return state.cloningData;
        },
        shouldCreateNewApp(state) {
            return state.createNewAppStatus;
        },
        isNewAppInProcess(state) {
            return state.isNewAppInProcess;
        },
        isAppSelected(state) {
            return state.isAppSelected;
        },
        standardFieldsMetadata(state) {
            return state.entityMetadata.standardFields;
        },
        standardEntitiesMetadata(state) {
            return state.entityMetadata.standardEntities.entities;
        },
        isStatndardEntitiesLoaded(state) {
            return state.entityMetadata.standardEntities.isLoaded;
        },
        appCategoriesData(state) {
            return state.appCategoriesData.categories;
        },
        categoriesExceptGroupData(state) {
            return state.appCategoriesData.categoriesExceptGroup;
        },
        isAllAppCategoriesLoaded(state) {
            return state.appCategoriesData.isLoaded;
        }
    }
}