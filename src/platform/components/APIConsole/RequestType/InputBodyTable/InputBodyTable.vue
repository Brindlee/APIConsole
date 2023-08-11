<template>
    <div class="itlModalBg" style="height: 700px;">
        <div class="itlModal">
            <div class="itlModalHeader orange">
                <div class="itlModalTxt">
                    Variables
                    ({{appAction.RequestInputData[METHOD_INPUT_PARAMETERS.BODY][METHOD_INPUT_PARAMETERS.REQ_BODY.RAW][METHOD_INPUT_PARAMETERS.REQ_BODY_RAW.JSON].parameters.length}})
                </div>
                <!--<span class="itlModalClose" @click="closeModal()">&times;</span>-->
            </div>
            <div class="itlModalBody">
                <RequestInputs v-bind:RequestInputData="appAction.RequestInputData"
                               v-bind:requestDetails="requestDetails"
                               v-bind:methodInputObject="appAction.RequestInputData[METHOD_INPUT_PARAMETERS.BODY][METHOD_INPUT_PARAMETERS.REQ_BODY.RAW][METHOD_INPUT_PARAMETERS.REQ_BODY_RAW.JSON]"
                               v-bind:appAction="appAction"
                               v-bind:isRawJson=isRawJson>
                </RequestInputs>
            </div>
            <div class="itlModalFooter">
                <button class="btn btnOrange btnBlock" @click="closeModal()">Done</button>
            </div>
        </div>
    </div>
</template>

<script src="./InputBodyTable.js"></script>