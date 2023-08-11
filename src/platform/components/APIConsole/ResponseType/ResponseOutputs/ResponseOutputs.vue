<template>
    <div v-if="methodOutputObject.parameters.length > 0">
        <div class="itlFormRow hasCol">
            <div class="itlFormRow hasCol">
                <div class="itlFormCol">
                    <button class="outputBtn itlFormCol"
                            v-on:click="clearSelectedOutputFields()"
                            v-bind:class="{ 'disabled': !shouldEnableClearSelectedOutputFieldsButton }">
                        Clear output fields
                    </button>
                </div>
                <div class="itlFormCol" style="margin-left: 10px;">
                    <button class="outputBtn itlFormCol"
                            v-on:click="clearAllOutputFields()">
                        Clear all output fields
                    </button>
                </div>
            </div>
            <div class="itlFormRow hasCol">
                <button class="outputBtn itlFormCol"
                        @click="$parent.applyEntityPropertiesConfiguration()">
                    Set Entity Properties
                </button>
                <button class="outputBtn itlFormCol" style="margin-left: 10px;"
                        v-on:click="addEmptyOutputField($event)">
                    Add new field
                </button>
            </div>
        </div>

        <table cellpadding="0" cellspacing="0" border="0" width="100%">
            <thead>
                <tr>
                    <th>
                        <table cellpadding="0" cellspacing="0" border="0" width="100%" class="itlTableStyle">
                            <thead>
                                <tr>
                                    <th width="30">
                                        <input type="checkbox"
                                               v-model="methodOutputObject.selectAllPairs"
                                               @change="selectAllOutputFieldValueChanged()" />
                                    </th>
                                    <th width="17%">Key</th>
                                    <th width="17%">LABEL</th>
                                    <th width="17%">Type</th>
                                    <th width="17%">Parent</th>
                                    <th width="15%">
                                        Entity Property
                                    </th>
                                    <th width="15%">
                                        Sample Value
                                    </th>
                                    <th width="6%">
                                        <div>
                                            <span>Is Sample </span>
                                            <br />
                                            <span>Value Field ?</span>
                                        </div>
                                    </th>
                                    <th width="40"></th>
                                </tr>
                            </thead>
                        </table>
                    </th>
                </tr>
            </thead>
            <tbody>

                <tr v-for="(parameter, parameterIndex) in methodOutputObject.parameters"
                    v-bind:key="'parameter-'+parameterIndex">
                    <Parameter v-bind:parameter="parameter"
                               v-bind:methodOutputObject="methodOutputObject"
                               v-bind:outputParameters="methodOutputObject.parameters"
                               v-bind:parameterIndex="parameterIndex"
                               v-bind:appAction="appAction">
                    </Parameter>
                </tr>
            </tbody>
        </table>
    </div>    
</template>

<script src="./ResponseOutputs.js"></script>