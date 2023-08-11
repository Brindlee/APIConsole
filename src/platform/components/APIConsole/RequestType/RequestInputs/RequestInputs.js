import Parameter from "@/platform/components/APIConsole/RequestType/RequestInputs/Parameter/Parameter.vue";
import BodyParameter from "@/platform/components/APIConsole/RequestType/RequestInputs/BodyParameter/BodyParameter.vue";
import ApiHelper from "@/platform/js/APIHelper";
import Utils from "@/platform/js/Utils";

export default {
    name: "RequestInputs",
    components: {
        Parameter,
        BodyParameter
    },
    props: {
        requestDetails: Object,
        RequestInputData: Object,
        methodInputObject: Object,
        appAction: Object,
        isRawJson: Boolean
    },
    data: function() {
        return {
            METHOD_INPUT_PARAMETERS: ApiHelper.METHOD_INPUT_PARAMETERS,
        };
    },
    methods: {
        removeAllInputParameters() {
            for (let i = 0; i < this.methodInputObject.parameters.length; i++) {
                let parameter = this.methodInputObject.parameters[i];
                if (parameter.ID > 0) {
                    this.methodInputObject.deletedParameters.push(Utils.deepCopyObject(parameter));
                }
            }
            this.methodInputObject.parameters = [];
        }
    },
};