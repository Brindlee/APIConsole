export default {
    isMobileBrowser() {
        let check = false;
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            check = true;
        } else if (/Macintosh/i.test(navigator.userAgent) && window.screen.width <= 820) {
            check = true;
        }
        return check;
    },
    testServers() {
        return ["test.integrately.com", "test1.integrately.com", "test2.integrately.com", "test3.integrately.com", "test4.integrately.com"]
    },
    deepCopyObject: function(obj) {
        return JSON.parse(JSON.stringify(obj));
    },
    getErrorStringFromErrors: function(Errors) {
        if (typeof(Errors) == 'undefined' || Errors == null) {
            return 'Something went wrong';
        } else {
            var error = '';
            var array = [];
            if (this.isArray(Errors)) {
                for (var i = 0; i < Errors.length; i++) {
                    var newError = Errors[i];
                    var message = newError.FieldLabel + ': ' + newError.Message;
                    array.push(message);
                }
            } else {
                if (this.isObject(Errors)) {
                    for (var property in Errors) {
                        var value = Errors[property].Errors.toString();
                        array.push(property + ': ' + value);
                    }
                }
            }

            if (array.length > 0) {
                error = array.toString();
            }

            return error;
        }
    },
    isNullOrEmpty(value) {
        if (this.isNull(value) ||
            ((typeof(value) != 'undefined') && value === '')) {
            return true;
        }
        return false;
    },
    isNull(value) {
        if ((typeof(value) == 'undefined') || (value == null)) {
            return true;
        }
        return false;
    },
    isProudction() {
        let host = window.location.host;
        if (host == "app.integrately.com") {
            return true;
        }
        return false;
    },
    isTest() {
        let host = window.location.host;
        if (this.testServers().includes(host)) {
            return true;
        }
        return false;
    },
    isLocal() {
        let host = window.location.host;
        if (host.indexOf("localhost") != -1) {
            return true;
        }
        return false;
    },
    getJSONData(jsonText) {
        try {
            let jsonData = JSON.parse(jsonText);
            return jsonData;
        } catch (exception) {
            return null;
        }
    },
    isArray: function(value) {
        if (Array.isArray(value)) {
            return true;
        }
        return false;
    },
    isObject: function(value) {
        return Object.keys(value).length;
    }
}