import RequestInputs from "@/platform/components/APIConsole/RequestType/RequestInputs/RequestInputs.vue";
import ApiHelper from "@/platform/js/APIHelper";

export default {
	name: "InputBodyTable",
	components: {
		RequestInputs
	},
	props: {
		requestDetails: Object,
		RequestInputData: Object,
		methodInputObject: Object,
		appAction: Object,
		isRawJson: Boolean
	},
	data: function () {
		return {
			METHOD_INPUT_PARAMETERS: ApiHelper.METHOD_INPUT_PARAMETERS,
		};
	},
	methods: {
		closeModal() {
			this.$parent.toggleRawJsonUIFormat();
		}
	}
}