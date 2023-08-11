import RequestInputs from "@/platform/components/APIConsole/RequestType/RequestInputs/RequestInputs.vue";
import ApiHelper from "@/platform/js/APIHelper";
//import ActionParameters from "@/platform/js/mixins/ActionParameters";
import DataRetriever from "@/platform/js/mixins/DataRetriever";

export default {
    name: "Headers",
    mixins: [ /*ActionParameters,*/ DataRetriever],
    components: {
        RequestInputs
    },
    props: {
        appAction: Object
    },
    data() {
        return {
            METHOD_INPUT_PARAMETERS: ApiHelper.METHOD_INPUT_PARAMETERS,
            requestDetails: {
                requestType: ''
            }
        }
    },
    created() {
        this.requestDetails.requestType = this.METHOD_INPUT_PARAMETERS.HEADERS;
    },
    methods: {
        async saveVariables(data) {
            let actionVaraiblesObject = {
                shouldAddParameters: false,
                actionVariables: data
            };
            let response = await this.$store.dispatch("platformData/saveActionVariablesInBulkMode", actionVaraiblesObject);
            let selectedTypes = { SelectedType: data[0].SelectedType };
            this.updateUIVariables(response, selectedTypes);
        },
        saveHeaderParameteres() {
            if (this.validateHeaderParameters(this.appAction)) {
                let Records = this.createHeaderParameterRecords();
                if (Records) {
                    let data = [{ Records: Records, SelectedType: this.METHOD_INPUT_PARAMETERS.HEADERS }];
                    this.saveVariables(data);
                }
            }
        },
        createHeaderParameterRecords() {
            let methodObject = this.appAction.RequestInputData[this.METHOD_INPUT_PARAMETERS.HEADERS];

            return this.createInputParamterRecords(methodObject, false);
        },
        async updateUIVariables(response, selectedTypes) {
            let proccesedData = response.proccesedData;
            for (let i = 0; i < proccesedData.length; i++) {
                let item = proccesedData[i];

                let SelectedType = item.SelectedType;
                if (SelectedType == this.METHOD_INPUT_PARAMETERS.HEADERS) {
                    let methodObject = this.appAction.RequestInputData[this.METHOD_INPUT_PARAMETERS.HEADERS];
                    this.updateUIParametersData(methodObject, item);
                }
            }

            let errorsData = response.errorsData;

            if (errorsData.length > 0) {
                this.$store.dispatch("toaster/show", { type: "success", message: 'Operation performed.', time: 2000 });
                await this.$store.dispatch("platformData/setOperationErrorData", { actionData: null, variablesData: errorsData });
            } else {
                this.$store.dispatch("toaster/show", { type: "success", message: 'Changes saved.', time: 2000 });
                await this.checkIfAnyInputParameterIsUnsaved(this.appAction, selectedTypes);
            }
        }
    }
}