import LabelGenerator from '@/platform/js/mixins/LabelGenerator';

export default {
	name: "ParameterInput",
	mixins: [LabelGenerator],
	components: {

	},
	props: {
		parameter: Object,
		isRawJson: Boolean
	},
	data: function () {
		return {

		};
	},
	async created() {

	},
	methods: {
		inputChanged(event) {
			this.$parent.inputChanged(event);
		},
		generateInputFieldLabel() {
			let name = this.parameter.Name;
			let label = this.geneateFieldLabel(name);
			this.parameter.Label_c = label;
		}
	},
};