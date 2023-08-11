<template>
    <div class="itlTabPanel active">
        <div class="itlFormRow">
            <div class="itlFormInputGroup">
                <div class="itlFormInput"><span class="weight900">Action Script</span></div>
                <a href="javascript:void(0);"
                   @click="openEditor()"
                   class="itlFormInputGroupAddon darkBlue" style="float:right;">
                    <svg width="16" class="rightMarginSm" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 48 48" style="enable-background:new 0 0 48 48;" xml:space="preserve"> <path style="fill:#3B3463;" d="M27.2,33.2l9.2-9.2l-9.2-9.2L30,12l12,12L30,36L27.2,33.2z" /> <path style="fill:#3B3463;" d="M20.8,14.8L11.7,24l9.2,9.1L18.1,36L6,24L17.9,12L20.8,14.8z" /> </svg>
                    Edit Code
                </a>
            </div>
        </div>
        <!--<div class="tabPanelTopBar">
            <div class="tabPanelTopBarLinks">
                <button class="saveSmallBtn"
                    @click="validateActionScript()">
                Save
            </button>
            </div>
        </div>-->
        <textarea class="editor"
                  disabled
                  v-model="appAction.ActionScript_c"
                  style="resize: none;">
            
		</textarea>

        <template v-if="showEditor">
            <ScriptEditor v-bind:value="appAction.ActionScript_c"
                       v-bind:type="'Action'"
                       v-bind:details="appAction"></ScriptEditor>
        </template>

    </div>
</template>

<script src="./Script.js"></script>
