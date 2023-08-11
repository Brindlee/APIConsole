import Navbar from "@/platform/components/Navbar/Navbar.vue";
import SideMenu from "@/platform/components/SideMenu/SideMenu.vue";
import AppDetails from "@/platform/components/AppDetails/AppDetails.vue";
import Authentication from "@/platform/components/Authentication/Authentication.vue";
import Triggers from "@/platform/components/Triggers/Triggers.vue";
import Errors from "@/platform/components/Errors/Errors.vue";
import MultipleActionClone from "@/platform/components/MultipleActionClone/MultipleActionClone.vue";
import ErrorLogs from "@/platform/components/ErrorLogs/ErrorLogs.vue";
import IntegrationLogging from "@/platform/components/IntegrationLogging/IntegrationLogging.vue";
import ActionCloneModal from "@/platform/components/ActionCloneModal/ActionCloneModal.vue";
import AppActions from '@/platform/js/mixins/AppActions';
import proxyHelper from "@/platform/js/proxyHelper";
import Constants from "@/platform/js/Constants";

export default {
    name: "Dashboard",
    mixins: [AppActions],
    components: {
        Navbar,
        SideMenu,
        AppDetails,
        Authentication,
        Triggers,
        Errors,
        MultipleActionClone,
        ErrorLogs,
        IntegrationLogging,
        ActionCloneModal
    },
    data: function() {
        return {
            showLoader: false,
            SideMenuKeys: Constants.SideMenuKeys
        };
    },
    computed: {
        user() {
            return this.$store.getters["auth/user"];
        },
        isPlatformAccessEnabled() {
            if (this.user && this.user.isPlatformAccessEnabled) {
                return true;
            }
            return false;
        },
        shouldShowHttpLoader() {
            return this.$store.getters["platformData/isLoading"];
        },
        selectedApp() {
            return this.$store.getters["platformData/selectedApp"];
        },
        selectedMenuOption() {
            return this.$store.getters["platformData/selectedMenuOption"];
        },
        isAppSelected() {
            if (this.selectedApp && this.selectedApp.isSelected) {
                return true;
            }
            return false;
        },
        isAppActionsFetched() {
            if (this.isAppSelected && this.selectedApp.app.isActionsFetched) {
                return true;
            }
            return false;
        },
        isInitialActionProcessingCompleted() {
            return this.$store.getters["platformData/isInitialActionProcessingCompleted"];
        },
        isSideMenuAsActionType() {
            if (this.selectedMenuOption == this.SideMenuKeys.TRIGGERS ||
                this.selectedMenuOption == this.SideMenuKeys.ACTIONS) {
                return true;
            }
            return false;
        },
        isAppActionSelected() {
            if (this.isAppActionsFetched && this.isInitialActionProcessingCompleted && this.isSideMenuAsActionType) {
                let actionsData = this.selectedApp.app.actionsData;
                if (actionsData.selectedActionType && actionsData.selectedActionType != '') {
                    let type = actionsData.selectedActionType;
                    if (type == 'Trigger') {
                        if (actionsData.selectedTrigger) {
                            return true;
                        }
                    } else if (type == 'Action') {
                        if (actionsData.selectedAction) {
                            return true;
                        }
                    }
                }
            }
            return false;
        },
        selectedAppAction() {
            if (this.isAppActionsFetched && this.isInitialActionProcessingCompleted && this.isSideMenuAsActionType) {
                let actionsData = this.selectedApp.app.actionsData;
                if (actionsData.selectedActionType && actionsData.selectedActionType != '') {
                    let type = actionsData.selectedActionType;
                    if (type == 'Trigger' && this.selectedMenuOption == this.SideMenuKeys.TRIGGERS) {
                        if (actionsData.selectedTrigger) {
                            this.$store.dispatch("platformData/setSelectedActionId", actionsData.selectedTrigger.ID);
                            return actionsData.selectedTrigger;
                        }
                    } else if (type == 'Action' && this.selectedMenuOption == this.SideMenuKeys.ACTIONS) {
                        if (actionsData.selectedAction) {
                            this.$store.dispatch("platformData/setSelectedActionId", actionsData.selectedAction.ID);
                            return actionsData.selectedAction;
                        }
                    }
                }
            }
            this.$store.dispatch("platformData/setSelectedActionId", 0);
            return null;
        },
        shouldShowResultErrorSection() {
            return this.$store.getters["platformData/showResultErrorSection"];
        },
        shouldShowActionCloningSection() {
            return this.$store.getters["platformData/shouldShowActionCloning"];
        },
        selectedAppId() {
            return this.$store.getters["platformData/selectedAppId"];
        },
        shouldLoadApp() {
            return this.$store.getters["platformData/shouldLoadApp"];
        },
        shouldCreateNewApp() {
            return this.$store.getters["platformData/shouldCreateNewApp"];
        },
        isNewAppInProcess() {
            return this.$store.getters["platformData/isNewAppInProcess"];
        },
        shouldShowCreateAppIcon() {
            if (this.selectedMenuOption == this.SideMenuKeys.ERROR_LOGS ||
                this.selectedMenuOption == this.SideMenuKeys.INTEGRATION_LOGGING) {
                return false;
            }
            return true;
        }
    },
    watch: {
        shouldLoadApp() {
            if (this.shouldLoadApp) {
                if (this.isPlatformAccessEnabled) {
                    this.loadApp(this.selectedAppId);
                }
            }
        },
        shouldCreateNewApp() {
            if (this.shouldCreateNewApp) {
                if (this.isPlatformAccessEnabled) {
                    this.createNewApp();
                }
            }
        }
        /*selectedAppId() {
        	let appId = this.selectedAppId;
        	if (appId && appId > 0) {
        		if (this.isPlatformAccessEnabled) {
        			this.loadApp(appId);
        		}
        	}
        }*/
    },
    created() {
        if (this.isPlatformAccessEnabled) {
            //this.loadApp(116);//companyhub
            //this.loadApp(18);//clicksend
            //this.loadApp(9);//calendly
            //this.loadApp(215);//Plutio
            //this.loadApp(159);//Chargebee

            //this.loadApp(414);//Test

            this.loadAllApps();
        }
    },
    methods: {
        async loadAllApps() {
            let response = await this.$store.dispatch("platformData/fetchApps");
            if (!response.Success) {
                this.$store.dispatch("toaster/show", { type: "error", message: response.Message });
            } else {
                await this.$store.dispatch("platformData/fetchAllCategoriesData");
                this.loadEntityMetadata();
            }
        },
        async loadApp(appId) {
            var self = this;

            await self.$store.dispatch("platformData/setShouldLoadAppStatus", false);

            self.showLoader = true;
            let payload = proxyHelper.getAppById(appId);
            let response = await self.$store.dispatch("platformData/performWebAPICall", payload);

            if (response.Success) {
                //self.selectedApp = { isSelected: true, app: response.Data };
                let app = response.Data;
                app['selectedUITab'] = 'Details';
                app['UI_Variables'] = {
                    IsEdited: false,
                    IsAppDetailsEditedInAppSection: false,
                    IsAppDetailsEditedInAuthenticationSection: false,
                    IsAppCategoryParameterEdited: false,
                    IsAuthParameterEdited: false
                }
                app['OAuth'] = {
                    parameters: [],
                    IsEdited: false
                };
                app['AppCategories'] = {
                    deletedParameters: [],
                    parameters: [],
                    isLoaded: false,
                    IsEdited: false
                }
                await self.$store.dispatch("platformData/setSelectedApp", app);
                await self.$store.dispatch("platformData/setIsSelectedAppStatus", true);
                self.fetchAppCategories(app);
                self.loadAppAuthVariables(app);
                //self.showLoader = false;
            } else {
                let message = 'Something went wrong';
                if (response.message) {
                    message = response.message;
                }

                if (response.Message) {
                    message = response.Message;
                }

                self.$store.dispatch("toaster/show", { type: "error", message: message });
                self.showLoader = false;
            }
        },
        async fetchAppCategories(app) {
            let response = await this.$store.dispatch("platformData/fetchAppCategoriesData", app.ID);
            if (response.Success && response.Data) {
                let appCategories = app.AppCategories;
                let parameters = response.Data;
                if (parameters.length < 3) {
                    parameters.push(this.getAppCategoryEmptyFieldRecord(app));
                }

                appCategories.parameters = parameters;
                appCategories.isLoaded = true;
            }
        },
        async loadAppAuthVariables(app) {
            var self = this;

            if (!self.showLoader) {
                self.showLoader = true;
            }

            let payload = proxyHelper.getAuthVariablesByAppId(app.ID);
            let response = await self.$store.dispatch("platformData/performWebAPICall", payload);
            if (response.Success) {
                let parameters = response.Data;

                for (let i = 0; i < parameters.length; i++) {
                    let parameter = parameters[i];
                    parameter['UI_Variables'] = {
                        IsSelected: true,
                        IsExpanded: false,
                        IsEdited: false,
                        SampleValue: ''
                    };
                }

                parameters.push(self.getEmptyFieldRecordForAuthentication(app));

                let authVariableData = {
                    deletedParameters: [],
                    parameters: parameters
                }
                await self.$store.dispatch("platformData/setAppAuthVariables", authVariableData);
                self.showLoader = false;

                await self.$store.dispatch("platformData/fetchAppMetadata", app.ID);

                self.fetchAppActions(self.selectedApp.app, self.selectedMenuOption);
            } else {
                self.$store.dispatch("toaster/show", { type: "error", message: response.Message });
                self.showLoader = false;
            }
        },
        async loadEntityMetadata() {
            await this.loadStandardFields();
        },
        async loadStandardFields() {
            let payload = proxyHelper.getStandardFields();
            let response = await this.$store.dispatch("platformData/performWebAPICall", payload);
            if (response.Success && response.Data && response.Data.length > 0) {
                await this.$store.dispatch("platformData/setStandardFieldsMetadata", response.Data);
            }
        }
    },
};