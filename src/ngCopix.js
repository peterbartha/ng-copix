/**
 * ngCopix - Programmatically cut and copy selected text to the users clipboard
 * @version 0.1.0 - built on 2015-08-27
 * @link https://github.com/peterbartha/ng-copix
 * @license MIT License, Copyright (c) 2015 Peter Bartha <mail@peterbartha.com>
 */
(function(window, angular, undefined) {
  'use strict';

  angular.module('ngCopixboard', []).
    provider('ngCopix', function() {
      var self = this;
      this.zeroClipboardPath = '//cdnjs.cloudflare.com/ajax/libs/zeroclipboard/2.1.6/ZeroClipboard.swf';
      this.zeroClipboardContainerId = 'global-zeroclipboard-html-bridge';

      return {
        setZeroClipboardPath: function(newPath) {
          self.zeroClipboardPath = newPath;
        },
        setZeroClipboardConfig: function(config) {
          self.zeroClipboardConfig = config;
        },
        setZeroClipboardContainerId: function(id) {
          self.zeroClipboardContainerId = id;
        },
        $get: function() {
          return {
            zeroClipboardPath: self.zeroClipboardPath,
            zeroClipboardConfig: self.zeroClipboardConfig,
            zeroClipboardContainerId: self.zeroClipboardContainerId
          };
        }
      };
    }).
    run(['ngCopix', function(ngCopix) {
      var config = {
        swfPath: ngCopix.zeroClipboardPath,
        trustedDomains: ["*"],
        allowScriptAccess: "always",
        containerId: ngCopix.zeroClipboardContainerId,
        forceHandCursor: true
      };
      ZeroClipboard.config(angular.extend(config, ngCopix.config || {}));
    }]).
    directive('copixRange', ['ngCopix', function (ngCopix) {
      var execCommandSupported;

      function isBoolean(value) {
        return typeof value == 'boolean';
      }

      return {
        scope: {
          copixRange: '&',
          copixAfterCopied: '&',
          copixFallback: '&',
          copixUseExecCommand: '=',
          copixUseFlash: '='
        },
        restrict: 'A',
        link: function (scope, element, attrs) {
          // Preset default values if its not (correctly) provided
          if (!isBoolean(scope.copixUseExecCommand)) scope.copixUseExecCommand = true;
          if (!isBoolean(scope.copixUseFlash)) scope.copixUseFlash = true;

          var client;
          var isFlashUnusable = ZeroClipboard.isFlashUnusable();

          if (scope.copixUseFlash && !isFlashUnusable && !execCommandSupported) {
            // Create the ZeroClipboard's client object
            client = new ZeroClipboard(element);

            client.on('ready', function(e) {
              client.on('beforecopy', function(event) {
                if(document.queryCommandSupported('copy') && scope.copixUseExecCommand) {
                  // Remove the created ZeroClipboard's client
                  client.destroy();
                  client = null;

                  execCommandSupported = true;    // Use execCommand only

                  // Remove flash object from HTML source
                  angular.element(document.querySelector("#"+ngCopix.zeroClipboardContainerId)).remove();

                  // Use execCommand instead
                  element[0].click();
                  element[0].blur();
                }
              });

              client.on('copy', function (event) {
                var clipboard = event.clipboardData;
                clipboard.setData(attrs.copixRangeMimeType || 'text/plain', scope.$eval(scope.copixRange));
              });

              client.on('aftercopy', function(event) {
                if (angular.isDefined(attrs.copixAfterCopied)) {
                  scope.$apply(scope.copixAfterCopied);
                }
                element[0].blur();
              });

              scope.$on('$destroy', function() {
                client.destroy();
              });
            });
          }

          element.bind('click', function($event) {
            if (attrs.copixRange === "") {
              scope.copixRange = function(scope) {
                return element[0].previousElementSibling.innerText || element[0].previousElementSibling.textContent;
              };
            }

            if (document.queryCommandSupported('copy') && scope.copixUseExecCommand) {
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
                  $event: event,
                  copy: scope.$eval(scope.copixRange)
                }));
              }

              // Remove the selections and helper field
              window.getSelection().removeAllRanges();
              field.remove();

              return;
            }

            if (isFlashUnusable && !scope.copixUseExecCommand) {
              scope.$apply(scope.copixFallback({
                $event: event,
                copy: scope.$eval(scope.copixRange)
              }));
            }
          });
        }
      };
    }])
  ;
})(window, window.angular);
