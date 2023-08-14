<template>
    <div class="itlTabPanel active">
        <div class="tabPanelTopBar">
            <div class="itlRadioGroup">
                <label>
                    <input type="radio"
                           v-model="appAction.RequestInputData.ReqBody.SelectedType"
                           :value="METHOD_INPUT_PARAMETERS.REQ_BODY.NONE" />
                    <span>none</span>
                </label>
                <label>
                    <input type="radio"
                           v-model="appAction.RequestInputData.ReqBody.SelectedType"
                           :value="METHOD_INPUT_PARAMETERS.REQ_BODY.FORM_DATA" />
                    <span>
                        form-data
                        ({{appAction.RequestInputData[METHOD_INPUT_PARAMETERS.BODY][METHOD_INPUT_PARAMETERS.REQ_BODY.FORM_DATA].parameters.length - 1}})
                    </span>
                </label>
                <label>
                    <input type="radio"
                           v-model="appAction.RequestInputData.ReqBody.SelectedType"
                           :value="METHOD_INPUT_PARAMETERS.REQ_BODY.X_WWW_FORM_URL_ENCODED" />
                    <span>
                        x-www-form-urlencoded
                        ({{appAction.RequestInputData[METHOD_INPUT_PARAMETERS.BODY][METHOD_INPUT_PARAMETERS.REQ_BODY.X_WWW_FORM_URL_ENCODED].parameters.length - 1}})
                    </span>
                </label>
                <label>
                    <input type="radio"
                           v-model="appAction.RequestInputData.ReqBody.SelectedType"
                           :value="METHOD_INPUT_PARAMETERS.REQ_BODY.RAW" />
                    <span>raw</span>
                </label>
            </div>

            <!-- <div v-if="appAction.RequestInputData.ReqBody.SelectedType == METHOD_INPUT_PARAMETERS.REQ_BODY.RAW">
                <select>
                    <option>JSON</option> -->
                    <!--<option>Javascript</option>
                    <option>Text</option>
                    <option>HTML</option>
                    <option>XML</option>-->
                <!-- </select> -->
                <!-- <a style="margin-left: 10px;font-size:14px;"
                   href="javascript:void(0);"
                   @click="toggleRawJsonUIFormat()">
                    <span v-if="appAction.RequestInputData[METHOD_INPUT_PARAMETERS.BODY][METHOD_INPUT_PARAMETERS.REQ_BODY.RAW][METHOD_INPUT_PARAMETERS.REQ_BODY_RAW.JSON].isTable">
                        Simple
                    </span> 
                    <span v-else>
                        Variables
                    </span>                    
                    ({{appAction.RequestInputData[METHOD_INPUT_PARAMETERS.BODY][METHOD_INPUT_PARAMETERS.REQ_BODY.RAW][METHOD_INPUT_PARAMETERS.REQ_BODY_RAW.JSON].parameters.length}})
                </a> -->
            <!-- </div> -->
            
            <div class="tabPanelTopBarLinks" style="float: right;">
                <!--<button class="saveSmallBtn"
                        @click="saveBodyParameteres()"
                        v-if="shouldShowSaveButton">
                    Save
                </button>-->
                <!-- <a href="javascript:void(0);">Bulk Edit</a> -->
            </div>
        </div>

        <template v-if="appAction.RequestInputData.ReqBody.SelectedType == METHOD_INPUT_PARAMETERS.REQ_BODY.FORM_DATA">
            <RequestInputs v-bind:RequestInputData="appAction.RequestInputData"
                           v-bind:requestDetails="requestDetails"
                           v-bind:methodInputObject="appAction.RequestInputData[METHOD_INPUT_PARAMETERS.BODY][METHOD_INPUT_PARAMETERS.REQ_BODY.FORM_DATA]"
                           v-bind:appAction="appAction"
                           v-bind:isRawJson=false>
            </RequestInputs>
        </template>

        <template v-if="appAction.RequestInputData.ReqBody.SelectedType == METHOD_INPUT_PARAMETERS.REQ_BODY.X_WWW_FORM_URL_ENCODED">
            <RequestInputs v-bind:RequestInputData="appAction.RequestInputData"
                           v-bind:requestDetails="requestDetails"
                           v-bind:methodInputObject="appAction.RequestInputData[METHOD_INPUT_PARAMETERS.BODY][METHOD_INPUT_PARAMETERS.REQ_BODY.X_WWW_FORM_URL_ENCODED]"
                           v-bind:appAction="appAction"
                           v-bind:isRawJson=false>
            </RequestInputs>
        </template>

        <template v-if="appAction.RequestInputData.ReqBody.SelectedType == METHOD_INPUT_PARAMETERS.REQ_BODY.RAW">
            <template v-if="appAction.RequestInputData[METHOD_INPUT_PARAMETERS.BODY][METHOD_INPUT_PARAMETERS.REQ_BODY.RAW][METHOD_INPUT_PARAMETERS.REQ_BODY_RAW.JSON].isTable">
                <!--<RequestInputs v-bind:RequestInputData="appAction.RequestInputData"
                               v-bind:requestDetails="requestDetails"
                               v-bind:methodInputObject="appAction.RequestInputData[METHOD_INPUT_PARAMETERS.BODY][METHOD_INPUT_PARAMETERS.REQ_BODY.RAW][METHOD_INPUT_PARAMETERS.REQ_BODY_RAW.JSON]"
                               v-bind:appAction="appAction"
                               v-bind:isRawJson=true>
                </RequestInputs>-->                
                <!-- <InputBodyTable v-bind:RequestInputData="appAction.RequestInputData"
                               v-bind:requestDetails="requestDetails"
                               v-bind:methodInputObject="appAction.RequestInputData[METHOD_INPUT_PARAMETERS.BODY][METHOD_INPUT_PARAMETERS.REQ_BODY.RAW][METHOD_INPUT_PARAMETERS.REQ_BODY_RAW.JSON]"
                               v-bind:appAction="appAction"
                               v-bind:isRawJson=true>
                </InputBodyTable> -->
            </template>
            <template v-else>
                <div class="itlTabPanel active">
                    <div @click="openJsonEditor()">
                        <textarea class="editor"
                                  v-model="appAction.RequestInputData[METHOD_INPUT_PARAMETERS.BODY][METHOD_INPUT_PARAMETERS.REQ_BODY.RAW][METHOD_INPUT_PARAMETERS.REQ_BODY_RAW.JSON].data"
                                  style="resize: vertical;"
                                  readonly
                                  @change="jsonInuptDataChanged($event)">
                            {
                        
                            }
                        </textarea>
                    </div>
                    <template v-if="showJsonEditor">
                        <JsonEditor v-bind:value="appAction.RequestInputData[METHOD_INPUT_PARAMETERS.BODY][METHOD_INPUT_PARAMETERS.REQ_BODY.RAW][METHOD_INPUT_PARAMETERS.REQ_BODY_RAW.JSON].data"
                                    v-bind:methodObject="appAction.RequestInputData[METHOD_INPUT_PARAMETERS.BODY][METHOD_INPUT_PARAMETERS.REQ_BODY.RAW][METHOD_INPUT_PARAMETERS.REQ_BODY_RAW.JSON]"
                                    v-bind:type="'Request'">
                        </JsonEditor>
                    </template>
                </div>
                <div v-if="appAction.RequestInputData[METHOD_INPUT_PARAMETERS.BODY][METHOD_INPUT_PARAMETERS.REQ_BODY.RAW][METHOD_INPUT_PARAMETERS.REQ_BODY_RAW.JSON].rawJsonDataUpdated.show"
                    style="font-size: 18px; color: #4eca44; text-align: center;">
                    <b>{{appAction.RequestInputData[METHOD_INPUT_PARAMETERS.BODY][METHOD_INPUT_PARAMETERS.REQ_BODY.RAW][METHOD_INPUT_PARAMETERS.REQ_BODY_RAW.JSON].rawJsonDataUpdated.message}}</b>
                </div>
                <div class="itlFormRow inline" style="justify-content: space-between;">
                    <div class="itlFormInputWrap">
                        <!--<button class="outputBtn itlFormCol"
                                v-on:click="validateBeforeGeneratingInput($event)">
                            Set as Input
                        </button>-->
                    </div>
                    <!-- <div class="itlFormInputWrap">
                        <button class="saveSmallBtn"
                                v-on:click="saveRequestRawJsonDataIfChanged($event)">
                            Save JSON Structure
                        </button>
                    </div> -->
                </div>
                <span v-if="shouldShowGeneratedMessage" style="color: green; font-size: 14px;">Generated input variables</span>
            </template>
            
        </template>

    </div>
</template>

<script src="./ReqBody.js"></script>
