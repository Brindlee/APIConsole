<template>
    <span>
        <input type="text" class="itlFormInput sm" 
               v-model="parameter.Name" 
               placeholder="Enter key" 
               v-bind:disabled="isRawJson"
               @input="inputChanged($event)"
               @change="generateInputFieldLabel()"
               />
    </span>
</template>

<script src="./ParameterInput.js"></script>