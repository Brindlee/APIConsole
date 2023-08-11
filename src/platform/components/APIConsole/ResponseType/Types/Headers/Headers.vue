<template>
    <div class="itlTabPanel active">
        <table cellpadding="0" cellspacing="0" border="0" width="100%" class="itlTableStyle">
            <thead>
                <tr>
                    <th>Key</th>
                    <th>Value</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(value, key, headerIndex) in appAction.ResponseOutputData[METHOD_OUTPUT_PARAMETERS.HEADERS].parameters"
                    v-bind:key="value + '-' + headerIndex">
                    <td>
                        <input type="text" disabled class="itlFormInput sm" v-bind:value="key" />
                    </td>
                    <td>
                        <input type="text" disabled class="itlFormInput sm" v-bind:value="value" />
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script src="./Headers.js"></script>