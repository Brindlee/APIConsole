<template>
    <div class="itlTabPanel active">
        <div class="itlFormLayout">
            <div class="itlFormRow inline" style="justify-content: space-between;">
                <div class="itlFormInputWrap">
                    <span class="weight700" style="margin-right: 15px;">Use App authentication</span>
                    <input type="checkbox"
                           v-model="appAction.RequestInputData[METHOD_INPUT_PARAMETERS.AUTHENTICATION].useAppAuthentication"
                           @change="checkboxValueChanged($event)">
                </div>
                <div class="itlFormInputWrap">
                    <span class="weight700" style="margin-right: 15px;">Authentication Type: <span class="weight600">{{app.AuthType_c}}</span></span>
                    <!--<div class="itlFormInputLabel"><span class="weight900">Authentication Type</span></div>
                    <input type="text" class="itlFormInput sm  disabled" v-model="app.AuthType_c" />
                    <select class="itlFormInput">
                        <option v-for="(authentication, authenticationIndex) in AUTHENTICATION_TYPES"
                                v-bind:key="'authentication-'+authenticationIndex"
                                v-bind:value="authentication.Properties.Value">
                            {{authentication.Properties.Label}}
                        </option>
                    </select>-->
                </div>  
            </div>
            <div class="itlFormRow inline">
                              
            </div>            
        </div>
        <table cellpadding="0" cellspacing="0" border="0" width="100%" class="itlTableStyle">
            <thead>
                <tr>
                    <th>Key</th>
                    <th>Value</th>
                    <!--<th width="150">Add to</th>-->
                </tr>
            </thead>
            <tbody>
                <template v-if="isOAuthType">
                    <tr v-for="(parameter, parameterIndex) in app.OAuth.parameters"
                        v-bind:key="'parameter-oauth-'+parameterIndex">
                        <td>
                            <input type="text"
                                   class="itlFormInput sm disabled"
                                   v-bind:value="parameter.Name" />
                        </td>
                        <td>
                            <input type="text"
                                   class="itlFormInput sm disabled"
                                   v-bind:value="parameter.Value" />
                        </td>
                    </tr>
                </template>
                
                    <tr v-for="(parameter, parameterIndex) in authVariables"
                        v-bind:key="'parameter-'+parameterIndex">
                        <td>
                            <input type="text"
                                   class="itlFormInput sm disabled"
                                   v-bind:value="parameter.Name" />
                        </td>
                        <td>
                            <input type="text"
                                   class="itlFormInput sm disabled"
                                   v-bind:value="parameter.UI_Variables.SampleValue" />
                        </td>
                    </tr>
               
                
                <!--<tr>
                    <td>
                        <input type="text" class="itlFormInput sm" value="Name" />
                    </td>
                    <td>
                        <input type="text" class="itlFormInput sm" value="API_Key" />
                    </td>
                    <td>
                        <select class="itlFormInput sm">
                            <option>Header</option>
                            <option>Query params</option>
                        </select>
                    </td>
                </tr>-->
            </tbody>
        </table>
    </div>
</template>

<script src="./Authentication.js"></script>
