<template>
    <div class="itlModalBg">
        <div class="itlModal" style="width: 900px; height: 560px;">
            <div class="itlModalHeader orange">
                <div class="itlModalTxt">
                    Json Editor
                    <button @click="format()"
                            style="float: right;margin-right: 20px;">
                        Beautify
                    </button>
                </div>
                <span class="itlModalClose" @click="closeModal()">&times;</span>
            </div>
            <div class="itlModalBody">
                <div id="ace-editor">{{value}}</div>
            </div>
            <div class="itlModalFooter btnWrap"
                 style="margin-top: 420px;float: right; margin-right: 50px;">
                <button style="border-radius: 5px 5px 5px 5px;"
                        class="btn btnOrange"
                        @click="save()">
                    Done
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

<script src="./JsonEditor.js"></script>