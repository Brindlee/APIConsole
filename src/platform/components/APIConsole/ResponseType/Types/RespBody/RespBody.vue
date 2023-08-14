<template>
	<div class="itlTabPanel active">
		
			<div @click="openJsonEditor()">
				<textarea
					class="editor"
					readonly
					v-model="appAction.ResponseOutputData[METHOD_OUTPUT_PARAMETERS.RESP_BODY].data"
					style="resize: vertical;"
				></textarea>
			</div>
			<template v-if="showJsonEditor">
				<JsonEditor
					v-bind:value="appAction.ResponseOutputData[METHOD_OUTPUT_PARAMETERS.RESP_BODY].data"
					v-bind:methodObject="appAction.ResponseOutputData[METHOD_OUTPUT_PARAMETERS.RESP_BODY]"
					v-bind:type="'Response'"
				></JsonEditor>
			</template>
		

		<!--<div v-if="appAction.Entity_c.ID == 0" style="margin-left: 5px; margin-top: 5px;">
			<span class="red bold">
				Note:
			</span> 
			Standard entity is not set for this <b>{{appAction.Type_c}}</b>. 
			So make sure to add it so statndard entity and sample values will be set directly
		</div>

		<div style="display: flex; align-items: center; padding: 10px 0;">
			
		</div>
		
		<div class="itlFormRow inline">
			<div class="itlFormInputWrap" style="width: 400px;">
                <div class="itlFormInputLabel">Records Container Key</div>
                <input type="text" class="itlFormInput"
                        v-model="appAction.RecordsContainerKey_c"
                        @change="actionInputChanged('container')"
                        placeholder="Records Container Key">
            </div>
            <div class="itlFormInputWrap" style="width: 400px;">
                <div class="itlFormInputLabel">Records Identifier Key</div>
                <input type="text" class="itlFormInput"
                        v-model="appAction.RecordIdentifierKey_c"
                        @change="actionInputChanged('identifier')"
                        placeholder="Records Identifier Key">
            </div>
		</div>		
		<div v-if="flattenArrayList.length > 0">
			<h3>Below arrays can be flatten</h3>
			<ul style="list-style-type: none;">
				<li v-for="(item, itemIndex) in flattenArrayList" v-bind:key="'flattenItem-'+itemIndex">
					<input type="checkbox" v-model="item.selected" />
					{{item.key}}
				</li>
			</ul>
		</div>
		<div style="display: flex; align-items: center; padding: 10px 0;">
			<button class="outputBtn itlFormCol" @click="arraysInResponseOrContainerKey()">Find Arrays in Record container Key</button>			
		</div>	
		<div style="display: flex; align-items: center; padding: 10px 0;">
			<button class="outputBtn itlFormCol" @click="modifyResponseToFlatten()">Modify Response</button>
			<button class="outputBtn itlFormCol" style="margin-left:20px;" @click="injectPostCode()">Inject code</button>
			
			<button v-if="isWebhook"
					class="outputBtn itlFormCol" 
					style="margin-left:20px;" 
					@click="modifyResonseForWebhook()">
				Modify Reponse(Webhook)
			</button>
		</div>	

		<div style="display: flex; align-items: center; padding: 10px 0;">
			<button class="outputBtn itlFormCol" 
					style="margin-right: 10px;" 
					v-on:click="validateBeforeGeneratingOutput($event)">
				Set as Output
			</button>
			<b>(</b>
				<input  style="margin-left: 5px; margin-right: 5px; " 
					type="checkbox" 
					v-model="appAction.ResponseOutputData[METHOD_OUTPUT_PARAMETERS.RESP_BODY].setSampleValuesToEmptyFields" 
				/>
				<span style="margin-right: 5px;">Set sample value if existing output field have no sample value present</span>
			<b>)</b>
			
		</div>
		<div class="itlFormRow hasCol" style="justify-content: normal;">			
		</div>

		<div class="itlFormRow hasCol" style="justify-content: flex-end;">
			<div class="itlFormCol">
				<button class="saveSmallBtn" @click="saveBodyParameteres()" style="margin-top: 5px;">
					Save
				</button>
			</div>
		</div>

		
			<ResponseOutputs
				v-bind:ResponseOutputData="appAction.ResponseOutputData"
				v-bind:methodOutputObject="appAction.ResponseOutputData[METHOD_OUTPUT_PARAMETERS.RESP_BODY]"
				v-bind:appAction="appAction"
			></ResponseOutputs>
		

		<div class="itlModalBg" v-if="entityPropertiesConfiguration.show">
			<div class="itlModalNew">
				<span @click="closeEntityPropertiesConfigurationModal()" class="itlModalClose">
					<svg width="16"
						xmlns="http://www.w3.org/2000/svg"
						xmlns:xlink="http://www.w3.org/1999/xlink"
						x="0px"
						y="0px"
						viewBox="0 0 48 48"
						enable-background="new 0 0 48 48"
						xml:space="preserve">
					<g>
					<path fill="none" d="M-0.1,0h48v48h-48V0z" />

					</g>
					<g>
					<path fill="#FFFFFF"
						d="M38,12.8L35.2,10L24,21.2L12.8,10L10,12.8L21.2,24L10,35.2l2.8,2.8L24,26.8L35.2,38l2.8-2.8L26.8,24 L38,12.8z" />

					<path fill="none" d="M0,0h48v48H0V0z" />

						</g>
					</svg>
				</span>
				<div class="itlModalHeader orange">
					<div class="itlModalTxt">Entity Properties</div>
				</div>
				<div class="itlModalHeaderNew" style="text-align: start;">
					<div>
						<input type="radio" value="OnlyEmpty" v-model="entityPropertiesConfiguration.value" />
						Set entity property to only those output field which dont have entity property
					</div>	
					<div style="margin-top: 5px;">
						<input type="radio" value="All" v-model="entityPropertiesConfiguration.value" />
						Set entity property to all output fields						
					</div>
				</div>
				<button @click="applyEntityPropertiesConfiguration()" class="btn btnOrange">
					Apply Changes
				</button>
			</div>
		</div>-->
	</div>
</template>

<script src="./RespBody.js"></script>