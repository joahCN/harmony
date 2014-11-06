angular.module( 'harmony.network', ['ngResource','harmony.utils', 'harmony.networkUtil'])
    .provider("harmonyNetwork", function(){
        var self = this,
            proxyUrl;
        this.setProxyUrl = function(url) {
            proxyUrl = url;
        };
        this.getProxyUrl = function() {
            return proxyUrl;
        };

        this.$get = ['$resource','harmonyUtils','$cacheFactory', 'harmonyNetworkUtil',function($resource, harmonyUtils, $cacheFactory, harmonyNetworkUtil){

            var cache = $cacheFactory('networkCache');

            function getUrl(command){
                return self.getProxyUrl() + command;
            }

            function invalidateCaches(invalidateCommands, params, defaultParam){
                var caches = cache.info();
                invalidateCommands.forEach(function(command){
                    var url = getUrl(command);
                    var cachedKey = harmonyNetworkUtil.getMaskedCacheUrlKey(url, params, defaultParam);
                    for(var key in caches) {
                        if(caches.hasOwnProperty(key)){
                            if(new RegExp(cachedKey).test(key)){
                                cache.remove(key);
                            }
                        }
                    }
                });

            }

            return {
                /**
                 *
                 * @param options
                 * useCache: boolean.default true, if false, will ignore previous cached response, and send a new request, the response will be cached again.
                 * invalidate: array. a list of commands that its caches should be dropped.
                 * @returns {*}
                 */
                request: function(options){
                    var command = options.command;
                    var url = getUrl(command);
                    var params = options.params || {};
                    var data = options.data;
                    var onSuccess = options.onSuccess || harmonyUtils.dummyFn;
                    var onError = options.onError || harmonyUtils.dummyFn;
                    var useCache = angular.isDefined(options.useCache) ? options.useCache : true;
                    var invalidateCommands = options.invalidateCaches;
                    var defaultParam = {};

                    if(!useCache) {
                        cache.remove(harmonyNetworkUtil.getCachedUrlKey(url, params, defaultParam));
                    }

                    var resource = $resource(url, defaultParam, {
                        getData: {
                            method: 'GET',
                            cache: cache
                        },
                        postData: {
                            method: 'POST',
                            cache: cache
                        }
                    });
                    var response;
                    if(angular.isDefined(data)){
                        response = resource.postData(params, data, handleSuccess, onError);
                    } else {
                        response = resource.getData(params, handleSuccess, onError);
                    }
                    return response;

                    function handleSuccess(){
                        if(invalidateCommands){
                            invalidateCaches(invalidateCommands, params, defaultParam);
                        }
                        onSuccess(arguments);
                    }
                },
                getProxyUrl: function(){
                    return self.getProxyUrl();
                }
            };
        }];

    });
