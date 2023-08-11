<template>
    <div class="itlModalBg">
        <div class="itlModal" style="width: 900px; height: 560px;">
            <div class="itlModalHeader orange">
                <div class="itlModalTxt">
                    Script Editor
                    <div style="float: right;">
                        <button v-if="type == 'Action'" 
                                @click="validateAndAddActionScript()"
                                style="margin-right: 20px;">
                            Add script
                        </button>
                        <button @click="format()"
                                style="margin-right: 20px;">
                            Beautify
                        </button>
                    </div>                    
                </div>
                <span class="itlModalClose" @click="closeModal()">&times;</span>
            </div>
            <div class="itlModalBody">
                <div id="ace-editor"></div>
            </div>
            <div class="itlModalFooter btnWrap" 
                 style="margin-top: 420px;float: right; margin-right: 50px;">
                <button style="        border-radius: 5px 5px 5px 5px;" 
                        class="btn btnOrange" 
                        @click="save()">
                    Save
                </button>
                <button style="border-radius: 5px 5px 5px 5px;" 
                        class="btn btnOrange" 
                        @click="saveAndClose()">
                    Save &amp; Close
                </button>
            </div>
        </div>
    </div>    
</template>

<style>
    #ace-editor {
        position: absolute;
        width: 850px;
        height: 450px;
    }

    .ace_editor, .ace_editor * {
        font-family: "Monaco", "Menlo", "Ubuntu Mono", "Droid Sans Mono", "Consolas", monospace !important;
        font-size: 14px !important;
        font-weight: 400 !important;
        letter-spacing: 0 !important;
    }
</style>

<script src="./ScriptEditor.js"></script>