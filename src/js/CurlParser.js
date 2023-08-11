import qs from 'querystring';
import multipart from 'parse-multipart'
import parser from 'https://unpkg.com/yargs-parser@19.0.0/browser.js';

var CURLParser = /** @class */ (function() {
    function CURLParser(cURLStr) {
        this.cURLStr = cURLStr;
        var yargObj = parser(this.pretreatment(cURLStr));
        this.yargObj = yargObj;
    }
    /** 预处理 */
    CURLParser.prototype.pretreatment = function(cURLStr) {
        if (!cURLStr.startsWith('curl')) {
            throw new Error('curl syntax error');
        }
        // 删除换行
        var newLineFound = /\r|\n/.exec(cURLStr);
        if (newLineFound) {
            cURLStr = cURLStr.replace(/\\\r|\\\n/g, '');
        }
        // 改成通用写法
        cURLStr = cURLStr.replace(/ -XPOST/, ' -X POST');
        cURLStr = cURLStr.replace(/ -XGET/, ' -X GET');
        cURLStr = cURLStr.replace(/ -XPUT/, ' -X PUT');
        cURLStr = cURLStr.replace(/ -XPATCH/, ' -X PATCH');
        cURLStr = cURLStr.replace(/ -XDELETE/, ' -X DELETE');
        cURLStr = cURLStr.replace(/ --header/g, ' -H');
        cURLStr = cURLStr.replace(/ --user-agent/g, ' -A');
        cURLStr = cURLStr.replace(/ --request/g, ' -X');
        cURLStr = cURLStr.replace(/ --(data|data-binary|data-urlencode)/g, ' -d');
        cURLStr = cURLStr.replace(/ --form/g, ' -F');
        cURLStr = cURLStr.trim();
        cURLStr = cURLStr.replace(/^curl/, '');
        return cURLStr;
    };
    /** 如果有误写的两个相同的，取最后一个 */
    CURLParser.prototype.getFirstItem = function(key) {
        var e = this.yargObj[key];
        if (!Array.isArray(e)) {
            return e;
        }
        return e[e.length - 1] || '';
    };
    CURLParser.prototype.getUrl = function() {
        var yargObj = this.yargObj;
        var uri = '';
        uri = yargObj._[0];
        if (yargObj['url']) {
            uri = yargObj['url'];
        }
        if (!uri) {
            Object.values(yargObj).forEach(function(e) {
                if (typeof e !== 'string') {
                    return;
                }
                if (e.startsWith('http') || e.startsWith('www.')) {
                    uri = e;
                }
            });
        }
        return uri;
    };
    CURLParser.prototype.getQuery = function(uri) {
        var obj = new URL(uri);
        return obj.searchParams.toString();
    };
    CURLParser.prototype.getHeaders = function() {
        var yargObj = this.yargObj;
        var headers = {};
        if (!Reflect.has(yargObj, 'H')) {
            return headers;
        }
        var yargHeaders = yargObj['H'];
        if (!Array.isArray(yargHeaders)) {
            yargHeaders = [yargHeaders];
        }
        yargHeaders.forEach(function(item) {
            var i = item.indexOf(':');
            var name = item.substring(0, i).trim().toLowerCase();
            var val = item.substring(i + 1).trim();
            headers[name] = val;
        });
        if (Reflect.has(yargObj, 'A')) {
            headers['user-agent'] = this.getFirstItem('A');
        }
        return headers;
    };
    CURLParser.prototype.getMethods = function() {
        var yargObj = this.yargObj;
        var me = this.getFirstItem('X') || 'GET';
        if (Reflect.has(yargObj, 'd') || Reflect.has(yargObj, 'F')) {
            me = 'POST';
        }
        return me.toUpperCase();
    };
    CURLParser.prototype.getBody = function(headers) {
        var contentType = headers['content-type'];
        var type = 'text/plain';
        var data = this.yargObj['d'];
        if (contentType) {
            if (contentType.indexOf('json') > -1) {
                type = 'application/json';
            }
            if (contentType.indexOf('urlencoded') > -1) {
                type = 'application/x-www-form-urlencoded';
            }
            if (this.cURLStr.indexOf(' --data-urlencoded') > -1) {
                type = 'application/x-www-form-urlencoded';
            }
            if (Array.isArray(data) && type !== 'application/x-www-form-urlencoded') {
                type = 'application/x-www-form-urlencoded';
                data = data.join('&');
            }
            if (this.yargObj['F']) {
                type = 'multipart/form-data';
            }
            if (contentType.indexOf('form-data') > -1) {
                type = 'multipart/form-data';
                var boundary = '';
                var match = contentType.match('/boundary=.+/');
                if (!match) {
                    type = 'text/plain';
                } else {
                    boundary = match[0].slice(9);
                    try {
                        var parts = multipart.parse(data, boundary);
                        this.yargObj['F'] = parts.map(function(item) {
                            return "".concat(item.name, "=").concat(item.data);
                        });
                    } catch (error) {
                        type = 'text/plain';
                    }
                }
            }
        } else {
            if (typeof data === 'string' && data) {
                try {
                    JSON.parse(data);
                    type = 'application/json';
                } catch (error) {
                    //
                }
            }
        }
        var body = '';
        switch (type) {
            case 'application/json':
                try {
                    body = JSON.parse(data);
                } catch (error) {
                    body = data;
                }
                break;
            case 'application/x-www-form-urlencoded':
                body = qs.parse(data);
                break;
            case 'multipart/form-data':
                // 指定 form
                if (this.yargObj['F']) {
                    var multipartUpload_1 = {};
                    var yargFrom = this.yargObj['F'];
                    if (!Array.isArray(yargFrom)) {
                        yargFrom = [yargFrom];
                    }
                    yargFrom.forEach(function(item) {
                        var arr = item.split('=');
                        multipartUpload_1[arr[0]] = arr[1];
                    });
                    body = multipartUpload_1;
                } else {
                    // 从 d 中解析
                }
                break;
            default:
                body = 'data';
                break;
        }
        var requestBody = {
            type: type,
            data: body
        };
        return requestBody;
    };
    CURLParser.prototype.parse = function() {
        var uri = this.getUrl();
        var headers = this.getHeaders();
        var ret = {
            url: uri,
            method: this.getMethods(),
            headers: headers,
            query: this.getQuery(uri),
            body: this.getBody(headers)
        };
        return ret;
    };
    return CURLParser;
}());

export default CURLParser;