<template>
    <div class="itlAccordianContainer">
        <div class="itlAccordian active" style="justify-content:space-between;">
            <span style="display: flex; align-items: center;">
                <svg width="30" class="itlAccIcon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 48 48" style="enable-background:new 0 0 48 48;" xml:space="preserve"> <g> <path style="fill:#FFA300;" d="M17.2,33.2l9.2-9.2l-9.2-9.2L20,12l12,12L20,36L17.2,33.2z" /> <path style="fill:none;" d="M0,0h48v48H0V0z" /> </g> </svg>
                Repsonse
            </span>
        </div>
        <div class="itlAccordianContent">
            <div class="itlTabsContainer">
                <div class="itlTabs">
                    <a href="javascript:void(0);"
                       v-bind:class="{ 'active': appAction.ResponseOutputData.methodsOutputParameter == METHOD_OUTPUT_PARAMETERS.RESP_BODY }"
                       v-on:click="switchMethodOutputParameterTab(METHOD_OUTPUT_PARAMETERS.RESP_BODY)">
                        Body
                    </a>
                    <a href="javascript:void(0);"
                       v-bind:class="{ 'active': appAction.ResponseOutputData.methodsOutputParameter == METHOD_OUTPUT_PARAMETERS.HEADERS }"
                       v-on:click="switchMethodOutputParameterTab(METHOD_OUTPUT_PARAMETERS.HEADERS)">
                        Headers ({{getHeaderCount(appAction.ResponseOutputData[METHOD_OUTPUT_PARAMETERS.HEADERS].parameters)}})
                    </a>
                    <!--<a href="javascript:void(0);"
                       v-bind:class="{ 'active': appAction.ResponseOutputData.methodsOutputParameter == METHOD_OUTPUT_PARAMETERS.TEST_RESULTS }"
                       v-on:click="switchMethodOutputParameterTab(METHOD_OUTPUT_PARAMETERS.TEST_RESULTS)">
                        Test Results
                    </a>-->

                    <a href="javascript:void(0);"
                       v-bind:class="{ 'active': appAction.ResponseOutputData.methodsOutputParameter == METHOD_OUTPUT_PARAMETERS.ERROR_LOGS }"
                       v-on:click="switchMethodOutputParameterTab(METHOD_OUTPUT_PARAMETERS.ERROR_LOGS)">
                        Error Logs
                    </a>

                    <span v-if="appAction.ResponseOutputData.IsApiCallTested" style="float: right;margin-top: 10px;margin-right: 10px;">
                        Status: {{appAction.ResponseOutputData.testResponse.statusCode}} {{appAction.ResponseOutputData.testResponse.reasonPhrase}} ({{appAction.ResponseOutputData.testResponse.errorCode}})
                    </span>
                </div>
                <div class="itlTabsContent">
                    <template v-if="appAction.ResponseOutputData.methodsOutputParameter == METHOD_OUTPUT_PARAMETERS.RESP_BODY">
                        <RespBody v-bind:appAction="appAction"
                                  v-bind:outputParameters="appAction.ResponseOutputData[METHOD_OUTPUT_PARAMETERS.RESP_BODY].parameters">
                        </RespBody>
                    </template>

                    <template v-if="appAction.ResponseOutputData.methodsOutputParameter == METHOD_OUTPUT_PARAMETERS.HEADERS">
                        <Headers v-bind:appAction="appAction">
                        </Headers>
                    </template>

                    <template v-if="appAction.ResponseOutputData.methodsOutputParameter == METHOD_OUTPUT_PARAMETERS.ERROR_LOGS">
                        <ErrorLogs v-bind:showAppFilter="false">
                        </ErrorLogs>
                    </template>

                    <!--<div class="itlTabPanel active" v-if="appAction.ResponseOutputData.methodsOutputParameter == METHOD_OUTPUT_PARAMETERS.TEST_RESULTS">
                        Test Result section
                    </div>-->
                </div>
            </div>

        </div>
    </div>
</template>

<script src="./ResponseType.js"></script>