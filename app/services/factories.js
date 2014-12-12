/**
 * Application factories
 * @author Martin Vach
 */
var myAppFactory = angular.module('myAppFactory', ['ngResource']);

/**
 * Main data factory
 */
myAppFactory.factory('dataFactory', function($http, $q, myCache, cfg) {
    var enableCache = true;
    return({
        getApiData: getApiData,
        postApiData: postApiData,
        putApiData: putApiData,
        deleteApiData: deleteApiData,
        demoData: demoData,
        setCache: setCache,
        runCmd: runCmd
    });

    /**
     * Gets dummy data
     */
    function demoData(file, callback) {
        var request = {
            method: "get",
            url: cfg.demo_url + file
        };
        return getApiHandle(callback, request, file);

    }

    /**
     * API data
     */
    // Get
    function getApiData(api, callback, params) {
        var request = {
            method: "get",
            url: cfg.server_url + cfg.api[api] + (params ? params : '')
        };
        return getApiHandle(callback, request, api);
    }

    // Post
    function postApiData(api, data, callback) {
        var request = {
            method: "post",
            data: data,
            url: cfg.server_url + cfg.api[api]
        };
        return storeApiHandle(callback, request);
    }

    // Put
    function putApiData(api, id, data, callback) {
        var request = {
            method: "put",
            data: data,
            url: cfg.server_url + cfg.api[api] + "/" + id
        };
        return storeApiHandle(callback, request);
    }

    // Delete
    function deleteApiData(api, id, target) {
        var request = {
            method: "delete",
            //data: data,
            url: cfg.server_url + cfg.api[api] + "/" + id
        };
        return deleteApiHandle(request, target);
    }

    /**
     * Api handle
     */
    // GET
    function getApiHandle(callback, request, cacheName) {
        var cached = null;
        if (cacheName) {
            cached = myCache.get(cacheName);
        }
        // Cached data
        if (enableCache && cached) {
            console.log('NEW CACHED: ' + cacheName);
            return callback(cached);
        } else {
            console.log('NEW NOOOOT CACHED: ' + cacheName);
            return $http(request).success(function(data) {
                myCache.put(cacheName, data);
                return callback(data);
            }).error(function(error) {
                handleError(error);

            });
        }

    }
    // POST/PUT
    function storeApiHandle(callback, request) {
        //$('#respone_container').html('Loading').show();
        return $http(request).success(function(data) {
            return callback(data);
        }).error(function(error) {
            handlePostError(error);

        });
    }

    // Delete
    function deleteApiHandle(request, target) {
        return $http(request).success(function(data) {
            if (target) {
                $(target).fadeOut();
            }
        }).error(function(data, error) {
            handleDeleteError(data, error);
        });
    }

    /**
     * Run command
     */
    function runCmd(cmd) {
        var request = $http({
            method: "get",
            url: cfg.server_url + cfg.api_url + "devices/" + cmd
        });
        return request.success(function(data) {
            console.log('SUCCESS:' + cfg.server_url + cfg.api_url + "devices/" + cmd);
        }).error(function(error) {
            handleError(error);

        });
    }
    
    /**
     * Handle errors
     */
    function handleError(error, message) {
        var msg = (message ? message : 'Error handling data from server');
        //$('#main_content').hide();
        $('#respone_container').show();
        $('#respone_container_inner').html('<div class="alert alert-danger alert-dismissable response-message"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button> <i class="icon-ban-circle"></i> ' + msg + '</div>');
        console.log('Error');
        return;


    }

    function handlePostError(error, message) {
        var msg = (message ? message : 'Error saving data');
        $('#respone_container').show();
        $('#respone_container_inner').html('<div class="alert alert-danger alert-dismissable response-message"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button> <i class="icon-ban-circle"></i> ' + msg + '</div>');
        console.log(msg);
        return;


    }

    function handleDeleteError(data, error, message) {
        var msg = (message ? message : 'Error deleting data from server');
        $('#respone_container').show();
        $('#respone_container_inner').html('<div class="alert alert-danger alert-dismissable response-message"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button> <i class="icon-ban-circle"></i> ' + msg + '</div>');
        console.log(data);
        return;


    }

    /**
     * Enable/Disable the cache
     */
    function setCache(enable) {
        enableCache = enable;
        return;
    }

});

/**
 * Caching the river...
 */
myAppFactory.factory('myCache', function($cacheFactory) {
    return $cacheFactory('myData');
});

// Get language file
myAppFactory.factory('langFactory', function($resource, cfg) {
    return {
        get: function(lang) {
            return $resource(cfg.lang_dir + lang + '.json', {}, {query: {
                    method: 'GET',
                    params: {},
                    isArray: false
                }});
        }
    };
});
// Translation factory - get language line by key
myAppFactory.factory('langTransFactory', function() {
    return {
        get: function(key, languages) {
            if (angular.isObject(languages)) {
                if (angular.isDefined(languages[key])) {
                    return languages[key] !== '' ? languages[key] : key;
                }
            }
            return key;
        }
    };
});
