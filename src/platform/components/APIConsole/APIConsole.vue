<template>
	<div class="itlTabPanel centeredContiner" v-bind:class="{ 'active': tabType == TriggerKeys.API_CONSOLE }">
		<div class="itlBuilderHeader weight900">
			<span class="itlBuilderHeaderTitle">
				{{appAction.Label_c}}
				<span class="btn">
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
								d="M6.1,34.4v7.5h7.5l22.1-22.1l-7.5-7.5L6.1,34.4z M41.5,13.9c0.8-0.8,0.8-2.1,0-2.8l-4.7-4.7 c-0.8-0.8-2-0.8-2.8,0l-3.7,3.7l7.5,7.5L41.5,13.9z"
							/>
						</g>
					</svg>
				</span>
			</span>
			<span class="itlBuilderHeaderActions">
				<span class="btn">
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
							<path style="fill:none;" d="M0,0h48v48H0V0z" />
							<path
								d="M6,10H2v32c0,2.2,1.8,4,4,4h32v-4H6V10z M42,2H14c-2.2,0-4,1.8-4,4v28c0,2.2,1.8,4,4,4h28c2.2,0,4-1.8,4-4V6 C46,3.8,44.2,2,42,2z M42,34H14V6h28V34z"
							/>
						</g>
					</svg>
				</span>
				<span class="btn">
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
				</span>
			</span>
			<!-- <a href="javascript:void(0);" 
                style="font-size: 14px; font-weight: 100; color: #ffa300; text-decoration: underline;"
                v-on:click="showFieldOrdering()">
                Input Variables
			</a>-->
		</div>
		<div class="itlTabsContainer" style="margin: 5px 0 15px;">
			<div class="itlTabs">
				<a
					href="javascript:void(0);"
					v-bind:class="{ 'active': curlTab == 'fill'}"
					v-on:click="curlTab='fill'"
				>Auto Parse Curl / JSON</a>
				<a
					href="javascript:void(0);"
					v-bind:class="{ 'active': curlTab == 'processed' }"
					v-on:click="curlTab='processed'"
				>Parsed Curl JSON</a>
			</div>

			<div class="itlTabsContent">
				<template v-if="curlTab == 'fill'">
					<div>
						<textarea style="height: 200px;width:100%;" v-model="curlRawData"></textarea>
						<button class="btn" v-on:click="processCurlRawData()">Auto Fill</button>
					</div>
				</template>

				<template v-if="curlTab == 'processed'">
					<div>
						<pre>{{parsedCurlData}}</pre>
					</div>
				</template>
			</div>
		</div>

		<div class="itlFormRow hasCol">
			<div class="itlFormCol">
				<div class="itlFormInputWrap">
					<select
						class="itlFormInput lg"
						v-model="appAction.Method_c"
						@change="dropdownValueChanged($event)"
					>
						<option
							v-for="(httpMethod, httpMethodIndex) in HTTP_METHODS"
							v-bind:key="'httpMethod-'+httpMethodIndex"
							v-bind:value="httpMethod"
						>{{httpMethod}}</option>
					</select>
				</div>
			</div>
			<div class="itlFormCol apiURL">
				<div class="itlFormInputWrap">
					<input
						type="text"
						class="itlFormInput lg"
						v-model="appAction.Url_c"
						@change="inputChanged($event)"
						placeholder="ex: https://www.example.com"
					/>
				</div>
			</div>
			<div class="itlFormCol">
				<button
					class="sendBtn"
					v-bind:class="{ 'disabled': shouldDisableSendButton }"
					v-on:click="saveBeforeValidation()"
				>Send</button>
			</div>
		</div>

		<RequestType v-bind:appAction="appAction" v-bind:app="app" v-bind:parsedCurlData="parsedCurlData"></RequestType>

		<ResponseType v-bind:appAction="appAction"></ResponseType>

		<!-- <template v-if="showOrderingModal">
            <OrderVariables v-bind:appAction="appAction">
            </OrderVariables> 
		</template>-->
	</div>
</template>

<script src="./APIConsole.js"></script>