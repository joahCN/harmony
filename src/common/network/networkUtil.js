angular.module('harmony.networkUtil', [])
    .factory('harmonyNetworkUtil', function(){
        return {
            getCachedUrlKey : function (url, params, defaultParmas) {
                // copyed from angularjs source code ($resource and $http)
                if (!params) {
                    return url;
                }
                var _params = angular.copy(params),
                    parts = [],
                    val,
                    encodedVal,
                    remainParams = {},
                    urlParams = {};

                url.split(/\W/).forEach(function(param) {
                    if (param === 'hasOwnProperty') {
                        throw "hasOwnProperty is not a valid parameter name.";
                    }
                    if (!(new RegExp("^\\d+$").test(param)) && param &&
                        (new RegExp("(^|[^\\\\]):" + param + "(\\W|$)").test(url))) {
                        urlParams[param] = true;
                    }
                });
                url = url.replace(/\\:/g, ':');

                _params = _params || {};
                angular.forEach(urlParams, function(_, urlParam) {
                    val = _params.hasOwnProperty(urlParam) ? _params[urlParam] : defaultParmas[urlParam];
                    if (angular.isDefined(val) && val !== null) {
                        encodedVal = encodeUriSegment(val);
                        url = url.replace(new RegExp(":" + urlParam + "(\\W|$)", "g"), function(match, p1) {
                            return encodedVal + p1;
                        });
                    } else {
                        url = url.replace(new RegExp("(\/?):" + urlParam + "(\\W|$)", "g"), function(match,
                                                                                                     leadingSlashes, tail) {
                            if (tail.charAt(0) == '/') {
                                return tail;
                            } else {
                                return leadingSlashes + tail;
                            }
                        });
                    }
                });

                // strip trailing slashes and set the url (unless this behavior is specifically disabled)
                url = url.replace(/\/+$/, '') || '/';

                // then replace collapse `/.` if found in the last URL path segment before the query
                // E.g. `http://url.com/id./format?q=x` becomes `http://url.com/id.format?q=x`
                url = url.replace(/\/\.(?=\w+($|\?))/, '.');
                // replace escaped `/\.` with `/.`
                url = url.replace(/\/\\\./, '/.');


                // set params - delegate param encoding to $http

                angular.forEach(_params, function(value, key) {
                    if (!urlParams[key]) {
                        remainParams[key] = value;
                    }
                });

                var paramKeys = Object.keys(remainParams).sort();

                paramKeys.forEach(function(key){
                    var value = remainParams[key];
                    formatParam(value, key);
                });

                if (parts.length > 0) {
                    url += ((url.indexOf('?') == -1) ? '?' : '&') + parts.join('&');
                }

                return url;

                function formatParam(value, key) {
                    if (value === null || angular.isUndefined(value)) {
                        return;
                    }
                    if (!angular.isArray(value)) {
                        value = [value];
                    }

                    angular.forEach(value, function(v) {
                        if (angular.isObject(v)) {
                            if (angular.isDate(v)){
                                v = v.toISOString();
                            } else {
                                v = angular.toJson(v);
                            }
                        }
                        parts.push(encodeUriQuery(key) + '=' +
                            encodeUriQuery(v));
                    });
                }

                function encodeUriSegment(val) {
                    return encodeUriQuery(val, true).
                        replace(/%26/gi, '&').
                        replace(/%3D/gi, '=').
                        replace(/%2B/gi, '+');
                }

                function encodeUriQuery(val, pctEncodeSpaces) {
                    return encodeURIComponent(val).
                        replace(/%40/gi, '@').
                        replace(/%3A/gi, ':').
                        replace(/%24/g, '$').
                        replace(/%2C/gi, ',').
                        replace(/%20/g, (pctEncodeSpaces ? '%20' : '+'));
                }

            },
            /**
             * returned url not include query part.
             * @param url
             * @param params
             * @param defaultParmas
             * @returns {*}
             */
            getMaskedCacheUrlKey: function(url, params, defaultParmas){
                // copyed from angularjs source code ($resource and $http)
                if (!params) {
                    return url;
                }
                var _params = angular.copy(params),
                    parts = [],
                    val,
                    encodedVal,
                    remainParams = {},
                    urlParams = {};

                url.split(/\W/).forEach(function(param) {
                    if (param === 'hasOwnProperty') {
//                        throw $resourceMinErr('badname', "hasOwnProperty is not a valid parameter name.");
                    }
                    if (!(new RegExp("^\\d+$").test(param)) && param &&
                        (new RegExp("(^|[^\\\\]):" + param + "(\\W|$)").test(url))) {
                        urlParams[param] = true;
                    }
                });
                url = url.replace(/\\:/g, ':');

                _params = _params || {};
                angular.forEach(urlParams, function(_, urlParam) {
                    val = _params.hasOwnProperty(urlParam) ? _params[urlParam] : defaultParmas[urlParam];
                    if (angular.isDefined(val) && val !== null) {
                        encodedVal = encodeUriSegment(val);
                        url = url.replace(new RegExp(":" + urlParam + "(\\W|$)", "g"), function(match, p1) {
                            return encodedVal + p1;
                        });
                    } else {
                        url = url.replace(new RegExp("(\/?):" + urlParam + "(\\W|$)", "g"), function(match,
                                                                                                     leadingSlashes, tail) {
                            if (tail.charAt(0) == '/') {
                                return tail;
                            } else {
                                return leadingSlashes + tail;
                            }
                        });
                    }
                });

                // strip trailing slashes and set the url (unless this behavior is specifically disabled)
                url = url.replace(/\/+$/, '') || '/';

                // then replace collapse `/.` if found in the last URL path segment before the query
                // E.g. `http://url.com/id./format?q=x` becomes `http://url.com/id.format?q=x`
                url = url.replace(/\/\.(?=\w+($|\?))/, '.');
                // replace escaped `/\.` with `/.`
                url = url.replace(/\/\\\./, '/.');

                return url;
            }
        };
    });
