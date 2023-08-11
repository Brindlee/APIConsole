import ApiHelper from "@/platform/js/APIHelper";

export default {
	name: "Headers",
	components: {

	},
	props: {
		appAction: Object
	},
	data() {
		return {
			METHOD_OUTPUT_PARAMETERS: ApiHelper.METHOD_OUTPUT_PARAMETERS
		}
	}
}