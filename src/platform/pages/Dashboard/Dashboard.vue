<template>
    <div class="itlBuilderPageLayout">
        <Navbar></Navbar>

        <div class="itlBuilderPageContainer">

            <SideMenu></SideMenu>

            <div class="itlBuilderPageSection">
                <div class="newAppBtnWrap" v-if="!isNewAppInProcess && selectedAppId == 0 && shouldShowCreateAppIcon">
                    <button class="newAppBtn" @click="createNewApp()">
                       <svg width="48" height="48" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 48 48" style="enable-background:new 0 0 48 48;" xml:space="preserve"> <g> <path style="fill:#FFFFFF;" d="M37.9,26.2h-12v12h-4v-12h-12v-4h12v-12h4v12h12V26.2z"/> <path style="fill:none;" d="M-0.1,0.2h48v48h-48V0.2z"/> </g> </svg>
                    </button>
                </div>       
                <template v-if="selectedMenuOption == SideMenuKeys.APP && selectedApp.app != null">
                    <AppDetails v-bind:app="selectedApp.app">
                    </AppDetails>
                </template>

                <template v-if="selectedMenuOption == SideMenuKeys.AUTHENTICATION && selectedApp.app != null">
                    <Authentication v-bind:app="selectedApp.app">
                    </Authentication>
                </template>

                <template v-if="isAppActionSelected && selectedAppAction != null">
                    <Triggers v-bind:app="selectedApp.app"
                              v-bind:appAction="selectedAppAction">
                    </Triggers>
                </template>
                <template v-else-if="selectedMenuOption == SideMenuKeys.TRIGGERS || selectedMenuOption == SideMenuKeys.ACTIONS">
                    Please create or select
                    <span v-if="selectedMenuOption == SideMenuKeys.TRIGGERS">
                        trigger
                    </span>
                    <span v-else>
                        action
                    </span>
                </template>

                <template v-if="selectedMenuOption == SideMenuKeys.ACTIONS_CLONING && selectedApp.app != null">
                    <MultipleActionClone v-bind:app="selectedApp.app">
                    </MultipleActionClone>
                </template>

                <template v-if="selectedMenuOption == SideMenuKeys.ERROR_LOGS">
                    <ErrorLogs v-bind:showAppFilter="true">
                    </ErrorLogs>
                </template>

                <template v-if="selectedMenuOption == SideMenuKeys.INTEGRATION_LOGGING">
                    <IntegrationLogging>
                    </IntegrationLogging>
                </template>

                <template v-if="shouldShowResultErrorSection">
                    <Errors v-bind:selectedApp="selectedApp"></Errors>
                </template>

                <template v-if="shouldShowActionCloningSection">
                    <ActionCloneModal></ActionCloneModal>
                </template>

            </div>

        </div>

        <Loader v-if="showLoader || shouldShowHttpLoader"></Loader>        
    </div>    
</template>

<script src="./Dashboard.js"></script>
