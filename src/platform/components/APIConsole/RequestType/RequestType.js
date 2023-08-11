import Params from "@/platform/components/APIConsole/RequestType/Types/Params/Params.vue";
import Authentication from "@/platform/components/APIConsole/RequestType/Types/Authentication/Authentication.vue";
import Headers from "@/platform/components/APIConsole/RequestType/Types/Headers/Headers.vue";
import ReqBody from "@/platform/components/APIConsole/RequestType/Types/ReqBody/ReqBody.vue";
import None from "@/platform/components/APIConsole/RequestType/Types/None/None.vue";
import Script from "@/platform/components/APIConsole/RequestType/Types/Script/Script.vue";
//import Settings from "@/platform/components/APIConsole/RequestType/Types/Settings/Settings.vue";
//import OrderVariables from "@/platform/components/OrderVariables/OrderVariables.vue";
import ApiHelper from "@/platform/js/APIHelper";

export default {
    name: "RequestType",
    components: {
        Params,
        Authentication,
        Headers,
        ReqBody,
        None,
        Script,
        //Settings,
       // OrderVariables
    },
    props: {
        app: Object,
        appAction: Object,
        parsedCurlData: Object
    },
    data: function() {
        return {
            METHOD_INPUT_PARAMETERS: ApiHelper.METHOD_INPUT_PARAMETERS,
            showOrderingModal: false
        };
    },
    async created() {

    },
    methods: {
        switchMethodInputParameterTab(type) {
            if (this.appAction.RequestInputData.methodsInputParameter != type) {
                this.appAction.RequestInputData.methodsInputParameter = type;
            }
        },
        showFieldOrdering() {
            this.showOrderingModal = true;
        }
    },
};