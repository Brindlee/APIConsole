export default {
    HTTP_METHODS: {
        GET: 'GET',
        POST: 'POST',
        PUT: 'PUT',
        PATCH: 'PATCH',
        DELETE: 'DELETE',
       /* COPY: 'COPY',
        HEAD: 'HEAD',
        OPTIONS: 'OPTIONS',
        LINK: 'LINK',
        UNLINK: 'UNLINK',
        PURGE: 'PURGE',
        LOCK: 'LOCK',
        UNLOCK: 'UNLOCK',
        PROPFIND: 'PROPFIND',
        VIEW: 'VIEW'*/
    },

    METHOD_INPUT_PARAMETERS: {
        NONE: 'None',
        PARAMS: 'Params',
        AUTHENTICATION: 'Authentication',
        HEADERS: 'Headers',
        BODY: 'ReqBody',
        SCRIPT: 'Script',
        SETTINGS: 'Settings',

        PARAMS_QUERY: 'Query',
        PARAMS_URL: 'Url',

        REQ_BODY: {
            NONE: 'none',
            FORM_DATA: 'form-data',
            X_WWW_FORM_URL_ENCODED: 'x-www-form-urlencoded',
            RAW: 'raw'
        },

        REQ_BODY_RAW: {
            JSON: 'JSON',
            TEXT: 'Text'
        }
    },

    METHOD_OUTPUT_PARAMETERS: {
        HEADERS: 'Headers',
        RESP_BODY: 'RespBody',
        ERROR_LOGS: 'ErrorLogs',
        TEST_RESULTS: 'TestResults'
    },

    AUTHENTICATION_TYPES_DATA: [
        {
            Properties: {
                Label: 'None',
                Value: 'None',
                InputsPresent: false
            }
        },
        {
            Properties: {
                Label: 'Basic Auth',
                Value: 'Basic',
                InputsPresent: true
            },
            Inputs: [
                {
                    LHS: { text: 'Token' },
                    RHS: { value: '' },
                    Type: 'TEXT'
                }
            ]
        },
        {
            Properties: {
                Label: 'API Key',
                Value: 'ApiKey',
                InputsPresent: true
            },
            Inputs: [
                {
                    LHS: { text: 'Key' },
                    RHS: { value: '' },
                    Type: 'TEXT'
                },
                {
                    LHS: { text: 'Value' },
                    RHS: { value: '' },
                    Type: 'TEXT'
                },
                {
                    LHS: { text: 'Add To' },
                    RHS: { value: '' },
                    Type: 'PICKLIST',
                    Options: [
                        { text: 'Header', name: 'Header' },
                        { text: 'Query Params', name: 'Query Params' },
                    ]
                }
            ]
        },
        {
            Properties: {
                Label: 'Bearer Token',
                Value: 'Bearer',
                InputsPresent: true
            },
            Inputs: [
                {
                    LHS: { text: 'Username' },
                    RHS: { value: '' },
                    Type: 'TEXT'
                },
                {
                    LHS: { text: 'Password' },
                    RHS: { value: '' },
                    Type: 'PASSWORD'
                }
            ]
        }
    ],

    ACTION_VARIABLE_TYPES: {
        STRING: 'String',
        INTEGER: 'Integer',
        DATE: 'Date',
        BOOLEAN: 'Boolean',
        FLOAT: 'Float',
        MULTI_LINE_STRING: 'MultilineString',
        DROPDOWN: 'Dropdown',
        DYNAMIC_DROPDOWN: 'DynamicDropdown',
        PASSWORD: 'Password',
        DICTIONARY: 'Dictionary',
        COPY: 'Copy',
        FILE: 'File'
    },

    DIRECTION_TYPES: {
        INPUT: 'Input',
        OUTPUT: 'Output'
    },

    ACTION_TYPES: {
        TRIGGER: 'Trigger',
        ACTION: 'Action',
        SEARCH: 'Search',
        INSTANT_TRIGGER: 'InstantTrigger'
    },

    AUTHENTICATION_TYPES: {
        NONE: 'None',
        BASIC: 'Basic',
        API_KEY: 'ApiKey',
        OAUTH_1: 'OAuth1',
        OAUTH_2: 'OAuth2',
        OAUTH_2_PKCE: 'OAuth2Pkce',
        BEARER: 'Bearer',
        DIGEST: 'Digest',
        AWS: 'Aws'
    },

    AUTH_TOKEN_PLACEMENTS: {
        NONE: 'None',
        URL: 'Url',
        QUERY: 'Query',
        HEADER: 'Header',
        BODY: 'Body'
    },

    AUTH_VARIABLE_TYPES: {
        STRING: 'String',
        INTEGER: 'Integer',
        DATE: 'Date',
        BOOLEAN: 'Boolean',
        FLOAT: 'Float',
        DROPDOWN: 'Dropdown',
        PASSWORD: 'Password',
        COPY: 'Copy'
    },
}