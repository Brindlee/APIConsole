<template>
	<table cellpadding="0" cellspacing="0" border="0" width="100%">
		<thead>
			<tr>
				<th>
					<table cellpadding="0" cellspacing="0" border="0" width="100%" class="itlTableStyle">
						<thead>
							<tr v-if="isRawJson">
								<!--<th width="30">
                                    <input type="checkbox"
                                           v-model="methodInputObject.selectAllPairs" />
								</th>-->
								<th width="15%">Key</th>
								<th width="15%">Value</th>
								<th width="14%">Label</th>
								<th width="14%">Type</th>
								<th width="10%">Parent</th>
								<th width="8%">Refresh</th>
								<th width="8%">Required</th>
								<th width="14%">Order</th>
								<th width="40">
									<a
										href="javascript:void(0);"
										v-on:click="removeAllInputParameters()"
										v-if="methodInputObject.parameters.length > 0"
										style="margin-right: 5px;"
									>
										<svg
											width="16"
											xmlns="http://www.w3.org/2000/svg"
											xmlns:xlink="http://www.w3.org/1999/xlink"
											x="0px"
											y="0px"
											viewBox="0 0 48 48"
											style="enable-background:new 0 0 48 48;"
											xml:space="preserve"
										>
											<g>
												<path
													style="fill:#3B3463;"
													d="M12,38c0,2.2,1.8,4,4,4h16c2.2,0,4-1.8,4-4V14H12V38z M38,8h-7l-2-2H19l-2,2h-7v4h28V8z"
												/>
											</g>
										</svg>
									</a>
								</th>
							</tr>
							<tr v-else>
								<th width="30">
									<input type="checkbox" v-model="methodInputObject.selectAllPairs" />
								</th>
								<th width="42%">Key</th>
								<th width="42%">Value</th>
								<th width="16%">FIX VALUE</th>
								<th width="40"></th>
							</tr>
						</thead>
					</table>
				</th>
			</tr>
		</thead>
		<tbody>
			<template v-if="isRawJson">
				<tr v-for="(parameter, parameterIndex) in methodInputObject.parameters" v-bind:key="'parameter-'+parameterIndex">
					<BodyParameter
						v-bind:parameter="parameter"
						v-bind:methodInputObject="methodInputObject"
						v-bind:inputParameters="methodInputObject.parameters"
						v-bind:parameterIndex="parameterIndex"
						v-bind:requestDetails="requestDetails"
						v-bind:appAction="appAction"
						v-bind:isRawJson="isRawJson"
					></BodyParameter>
				</tr>
			</template>
			<template v-else>
				<tr v-for="(parameter, parameterIndex) in methodInputObject.parameters" v-bind:key="'parameter-'+parameterIndex">
					<Parameter
						v-bind:parameter="parameter"
						v-bind:methodInputObject="methodInputObject"
						v-bind:inputParameters="methodInputObject.parameters"
						v-bind:parameterIndex="parameterIndex"
						v-bind:requestDetails="requestDetails"
						v-bind:appAction="appAction"
						v-bind:isRawJson="isRawJson"
					></Parameter>
				</tr>
			</template>
		</tbody>
	</table>
</template>

<script src="./RequestInputs.js"></script>