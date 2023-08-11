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
//import beautifier from 'ace-builds/src-noconflict/ext-beautify';

export default {
    name: 'JsonEditor',
    props: {
        value: String,
        methodObject: Object,
        type: String
    },
    data() {
        return {
            editor: null
        };
    },
    mounted() {
        this.editor = ace.edit("ace-editor");
        this.editor.session.setMode("ace/mode/json");
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
            this.$parent.showJsonEditor = false;
        },
        async save() {
            let result = true;
            let json = null;
            let code = this.editor.getValue();
            if (code !== '') {
                try {
                    json = JSON.parse(code);
                } catch (exception) {
                    result = false;
                    this.$store.dispatch("toaster/show", { type: "error", message: exception, time: 2500 });
                }
            }
            if (result) {
                this.methodObject.data = code;
                if (this.type == 'Request') {
                    this.$parent.jsonInuptDataChanged();
                }
                this.closeModal(json);
            }
        },
        format() {
            //beautifier.beautify(this.editor.session);
            try {
                var json = JSON.parse(this.editor.getValue());
                this.editor.setValue(JSON.stringify(json, null, '\t'));
                if (this.type == 'Request') {
                    this.$parent.jsonInuptDataChanged();
                }
            } catch (exception) {
                this.$store.dispatch("toaster/show", { type: "error", message: exception, time: 2500 });
            }
        },
        setFocus() {
            this.editor.focus();
            var lineNumber = this.editor.getSession().getValue().split("\n").length;
            this.editor.gotoLine(lineNumber);
            this.editor.navigateLineEnd();
        }
    }
}