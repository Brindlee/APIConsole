import ApiHelper from "@/platform/js/APIHelper";

export default {
	name: "Authentication",
	components: {
	},
	props: {
		app: Object,
		appAction: Object
	},
	computed: {
		authVariables() {
			if (this.app.authVariables) {
				return this.getAuthVariables();
			}
			return [];
		},
		isOAuthType() {
			let type = this.app.AuthType_c;
			if (type == this.AUTHENTICATION_TYPES.OAUTH_1
				|| type == this.AUTHENTICATION_TYPES.OAUTH_2
				|| type == this.AUTHENTICATION_TYPES.OAUTH_2_PKCE) {
				return true;
			}
			return false;
		}
	},
	data() {
		return {
			METHOD_INPUT_PARAMETERS: ApiHelper.METHOD_INPUT_PARAMETERS,
			AUTHENTICATION_TYPES: ApiHelper.AUTHENTICATION_TYPES
		}
	},
	methods: {
		getAuthVariables() {
			let list = [];
			let parameters = this.app.authVariables.parameters;
			for (let i = 0; i < parameters.length; i++) {
				if (parameters[i].Name != '') {
					list.push(parameters[i]);
				}
			}
			return list;
		},
		checkboxValueChanged() {
			//
		}
	}
}