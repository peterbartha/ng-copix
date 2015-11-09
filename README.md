ngCopix - Copy to clipboard using AngularJS (without flash)
======

An AngularJS directive that uses **native execCommand** and updates the user's clipboard without any kind of Flash. Only the latest browsers support [Selection API](https://developer.mozilla.org/en-US/docs/Web/API/Selection) and [Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/ClipboardEvent).


## How to get it?

#### Manual Download from GitHub
Download the compressed package from [here](https://github.com/peterbartha/ng-copix/releases).

#### Bower
```
bower install ng-copix
```

## Support
- IE 10+
- Chrome 43+
- Firefox 41+
- Opera 29+

## Usage
1. Add **ng-copix-min.js** to your html file (index.html)
  ```html
  <script src="bower_components/angular/angular.min.js"></script>
  ```

2. Set `ngCopixboard` as a dependency in your module(s)
  ```javascript
  var sampleApp = angular.module('sampleApp', ['ngCopixboard'])
  ```

3. Add `copix-range` directive to the wanted element, example:
  ```html
  <button copix-range="valueToCopy">Copy</button>
  ```
  or
  ```html
  <a href="" copix-range="valueToCopy">Copy</a>
  ```

4. You can optionally provide a fallback function that gets called if query commands are unavailable:
  ```html
  <a href="" copix-range="valueToCopy" copix-fallback="fallback(copy)">Copy</a>
  ```
  If the fallback function is defined to accept an argument named `copy`, that argument will be populated with the text to copy. For example:
  ```javascript
    sampleApp.controller('sampleController', function ($scope) {
      //...
      $scope.fallback = function(copy) {
        window.prompt('Press ctrl+c to copy the text below.', copy);
      };
    });
  ```

5. You can also optionally provide a function that gets called if query commands are working and the copy was successful. For example a basic success message:
  ```html
  <a href="" copix-range="valueToCopy" copix-after-copied="showFriendlyMessage()">Copy</a>
  ```
  Controller:
  ```javascript
    sampleApp.controller('sampleController', function ($scope) {
      //...
      $scope.showFriendlyMessage = function() {
        alert('Successfully copied to the clipboard!');
      };
    });
  ```

## Examples
You can check out a live example here: [Examples](https://cdn.rawgit.com/peterbartha/ng-copix/master/example/index.html)
