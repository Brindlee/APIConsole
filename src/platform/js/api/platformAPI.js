import axios from 'axios';

export default {

    //companyhub proxy
    async companyHubProxyGET(resourceUrl) {
        var response = await axios.get(`/a/platform/ch/${resourceUrl}`);
        return response.data;
    },

    async companyHubProxyPOST(resourceUrl, data) {
        var response = await axios.post(`/a/platform/ch/${resourceUrl}`, data);
        return response.data;
    },

    async companyHubProxyPUT(resourceUrl, data) {
        var response = await axios.put(`/a/platform/ch/${resourceUrl}`, data);
        return response.data;
    },

    async companyHubProxyDELETE(resourceUrl, data) {
        var response = await axios.delete(`/a/platform/ch/${resourceUrl}`, { data });
        return response.data;
    },

    //platform API
    async enablePlatform(data) {
        var response = await axios.post(`/a/platform/enable`, data);
        return response.data;
    },

    async makeHttpWebCall(payload) {
        //var response = await axios.post(`/a/platform/simulate`, payload);
        var response = await axios.post(`/api/makehttpcallout`, payload);
        console.log( 'makeHttpWebCall response: ', response );
        return response.data;
    },

    //ERROR-LOG API
    async platformErrors(query) {
        var response = await axios.get(`/a/platform/errors?${query}`);
        return response.data;
    },

    async errorLogDetails(errorId, query) {
        var response = await axios.get(`/a/platform/errors/${errorId}?${query}`);
        return response.data;
    },

    async enableIntegrationLog(integrationId, query) {
        var response = await axios.post(`/a/platform/${integrationId}/logs?${query}`);
        return response.data;
    },

    async getActionOutputFields(data) {
        var response = await axios.post(`/a/platform/outputs`, data);
        return response.data;
    },

    async getActionInputFields(data) {
        var response = await axios.post(`/a/platform/inputs`, data);
        return response.data;
    },

    async getActionDynamicDropdownData(data) {
        var response = await axios.post(`/a/platform/dropdown`, data);
        return response.data;
    },

    async getActionDynamicSearchData(data) {
        var response = await axios.post(`/a/platform/search`, data);
        return response.data;
    },

    async getFieldsEntityProperties(data) {
        var response = await axios.post(`/a/platform/entity-properties`, data);
        return response.data;
    }
}