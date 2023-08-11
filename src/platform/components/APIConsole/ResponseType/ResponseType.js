import RespBody from "@/platform/components/APIConsole/ResponseType/Types/RespBody/RespBody.vue";
import Headers from "@/platform/components/APIConsole/ResponseType/Types/Headers/Headers.vue";
//import ErrorLogs from "@/platform/components/ErrorLogs/ErrorLogs.vue";
import ApiHelper from "@/platform/js/APIHelper";

export default {
	name: "ResponseType",
	components: {
		RespBody,
		Headers,
		//ErrorLogs
	},
	props: {
		appAction: Object
	},
	data() {
		return {
			METHOD_OUTPUT_PARAMETERS: ApiHelper.METHOD_OUTPUT_PARAMETERS
		}
	},
	methods: {
		switchMethodOutputParameterTab(type) {
			if (this.appAction.ResponseOutputData.methodsOutputParameter != type) {
				this.appAction.ResponseOutputData.methodsOutputParameter = type;
			}
		},
		getHeaderCount(obj) {
			return Object.keys(obj).length;
		}
	},
}