import ScriptEditor from "@/platform/components/AceEditor/ScriptEditor/ScriptEditor.vue";
import Utils from "@/platform/js/Utils";
import Constants from "@/platform/js/Constants.js";
import DataRetriever from "@/platform/js/mixins/DataRetriever";

export default {
	name: "Script",
	mixins: [DataRetriever],
	components: {
		ScriptEditor
	},
	props: {
		appAction: Object
	},
	data: function () {
		return {
			SideMenuKeys: Constants.SideMenuKeys,
			showEditor: false
		};
	},
	methods: {
		inputChanged() {
			this.setParameterEdited();
		},
		setParameterEdited() {
			if (!this.appAction.UI_Variables.IsEdited) {
				this.appAction.UI_Variables.IsEdited = true;
			}
		},
		validateActionScript() {
			if (this.appAction.UI_Variables.IsEdited) {
				if (this.validateActionDetails(this.appAction)) {
					this.saveActionDetails();
				}				
			} else {
				this.showWarning('You have not made any changes in this section yet');
			}
		},
		async saveActionDetails() {
			let data = await this.retrieveActionDetails(this.appAction);
			let response = await this.$store.dispatch("platformData/saveActionDetails", Utils.deepCopyObject(data));
			this.updateUIVariables(response);
		},
		async updateUIVariables(response) {
			let proccesedRecord = response.proccesedRecord;
			if (this.appAction.Id == 0) {
				let actionId = proccesedRecord.ID;
				this.appAction.ID = actionId;
				this.appAction.Name = proccesedRecord.Name;
				await this.$store.dispatch("platformData/setSelectedActionId", actionId);
				await this.updateAllActionVariablesActionId(this.appAction);
				await this.$store.dispatch("platformData/refreshActionListData");
			}
			
			if (this.appAction.IsActionTypeChanged) {
				await this.changeMenuOption();
			}

			let errorsData = response.errorsData;
			
			if (errorsData.length > 0) {
				this.$store.dispatch("toaster/show", { type: "success", message: 'Operation performed.', time: 2000 });
				await this.$store.dispatch("platformData/setOperationErrorData", { actionData: proccesedRecord, variablesData: [] });
			} else {
				this.appAction.UI_Variables.IsEdited = false;
				this.$store.dispatch("toaster/show", { type: "success", message: 'Changes saved.', time: 2000 });
			}
		},
		showWarning(message) {
			this.$store.dispatch("toaster/show", { type: "warning", message: message, time: 2000 });
		},
		async changeMenuOption() {
			let option = '';
			if (this.selectedMenuOption == this.SideMenuKeys.TRIGGERS) {
				//change menu-option to action
				option = this.SideMenuKeys.ACTIONS;
			} else {
				//change menu-option to trigger
				option = this.SideMenuKeys.TRIGGERS;
			}

			this.appAction.IsActionTypeChanged = false;
			await this.$store.dispatch("platformData/setSelectedMenuOption", option);
			await this.$store.dispatch("platformData/moveActionToAnotherMenuOption", this.appAction);

		},
		openEditor() {
			this.showEditor = true;
		},
		saveData() {
			this.validateActionScript();
		}
	}
}