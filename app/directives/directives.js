/**
 * Application directives
 * @author Martin Vach
 */
myApp.directive('testDir', function() {
    return {
        restrict: "E",
        replace: true,
        template: '<p>This is a test directive</p>'
    };
});
/**
 * History go back
 */
myApp.directive('bbGoBack', ['$window', function($window) {
        return {
            restrict: 'A',
            link: function(scope, elem, attrs) {
                elem.bind('click', function() {
                    $window.history.back();
                });
            }
        };
    }]);

/**
 * Page loader directive
 */
myApp.directive('bbLoader', function() {
    return {
        restrict: "E",
        replace: true,
        template: '<div id="loading" ng-show="loading" ng-class="loading.status"><div class="loading-in">'
                + '<i class="fa fa-lg" ng-class="loading.icon"></i> <span ng-bind="loading.message"></span>'
                + '</div></div>'
    };
});


/**
 * Hide collapsed navi after click on mobile devices
 */
myApp.directive('collapseNavbar', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            $(element).click(function() {
                $("#nav_collapse").removeClass("in").addClass("collapse");
            });
        }
    };
});
/**
 * Go back
 */
myApp.directive('goBack', ['$window', function($window) {
        return {
            restrict: 'A',
            link: function(scope, elem, attrs) {
                elem.bind('click', function() {
                    $window.history.back();
                });
            }
        };
    }]);

/**
 * Knob directive
 */
myApp.directive('knob', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            $(element).val(25).knob();
        }
    };
});

myApp.directive('myknob', ['$timeout', 'dataFactory', function($timeout, dataFactory,dataService) {
        'use strict';

        return {
            restrict: 'A',
            replace: true,
            //template: '<input class="dial" data-width="100" data-height="100" value="{{ knobData }}"/>',
            scope: {
                knobId: '=',
                knobData: '=',
                knobOptions: '&'
            },
            link: function($scope, $element) {
                var knobInit = $scope.knobOptions() || {};

                knobInit.release = function(newValue) {
                    $timeout(function() {
                        $scope.knobData = newValue;
                        runCmdExact($scope.knobId, newValue);
                        $scope.$apply();
                    });
                };

                $scope.$watch('knobData', function(newValue, oldValue) {
                    if (newValue != oldValue) {
                        $($element).val(newValue).change();
                    }
                });

                $($element).val($scope.knobData).knob(knobInit);
            }
        };

        /**
         * Run command exact value
         */
        function runCmdExact(id, val) {
            var cmd = id + '/command/exact?level=' + val;
            dataFactory.runApiCmd(cmd).then(function(response) {}, function(error) {
                dataService.logError(error);
            });
            return;
        }
        ;
    }]);
/**
 * Bootstrap tooltip
 */
myApp.directive('tooltip', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            $(element).hover(function() {
                // on mouseenter
                $(element).tooltip('show');
            }, function() {
                // on mouseleave
                $(element).tooltip('hide');
            });
        }
    };
});
/**
 * Bootstrap Popover window
 */
myApp.directive('customPopover', function() {
    return {
        restrict: 'A',
        template: '<span>{{label}}</span>',
        link: function(scope, el, attrs) {
            scope.label = attrs.popoverLabel;
            $(el).popover({
                trigger: 'click',
                html: true,
                content: attrs.popoverHtml,
                placement: attrs.popoverPlacement
            });
        }
    };
});
/**
 * Confirm dialog after click
 */
myApp.directive('ngConfirmClick', [
    function() {
        return {
            priority: -1,
            restrict: 'A',
            link: function(scope, element, attrs) {
                element.bind('click', function(e) {
                    var message = attrs.ngConfirmClick;
                    if (message && !confirm(message)) {
                        e.stopImmediatePropagation();
                        e.preventDefault();
                    }
                });
            }
        };
    }
]);

/**
 * Upload file
 */
myApp.directive('fileModel', ['$parse', function($parse) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;

                element.bind('change', function() {
                    scope.$apply(function() {
                        modelSetter(scope, element[0].files[0]);
                    });
                });
            }
        };
    }]);

