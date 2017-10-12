/**
 * Amplitude support contributed by http://github.com/bateast2
 * License: MIT
 */
(function (angular) {
'use strict';

/**
* @ngdoc overview
* @name angulartics.amplitude
* Enables analytics support for Amplitude (https://amplitude.com)
*/
angular.module('angulartics.amplitude', ['angulartics'])

    /**
     * Loading Amplitude Snippet
     * @link https://amplitude.zendesk.com/hc/en-us/articles/115001361248-JavaScript-SDK-Installation#installation
     */
    .provider('$analytics_amplitude', [function $amplitudeProvider() {
        // Loading the Amplitude snippet
        (function(e, t) {
            var n = e.amplitude || { _q: [], _iq: {} };
            
            var r = t.createElement("script");
            r.type = "text/javascript"; r.async = true;
            r.src = "https://d24n15hnbwhuhn.cloudfront.net/libs/amplitude-3.7.0-min.gz.js";
            r.onload = function() {
                if (e.amplitude.runQueuedFunctions) {
                    e.amplitude.runQueuedFunctions()
                } else {
                    console.log("[Amplitude] Error: could not load SDK")
                }
            };
            var i = t.getElementsByTagName("script")[0]; i.parentNode.insertBefore(r, i);
            
            function s(e, t) {
                e.prototype[t] = function() {
                    this._q.push([t].concat(Array.prototype.slice.call(arguments, 0))); return this
                }
            }
            var o = function() { this._q = []; return this };
            var a = ["add", "append", "clearAll", "prepend", "set", "setOnce", "unset"];
            for (var u = 0; u < a.length; u++) { s(o, a[u]) }
            n.Identify = o; var c = function() {
                this._q = []; return this
            };
            var l = ["setProductId", "setQuantity", "setPrice", "setRevenueType", "setEventProperties"];
            for (var p = 0; p < l.length; p++) { s(c, l[p]) } n.Revenue = c;
            var d = ["init", "logEvent", "logRevenue", "setUserId", "setUserProperties", "setOptOut", "setVersionName", "setDomain", "setDeviceId", "setGlobalUserProperties", "identify", "clearUserProperties", "setGroup", "logRevenueV2", "regenerateDeviceId", "logEventWithTimestamp", "logEventWithGroups", "setSessionId"];
            function v(e) {
                function t(t) {
                    e[t] = function() {
                        e._q.push([t].concat(Array.prototype.slice.call(arguments, 0)))
                    }
                }
                for (var n = 0; n < d.length; n++) { t(d[n]) }
            }
            v(n);
            n.getInstance = function(e) {
                e = (!e || e.length === 0 ? "$default_instance" : e).toLowerCase();
                if (!n._iq.hasOwnProperty(e)) { n._iq[e] = { _q: [] }; v(n._iq[e]) } return n._iq[e]
            };
            e.amplitude = n;
        })(window, document);


        var provider = {
            $get: ['$window', function ($window) {
                return $window.amplitude;
            }],
            /**
             * Init Amplitude API.
             *
             * @param {string} apiKey
             * @param {string} userId optional
             * @param {string} options optional
             * @param {string} callbackFn(instance) optional
             *
             * @link https://amplitude.zendesk.com/hc/en-us/articles/115001361248#settings-configuration-options
             */
            init: function (apiKey, userId, options, callbackFn) {
                window.amplitude.getInstance().init(apiKey, userId, options, callbackFn);
            },
            /**
             * Init Amplitude API with a project. This is not necessary to call this function if you have only one project/app.
             *
             * @param {string} projectName IMPORTANT NOTE: Once you have chosen a name for that instance you cannot change it.
             * Choose your instance names wisely because every instance's data and settings are tied to its name, and you will
             * need to continue using that instance name for all future versions of your project to maintain data continuity
             * @param {string} apiKey
             * @param {string} userId optional
             * @param {string} options optional
             * @param {string} callbackFn(instance) optional
             *
             * @link https://amplitude.zendesk.com/hc/en-us/articles/115001361248#settings-configuration-options
             */
            initWithProject: function(projectName, apiKey, userId, options, callbackFn) {               
                window.amplitude.myProject = projectName;

                window.amplitude.getInstance().init(apiKey, userId, options, function (defaultInstance) {
                    // access Amplitude's defaultInstance deviceId after initialization:
                    var deviceId = defaultInstance.options.deviceId;
                    window.amplitude.getInstance(projectName).init(apiKey, userId, options, function(projectInstance) {
                        projectInstance.setDeviceId(deviceId);// transferring existing deviceId to new_project
                        if (callbackFn!=null)
                            callbackFn(projectInstance);
                    });
                });
            },
        };
        return provider;
    }])
    
    .config(['$analyticsProvider', function($analyticsProvider) {

        /**
         * Track Pageview in Amplitude
         *
         * @param {string} path value of Page dimension stored with hit e.g. '/home'
         * @param {object} $location
         *
         * @link https://amplitude.zendesk.com/hc/en-us/articles/115001361248-JavaScript-SDK-Installation#tracking-events
         */
        $analyticsProvider.registerPageTrack(function (path, $location) {
            window.amplitude.getInstance(window.amplitude.myProject).logEvent('pageView',
                {
                    url: path
                }
            );
        });

        /**
          * Track event in Amplitude
          * 
          * @param {string} eventName
          * @param {object} properties
          *
          * @link https://amplitude.zendesk.com/hc/en-us/articles/115001361248-JavaScript-SDK-Installation#tracking-events
          */
        $analyticsProvider.registerEventTrack(function (eventName, properties) {
            window.amplitude.getInstance(window.amplitude.myProject).logEvent(eventName, properties);
        });

        /**
         * Set userId in Amplitude
         * 
         * @param {string} username (null is allowed for anonymous user)
         *
         * @link https://amplitude.zendesk.com/hc/en-us/articles/115001361248-JavaScript-SDK-Installation#setting-custom-user-ids
         */
        $analyticsProvider.registerSetUsername(function (username) {
            window.amplitude.getInstance(window.amplitude.myProject).setUserId(username);
        });
        
        /**
          * Set user properties in Amplitude
          *
          * @param {object} properties 
          *
          * @link https://amplitude.zendesk.com/hc/en-us/articles/115001361248-JavaScript-SDK-Installation#setting-user-properties
          */
        $analyticsProvider.registerSetUserProperties(function (properties) {
            properties = properties || {};
            window.amplitude.getInstance(window.amplitude.myProject).setUserProperties(properties);
        });

        /**
          * Set user properties only once in Amplitude
          *
          * @param {object} properties 
          *
          * @link https://amplitude.zendesk.com/hc/en-us/articles/115001361248-JavaScript-SDK-Installation#setting-user-properties
          */
        $analyticsProvider.registerSetUserPropertiesOnce(function(properties) {
            properties = properties || {};
            var identify = new window.amplitude.Identify();            
            for (var property in properties) {
                    console.log(property,properties[property]);//TODO Del
                identify.setOnce(property, properties[property]);
            }
            window.amplitude.getInstance(window.amplitude.myProject).identify(identify);
        });

        /**
          * Set Opt Out
          * @param {boolean} value
          *
          * @link https://amplitude.zendesk.com/hc/en-us/articles/115001361248#opting-user-out-of-logging
          */
        $analyticsProvider.registerSetOptOut(function (value) {
            window.amplitude.getInstance(window.amplitude.myProject).setOptOut(value===true);
        });
        
    }]);
})(angular);