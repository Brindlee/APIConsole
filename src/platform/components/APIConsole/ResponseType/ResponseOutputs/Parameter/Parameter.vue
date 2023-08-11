<template>
    <td>
        <table cellpadding="0" cellspacing="0" border="0" width="100%" class="itlTableStyle">
            <tbody>
                <tr>
                    <td width="30">
                        <input type="checkbox" v-model="parameter.UI_Variables.IsSelected"
                               @change="parameterCheckboxSelectionValueChanged()" />
                    </td>
                    <td width="14%">
                        <input type="text" class="itlFormInput sm"
                               v-model="parameter.Name"
                               placeholder="Enter key"
                               @input="keyValueInputChanged($event)"
                               @change="generateInputFieldLabel()" />
                    </td>
                    <td width="14%">
                        <input type="text" class="itlFormInput sm"
                               v-model="parameter.Label_c"
                               placeholder="Enter label"
                               @input="keyValueInputChanged($event)"
                               @change="inputChanged()" />
                    </td>
                    <td wdith="18%">
                        <select class="itlFormInput sm"
                                v-model="parameter.Type_c"
                                @change="dropdownValueChanged($event)">
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
                               placeholder="Enter Parent Key"
                               @change="inputChanged()"
                               v-bind:class="{ 'line-item': parameter.ParentKey_c != '' && parameter.ParentKey_c != null }" />
                    </td>
                    <td width="18%">
                        <div class="itlFormInputWrap">
                            <div class="chooseAppsLayoutCol itlDropdown itlAppDropdown"
                                 v-bind:class="{'in' : standardFieldData.show}"                                 
                                 v-click-outside="{func: hideDropdown, args: {}}">
                                <div class="itlDropdownSelected rounded"
                                     v-on:click="showDropdown($event);">
                                    <template v-if="parameter.Entity_Property_c.ID != 0">
                                        <span style="color: #5223d3;">
                                            {{parameter.Entity_Property_c.Name}}
                                        </span>
                                        <span @click="clearStandardField()"
                                              class="itlModalClose"
                                              style="font-size: 0.7rem; font-weight: 500; top: 9px; color: rgb(0, 0, 0); right: 25px;">
                                            X
                                        </span>
                                    </template>
                                    <template v-else>
                                        <span style="color: #cccccc;">Set Entity Property</span>
                                    </template>
                                </div>
                                <div class="itlDropdownList" v-if="standardFieldData.show">
                                    <div class="itlDropdownSearchWrap">
                                        <svg class="searchIcon" viewBox="0 0 41.4 36.8"><path fill="#918e9f" d="M28.1,23.9h-1.6l-0.6-0.5c2-2.3,3.1-5.2,3.1-8.4c0-7.2-5.8-13-13-13s-13,5.8-13,13s5.8,13,13,13 c3.2,0,6.2-1.2,8.5-3.1l0.5,0.5v1.6l10,10l3-3L28.1,23.9z M16.1,23.9c-5,0-9-4-9-9s4-9,9-9s9,4,9,9S21,23.9,16.1,23.9z" /></svg>
                                        <input type="text" class="itlDropdownSearchInput" placeholder="Search..." v-model="standardFieldData.searchText" />
                                    </div>
                                    <ul class="thinScrollbar">
                                        <li v-for="(standardField, standardFieldIndex) in standardFields"
                                            v-bind:key="'standardField-' + standardField.ID + '-' + standardFieldIndex"
                                            v-on:click="setStandardField(standardField);">
                                            <a href="javascript:void(0);">
                                                {{standardField.Name}}
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </td>
                    <td width="14%">
                        <input type="text" class="itlFormInput sm"
                               v-model="parameter.SampleValue_c"
                               placeholder="Sample value"
                               @change="inputChanged()" />
                    </td>
                    <td width="6%">
                        <input type="checkbox"
                               v-bind:class="{ 'disabled': isWebhook }"
                               v-model="parameter.IsSampleValueField_c" />
                    </td>
                    <td class="itlTableActions">
                        <a href="javascript:void(0);"
                           v-on:click="removeOutputParameter()">
                            <svg width="16" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 48 48" style="enable-background:new 0 0 48 48;" xml:space="preserve"> <g> <path style="fill:#3B3463;" d="M12,38c0,2.2,1.8,4,4,4h16c2.2,0,4-1.8,4-4V14H12V38z M38,8h-7l-2-2H19l-2,2h-7v4h28V8z" /></g> </svg>
                        </a>
                    </td>
                </tr>
            </tbody>
        </table>
    </td>
</template>

<script src="./Parameter.js"></script>