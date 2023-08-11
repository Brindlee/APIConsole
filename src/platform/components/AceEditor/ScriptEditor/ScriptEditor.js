import ace from 'ace-builds';
import { version } from "ace-builds";
//import 'ace-builds/webpack-resolver';

// A lot of files are created during project build issue
//https://github.com/CarterLi/vue3-ace-editor/issues/3
/*ace.config.set(
	"basePath", 
	"https://cdn.jsdelivr.net/npm/ace-builds@" + require('ace-builds').version + "/src-noconflict/");*/
ace.config.set(
    "basePath",
    "https://cdn.jsdelivr.net/npm/ace-builds@" + version + "/src-noconflict/");
import beautifier from 'ace-builds/src-noconflict/ext-beautify';

export default {
    name: 'ScriptEditor',
    props: {
        value: String,
        type: String,
        details: Object
    },
    data() {
        return {
            editor: null,
            valueText: null
        };
    },
    mounted() {
        this.editor = ace.edit("ace-editor");
        //this.editor.setTheme("ace/theme/twilight");
        this.editor.session.setMode("ace/mode/javascript");        
        this.valueText = this.value;
        this.editor.setValue(this.valueText);
        this.setFocus();
    },
    beforeUnmount() {
        this.editor.destroy();
        var el = this.editor.container;
        el.parentNode.removeChild(el);

        this.editor.container = null;
        this.editor.renderer = null;

        this.editor = null;
    },
    methods: {
        closeModal() {
            this.$parent.showEditor = false;
        },
        async save() {
            this.setData();
            await this.$parent.saveData();
        },
        async saveAndClose() {
            await this.save();
            this.closeModal();
        },
        setData() {
            var code = this.editor.getValue();
            if (this.type == 'App') {
                this.details.AppScript_c = code;
            } else {
                this.details.ActionScript_c = code;
            }
            this.$parent.inputChanged();
        },
        format() {
            beautifier.beautify(this.editor.session);
            this.$parent.inputChanged();
        },
        setFocus() {
            this.editor.focus();
            var lineNumber = this.editor.getSession().getValue().split("\n").length;
            this.editor.gotoLine(lineNumber);
            this.editor.navigateLineEnd();
        },
        validateAndAddActionScript() {
            let code = this.editor.getValue();
            code = code.trim();
            if (code === '') {
                let scriptString = this.getActionLevelScript();
                this.editor.session.insert(0, scriptString);
                this.format();
            } else {
                this.$store.dispatch("toaster/show", {
                    type: "error",
                    message: "Please clear all script to add default script",
                    time: 2500
                });
            }
        },
        getActionLevelScript() {
            let actionScript = `
				var action = {
					pre: function (request) {
						var requestBody;
						if (request.Body != "") {
							requestBody = __Lib.removeNullOrEmptyFields(JSON.parse(request.Body));
						} else {
							requestBody = {};
						}
						/*Pre: Injected code begins*/
						/*Pre: Injected code ends*/
						return {
							Body: JSON.stringify(requestBody)
						};
					},
					post: function (response) {

						var result = __Lib.checkError(response);
						if (result.isErrorFound) {
							return __Lib.returnError(result, response);
						}
						var responseBody = JSON.parse(response.Body);
						/*Post: Injected code begins*/
						/*Post: Injected code ends*/
						return success(JSON.stringify(responseBody));
					},
					inputFields: function (actionParamsAsJson, supportsStandardDateFormat) {
						return __Lib.setCustomFields(actionParamsAsJson, "");
					},
					outputFields: function (actionParamsAsJson, supportsStandardDateFormat) {
						return __Lib.setCustomFields(actionParamsAsJson, "");
					}
				};
			`;
            return actionScript;
        }
    }
}