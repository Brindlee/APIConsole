<template>
    <td>
        <table cellpadding="0" cellspacing="0" border="0" width="100%" class="itlTableStyle">
            <tbody>
                <tr>
                    <!--<td width="30">
                        <input type="checkbox"
                               v-model="parameter.UI_Variables.IsSelected"
                               disabled />
                    </td>-->
                    <td width="14%">
                        <input type="text" class="itlFormInput sm"
                               v-model="parameter.Name"
                               placeholder="Enter key"
                               disabled />
                    </td>
                    <td width="14%">
                        <input type="text" class="itlFormInput sm"
                               v-model="parameter.SampleValue_c"
                               placeholder="Enter value"
                               @change="inputChanged($event)"/>
                    </td>
                    <td width="14%">
                        <input type="text" class="itlFormInput sm"
                               v-model="parameter.Label_c"
                               placeholder="Enter Label"
                               @change="inputChanged($event)" />
                    </td>
                    <td width="14%">
                        <select class="itlFormInput sm"
                                v-model="parameter.Type_c"
                                @change="variableTypeChange()">
                            <option v-for="(variableType, variableTypeIndex) in ACTION_VARIABLE_TYPES"
                                    v-bind:key="'variableType-'+variableTypeIndex"
                                    v-bind:value="variableType">
                                {{variableType}}
                            </option>
                        </select>
                    </td>
                    <td width="14%">
                        <input type="text" class="itlFormInput sm"
                               v-model="parameter.ParentKey_c"                
                               @change="inputChanged($event)"
                               v-bind:class="{ 'line-item': parameter.ParentKey_c != '' && parameter.ParentKey_c != null }"/>
                    </td>
                    <td width="8%">
                        <input type="checkbox"
                               v-model="parameter.SupportsRefreshFields_c"
                               @change="checkboxValueChanged()" />
                    </td>
                    <td width="8%">
                        <input type="checkbox"
                               v-model="parameter.IsRequired_c"
                               @change="isRequiredValueChanged(true)" />
                    </td>
                    <td width="14%">
                        <input type="number" class="itlFormInput sm"
                               v-model="parameter.Order_c"
                               placeholder="Order number"
                               @change="inputChanged($event)"/>
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

<script src="./BodyParameter.js"></script>