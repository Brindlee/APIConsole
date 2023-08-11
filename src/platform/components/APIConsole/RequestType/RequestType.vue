<template>
    <div class="itlTabsContainer" style="margin: 5px 0 15px;">
        <div class="itlTabs">
            <a href="javascript:void(0);"
               v-bind:class="{ 'active': appAction.RequestInputData.methodsInputParameter == METHOD_INPUT_PARAMETERS.PARAMS }"
               v-on:click="switchMethodInputParameterTab(METHOD_INPUT_PARAMETERS.PARAMS)">
                Params
            </a>
            <a href="javascript:void(0);"
               v-bind:class="{ 'active': appAction.RequestInputData.methodsInputParameter == METHOD_INPUT_PARAMETERS.AUTHENTICATION }"
               v-on:click="switchMethodInputParameterTab(METHOD_INPUT_PARAMETERS.AUTHENTICATION)">
                Authentication
            </a>
            <a href="javascript:void(0);"
               v-bind:class="{ 'active': appAction.RequestInputData.methodsInputParameter == METHOD_INPUT_PARAMETERS.HEADERS }"
               v-on:click="switchMethodInputParameterTab(METHOD_INPUT_PARAMETERS.HEADERS)">
                Headers ({{appAction.RequestInputData[METHOD_INPUT_PARAMETERS.HEADERS].parameters.length - 1}})
            </a>
            <a href="javascript:void(0);"
               v-bind:class="{ 'active': appAction.RequestInputData.methodsInputParameter == METHOD_INPUT_PARAMETERS.BODY }"
               v-on:click="switchMethodInputParameterTab(METHOD_INPUT_PARAMETERS.BODY)">
                Body
            </a>
            <a href="javascript:void(0);"
               v-bind:class="{ 'active': appAction.RequestInputData.methodsInputParameter == METHOD_INPUT_PARAMETERS.NONE }"
               v-on:click="switchMethodInputParameterTab(METHOD_INPUT_PARAMETERS.NONE)">
                None
            </a>
            <a href="javascript:void(0);"
               v-bind:class="{ 'active': appAction.RequestInputData.methodsInputParameter == METHOD_INPUT_PARAMETERS.SCRIPT }"
               v-on:click="switchMethodInputParameterTab(METHOD_INPUT_PARAMETERS.SCRIPT)">
                Script
            </a>
            <!--<a href="javascript:void(0);"
               v-bind:class="{ 'active': appAction.RequestInputData.methodsInputParameter == METHOD_INPUT_PARAMETERS.SETTINGS }"
               v-on:click="switchMethodInputParameterTab(METHOD_INPUT_PARAMETERS.SETTINGS)">
                Settings
            </a>-->

            <a href="javascript:void(0);" 
                style="font-size: 13px; font-weight: 100; color: #ffa300; text-decoration: underline; float: right;"
                v-on:click="showFieldOrdering()">
                Input Variables
            </a>
        </div>

        <div class="itlTabsContent">
            <template v-if="appAction.RequestInputData.methodsInputParameter == METHOD_INPUT_PARAMETERS.PARAMS">
                <Params v-bind:appAction="appAction">
                </Params>
            </template>

            <template v-if="appAction.RequestInputData.methodsInputParameter == METHOD_INPUT_PARAMETERS.AUTHENTICATION">
                <Authentication v-bind:appAction="appAction"
                                v-bind:app="app">
                </Authentication>
            </template>

            <template v-if="appAction.RequestInputData.methodsInputParameter == METHOD_INPUT_PARAMETERS.HEADERS">
                <Headers v-bind:appAction="appAction">
                </Headers>
            </template>

            <template v-if="appAction.RequestInputData.methodsInputParameter == METHOD_INPUT_PARAMETERS.BODY">
                <ReqBody v-bind:appAction="appAction">
                </ReqBody>
            </template>

            <template v-if="appAction.RequestInputData.methodsInputParameter == METHOD_INPUT_PARAMETERS.NONE">
                <None v-bind:appAction="appAction">
                </None>
            </template>

            <template v-if="appAction.RequestInputData.methodsInputParameter == METHOD_INPUT_PARAMETERS.SCRIPT">
                <Script v-bind:appAction="appAction">
                </Script>
            </template>

            <!--<template v-if="appAction.RequestInputData.methodsInputParameter == METHOD_INPUT_PARAMETERS.SETTINGS">
                <Settings v-bind:appAction="appAction">
                </Settings>
            </template>-->

            <!--<template v-if="showOrderingModal">
                <OrderVariables v-bind:appAction="appAction">
                </OrderVariables> 
            </template>-->

        </div>
    </div>
</template>

<script src="./RequestType.js"></script>