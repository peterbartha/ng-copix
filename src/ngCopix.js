/**
 * ngCopix - Programmatically copy selected text to the users clipboard using AngularJS
 * @version 0.2.0 - built on 2015-09-11
 * @link https://github.com/peterbartha/ng-copix
 * @license MIT License, Copyright (c) 2015 Peter Bartha <mail@peterbartha.com>
 */
(function(window, angular, undefined) {
  'use strict';

  angular.module('ngCopixboard', [])
    .directive('copixRange', function () {
      return {
        scope: {
          copixRange: '&',
          copixAfterCopied: '&',
          copixFallback: '&'
        },
        restrict: 'A',
        link: function (scope, element, attrs) {
          element.bind('click', function($event) {
            if (attrs.copixRange === "") {  // if range is not specified
              scope.copixRange = function(scope) {
                return element[0].previousElementSibling.innerText || element[0].previousElementSibling.textContent;
              };
            }

            if (document.queryCommandSupported('copy')) {
              // Remove the selections
              window.getSelection().removeAllRanges();

              // Create a field with the value and select its contents
              var field = angular.element('<input />');
              field.attr("value", scope.$eval(scope.copixRange));
              element.parent()[0].insertBefore(field[0], element[0]);
              field[0].select();

              try {
                var successful = document.execCommand('copy');  // Execute the copy command

                if (successful && angular.isDefined(attrs.copixAfterCopied)) {
                  scope.$apply(scope.copixAfterCopied);
                }
              } catch(error) {
                scope.$apply(scope.copixFallback({
                  $event: $event,
                  copy: scope.$eval(scope.copixRange)
                }));
              }

              // Remove the selections and helper field
              window.getSelection().removeAllRanges();
              field.remove();
            } else {
              scope.$apply(scope.copixFallback({
                $event: $event,
                copy: scope.$eval(scope.copixRange)
              }));
            }
          });
        }
      };
    });
})(window, window.angular);
