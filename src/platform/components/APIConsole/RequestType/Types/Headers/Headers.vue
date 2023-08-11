<template>
    <div class="itlTabPanel active">
        <div class="tabPanelTopBar">
            <div class="weight800">
                Headers
            </div>
            <div class="tabPanelTopBarLinks">
                <button class="saveSmallBtn"
                        @click="saveHeaderParameteres()">
                    Save
                </button>
                <a href="javascript:void(0);">Bulk Edit</a>
            </div>
        </div>

        <RequestInputs v-bind:RequestInputData="appAction.RequestInputData"
                       v-bind:requestDetails="requestDetails"
                       v-bind:methodInputObject="appAction.RequestInputData[METHOD_INPUT_PARAMETERS.HEADERS]"
                       v-bind:appAction="appAction"
                       v-bind:isRawJson=false>
        </RequestInputs>

    </div>
</template>

<script src="./Headers.js"></script>
