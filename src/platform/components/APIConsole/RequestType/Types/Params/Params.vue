<template>
    <div class="itlTabPanel active">
        <div class="tabPanelTopBar">
            <div class="itlRadioGroup">
                <label><input type="radio" 
                              v-model="appAction.RequestInputData.Params.SelectedType" 
                              :value="METHOD_INPUT_PARAMETERS.PARAMS_URL" /> 
                       <span>
                           URL Params
                           ({{appAction.RequestInputData[METHOD_INPUT_PARAMETERS.PARAMS][METHOD_INPUT_PARAMETERS.PARAMS_URL].parameters.length - 1}})
                       </span>
                </label>
                <label><input type="radio" 
                              v-model="appAction.RequestInputData.Params.SelectedType" 
                              :value="METHOD_INPUT_PARAMETERS.PARAMS_QUERY" /> 
                       <span>
                           Query Params
                           ({{appAction.RequestInputData[METHOD_INPUT_PARAMETERS.PARAMS][METHOD_INPUT_PARAMETERS.PARAMS_QUERY].parameters.length - 1}})
                       </span>
                </label>
            </div>
            <div class="tabPanelTopBarLinks">
                <button class="saveSmallBtn"
                        @click="saveParamsParameteres()">
                    Save
                </button>
                <a href="javascript:void(0);">Bulk Edit</a>
            </div>
        </div>

        <template v-if="appAction.RequestInputData.Params.SelectedType == METHOD_INPUT_PARAMETERS.PARAMS_URL">
            <RequestInputs v-bind:RequestInputData="appAction.RequestInputData"
                           v-bind:requestDetails="requestDetails"
                           v-bind:methodInputObject="appAction.RequestInputData[METHOD_INPUT_PARAMETERS.PARAMS][METHOD_INPUT_PARAMETERS.PARAMS_URL]"
                           v-bind:appAction="appAction"
                           v-bind:isRawJson=false>
            </RequestInputs>
        </template>
        <template v-else>
            <RequestInputs v-bind:RequestInputData="appAction.RequestInputData"
                           v-bind:requestDetails="requestDetails"
                           v-bind:methodInputObject="appAction.RequestInputData[METHOD_INPUT_PARAMETERS.PARAMS][METHOD_INPUT_PARAMETERS.PARAMS_QUERY]"
                           v-bind:appAction="appAction"
                           v-bind:isRawJson=false>
            </RequestInputs>
        </template>               
    </div>
</template>

<script src="./Params.js"></script>