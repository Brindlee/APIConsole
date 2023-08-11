<template>
    <td>
        <table cellpadding="0" cellspacing="0" border="0" width="100%" class="itlTableStyle">
            <tbody>
                <tr>
                    <td width="30">
                        <input type="checkbox" 
                               v-model="parameter.UI_Variables.IsSelected"
                               v-bind:disabled="isRawJson"/>
                    </td>
                    <td width="43%">
                        <ParameterInput v-bind:parameter="parameter"
                                        v-bind:inputParameters="inputParameters"
                                        v-bind:isRawJson="isRawJson">
                        </ParameterInput>
                    </td>
                    <td width="43%">
                        <input v-if="isHeaderType"
                               type="text" class="itlFormInput sm"
                               v-model="parameter.SampleValue_c"
                               placeholder="Enter value"
                               @input="inputChanged($event)"
                               @change="setSampleValueAsDefaultValue()"/>
                        <input v-else
                               type="text" class="itlFormInput sm"
                               v-model="parameter.SampleValue_c"
                               placeholder="Enter value"
                               v-bind:disabled="isRawJson"
                               @input="inputChanged($event)" />
                    </td>
                    <td width="14%" v-if="isRawJson">
                        <input type="text"
                               v-model="parameter.Type_c"
                               disabled/>
                    </td>
                    <td width="14%" v-else>
                        <input type="checkbox"
                               v-model="parameter.UI_Variables.IsFixedValue"
                               @change="dropdownValueChanged()" />
                            <!--<template v-if="requestDetails.requestType == METHOD_INPUT_PARAMETERS.BODY">
                                <input type="checkbox" v-model="parameter.UI_Variables.IsFixedValue"/>
                            </template>
                            <template v-else>
                                <input type="checkbox" />
                            </template>-->
                    </td>
                    <td class="itlTableActions">
                        <a href="javascript:void(0);" 
                           v-on:click="removeInputParameter()" 
                           v-bind:class="{ 'disabled': ((inputParameters.length == 1 || (parameterIndex == inputParameters.length-1) ) && !isRawJson) }">
                            <svg width="16" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 48 48" style="enable-background:new 0 0 48 48;" xml:space="preserve"> <g> <path style="fill:#3B3463;" d="M12,38c0,2.2,1.8,4,4,4h16c2.2,0,4-1.8,4-4V14H12V38z M38,8h-7l-2-2H19l-2,2h-7v4h28V8z" /></g> </svg>
                        </a>
                    </td>
                </tr>
            </tbody>
        </table>        
    </td>
</template>

<script src="./Parameter.js"></script>