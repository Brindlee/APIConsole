export default {
    TABLES: 'tables',
    METHODS: {
        GET: 'GET',
        POST: 'POST',
        PUT: 'PUT',
        DELETE: 'DELETE',
    },
    SEARCH_LIMIT: {
        START: {
            text: 'start',
            value: 1
        },
        LIMIT: {
            text: 'limit',
            value: 2000
        }
    },
    DEFAULT_LIMIT: 2000,

    //get api's

    getAppList() {
        return {
            url: `${this.TABLES}/app_c?sort[0].fieldname=ID&sort[0].sorttype=asc&limit=${this.DEFAULT_LIMIT}`,
            method: this.METHODS.GET
        };
    },

    getAppById(appId) {
        return {
            url: `${this.TABLES}/app_c/${appId}`,
            method: this.METHODS.GET
        };
    },

    getAuthVariablesByAppId(appId) {
        let searchText = this.getSearchLimit();
        return {
            url: `${this.TABLES}/app_c/${appId}/appvariable_c?${searchText}`,
            method: this.METHODS.GET
        };
    },

    getAppActionsByAppId(appId) {
        let searchText = this.getSearchLimit();
        return {
            url: `${this.TABLES}/app_c/${appId}/appaction_c?${searchText}`,
            method: this.METHODS.GET
        };
    },

    getActionById(actionId) {
        return {
            url: `${this.TABLES}/appaction_c/${actionId}`,
            method: this.METHODS.GET
        };
    },

    getActionVariablesByActionId(actionId) {
        let searchText = this.getSearchLimit();
        return {
            url: `${this.TABLES}/appaction_c/${actionId}/actionvariable_c?${searchText}`,
            method: this.METHODS.GET
        };
    },

    getSearchLimit() {
        let SEARCH_LIMIT = this.SEARCH_LIMIT;
        return `${SEARCH_LIMIT.START.text}=${SEARCH_LIMIT.START.value}&${SEARCH_LIMIT.LIMIT.text}=${SEARCH_LIMIT.LIMIT.value}`;
    },

    /* APP API'S */
    //create api's
    createNewApp() {
        return {
            url: `${this.TABLES}/app_c`,
            method: this.METHODS.POST,
            payload: {}
        };
    },

    //update api's
    updateAppDetailsByAppId(appId) {
        return {
            url: `${this.TABLES}/app_c/${appId}`,
            method: this.METHODS.PUT,
            payload: {}
        };
    },

    /* AUTH VARIABLES API'S */
    //create api's
    createAuthVariable() {
        return {
            url: `${this.TABLES}/appvariable_c`,
            method: this.METHODS.POST,
            payload: {}
        };
    },

    //update api's
    updateAuthVariableByAuthVariableId(authVariableId) {
        return {
            url: `${this.TABLES}/appvariable_c/${authVariableId}`,
            method: this.METHODS.PUT,
            payload: {}
        };
    },

    //delete api's
    deleteApp() {
        return {
            url: `${this.TABLES}/app_c`,
            method: this.METHODS.DELETE,
            payload: {}
        };
    },

    deleteAuthVariable() {
        return {
            url: `${this.TABLES}/appvariable_c`,
            method: this.METHODS.DELETE,
            payload: {}
        };
    },

    /* AUTH VARIABLES BULK API'S */
    //create api's
    createAuthVariableInBulkMode() {
        return {
            url: `Bulk/${this.TABLES}/appvariable_c`,
            method: this.METHODS.POST,
            payload: {}
        };
    },

    //update api's
    updateAuthVariableInBulkMode() {
        return {
            url: `Bulk/${this.TABLES}/appvariable_c/`,
            method: this.METHODS.PUT,
            payload: {}
        };
    },

    /* ACTION API'S */
    createAppAction() {
        return {
            url: `${this.TABLES}/appaction_c`,
            method: this.METHODS.POST,
            payload: {}
        };
    },
    
    updateActionDetailsByActionId(actionId) {
        return {
            url: `${this.TABLES}/appaction_c/${actionId}`,
            method: this.METHODS.PUT,
            payload: {}
        };
    },

    deleteAppAction() {
        return {
            url: `${this.TABLES}/appaction_c`,
            method: this.METHODS.DELETE,
            payload: {}
        };
    },

    /* ACTION BULK API'S */
    createAppActionInBulkMode() {
        return {
            url: `Bulk/${this.TABLES}/appaction_c`,
            method: this.METHODS.POST,
            payload: {}
        };
    },

    updateAppActionInBulkMode() {
        return {
            url: `Bulk/${this.TABLES}/appaction_c`,
            method: this.METHODS.PUT,
            payload: {}
        };
    },

    /* ACTION VARIABLES API'S */
    //create api's
    createActionVariable() {
        return {
            url: `${this.TABLES}/actionvariable_c`,
            method: this.METHODS.POST,
            payload: {}
        };
    },

    //update api's
    updateActionVariableByActionVariableId(actionVariableId) {
        return {
            url: `${this.TABLES}/actionvariable_c/${actionVariableId}`,
            method: this.METHODS.PUT,
            payload: {}
        };
    },

    //delete api's
    deleteActionVariable() {
        return {
            url: `${this.TABLES}/actionvariable_c`,
            method: this.METHODS.DELETE,
            payload: {}
        };
    },

    /* ACTION VARIABLES BULK API'S */
    //create api's
    createActionVariableInBulkMode() {
        return {
            url: `Bulk/${this.TABLES}/actionvariable_c`,
            method: this.METHODS.POST,
            payload: {}
        };
    },

    //update api's
    updateActionVariableInBulkMode() {
        return {
            url: `Bulk/${this.TABLES}/actionvariable_c`,
            method: this.METHODS.PUT,
            payload: {}
        };
    },

    /* PLATFORM METADATA */
    getAppMetadataById(appId) {
        return {
            url: `${this.TABLES}/platform_meta_c/search`,
            method: this.METHODS.POST,
            payload: {
                Where: [
                    {
                        FieldName: "AppId_c",
                        Operator: "eq",
                        Values: [appId]
                    },
                    {
                        FieldName: "ActionId_c",
                        Operator: "eq",
                        Values: [0]
                    }
                ]
            }
        };
    },

    getActionMetadataById(appId, actionId) {
        return {
            url: `${this.TABLES}/platform_meta_c/search`,
            method: this.METHODS.POST,
            payload: {
                Where: [
                    {
                        FieldName: "AppId_c",
                        Operator: "eq",
                        Values: [appId]
                    },
                    {
                        FieldName: "ActionId_c",
                        Operator: "eq",
                        Values: [actionId]
                    }
                ]
            }
        };
    },

    createAppAndActionMetadata() {
        return {
            url: `${this.TABLES}/platform_meta_c`,
            method: this.METHODS.POST,
            payload: {}
        };
    },

    updateAppAndActionMetadataById(id) {
        return {
            url: `${this.TABLES}/platform_meta_c/${id}`,
            method: this.METHODS.PUT,
            payload: {}
        };
    },

    /* STANDARD FIELDS */
    getStandardFields() {
        return {
            url: `${this.TABLES}/standard_field_c?limit=${this.DEFAULT_LIMIT}`,
            method: this.METHODS.GET
        };
    },

    /* STANDARD Entities */
    getStandardEntities() {
        return {
            url: `${this.TABLES}/standard_entity_c?limit=${this.DEFAULT_LIMIT}`,
            method: this.METHODS.GET
        };
    },

    /* CATEGORIES */
    getAllCategories() {
        return {
            url: `${this.TABLES}/category_c?limit=${this.DEFAULT_LIMIT}`,
            method: this.METHODS.GET
        };
    },

    getAppCategoriesByAppId(appId) {
        return {
            url: `${this.TABLES}/app_category_c/search`,
            method: this.METHODS.POST,
            payload: {
                Where: [
                    {
                        FieldName: "App_c",
                        Operator: "eq",
                        Values: [appId]
                    }
                ]
            }
        };
    },

    /* APP CATEGORY VARIABLES BULK API'S */
    //create api's
    createAppCategoryVariableInBulkMode() {
        return {
            url: `Bulk/${this.TABLES}/app_category_c`,
            method: this.METHODS.POST,
            payload: {}
        };
    },

    //update api's
    updateAppCategoryVariableInBulkMode() {
        return {
            url: `Bulk/${this.TABLES}/app_category_c`,
            method: this.METHODS.PUT,
            payload: {}
        };
    },

    //delete api's
    deleteAppCategoryVariable() {
        return {
            url: `${this.TABLES}/app_category_c`,
            method: this.METHODS.DELETE,
            payload: {}
        };
    },
}