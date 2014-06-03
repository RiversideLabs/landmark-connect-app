angular.module('landmarkConnect.directives', [])

.directive('headerShrink', function($document) {
  var fadeAmt;

  var shrink = function(header, content, amt, max) {
    amt = Math.min(44, amt);
    fadeAmt = 1 - amt / 44;
    ionic.requestAnimationFrame(function() {
      header.style[ionic.CSS.TRANSFORM] = 'translate3d(0, -' + amt + 'px, 0)';
      for(var i = 0, j = header.children.length; i < j; i++) {
        header.children[i].style.opacity = fadeAmt;
      }
    });
  };

  return {
    restrict: 'A',
    link: function($scope, $element, $attr) {
      var starty = $scope.$eval($attr.headerShrink) || 0;
      var shrinkAmt;

      var header = $document[0].body.querySelector('.bar-header');
      var headerHeight = header.offsetHeight;

      $element.bind('scroll', function(e) {
        if(e.detail.scrollTop > starty) {
          // Start shrinking
          shrinkAmt = headerHeight - Math.max(0, (starty + headerHeight) - e.detail.scrollTop);
          shrink(header, $element[0], shrinkAmt, headerHeight);
        } else {
          shrink(header, $element[0], 0, headerHeight);
        }
      });
    }
  }
})

// Added for fading status bar
.directive('fadeBar', function($timeout) {
  return {
    restrict: 'E',
    template: '<div class="fade-bar"></div>',
    replace: true,
    link: function($scope, $element, $attr) {
      $timeout(function() {
        $scope.$watch('sideMenuController.getOpenRatio()', function(ratio) {
          $element[0].style.opacity = Math.abs(ratio);
        });
      });
    }
  }
})

.directive('photo', function ($window) {
  return {
    link: function ($scope, $element, $attr) {
      var size = ($window.outerWidth / 4) - 2;
      $element.css('width', size + 'px');
    }
  };
})

.directive('videoLoader', function(){
  return function (scope, element, attrs){
    //console.log(scope.url);
    scope.$watch("url",  function(newValue, oldValue){ //watching the scope url value
      element[0].children[0].attributes[3].value=newValue; //set the URL on the src attribute
      element[0].load();
      element[0].play();
    }, true);
    scope.$watch("showFlag",  function(newValue, oldValue){
      if (!newValue) // if the showFlag is false, stop playing the video (modal was closed)
        element[0].pause();
    }, true);
  }
})

.directive('zoomable', function($timeout, $ionicGesture) {
  return {
    restrict: 'A',
    scope: true,
    link: function($scope, $element, $attrs) {
      var minHeight, minWidth, maxHeight, maxWidth;

      // set max/min size after image is loaded
      $element.bind('load', function() {
        var el = $element[0];
        minHeight = el.height;
        minWidth = el.width;
        maxHeight = el.naturalHeight;
        maxWidth = el.naturalWidth;
      });

      // pinch to scale
      var handlePinch = function(e) {
        e.gesture.srcEvent.preventDefault();
        $scope.$apply(function() {
          TweenMax.set($element, { scale: e.gesture.scale });
        });
      };
      handlePinch = ionic.animationFrameThrottle(handlePinch);
      var pinchGesture = $ionicGesture.on('pinch', handlePinch, $element);

      // resize after done
      var handleTransformEnd = function() {
        //resize zoomable container
        var newHeight, newWidth;
        var dimensions = $element[0].getBoundingClientRect();

        newHeight = Math.round(dimensions.height);
        newWidth = Math.round(dimensions.width);

        // upper bounds (dictated by naturalHeight and naturalWidth of image)
        newHeight = Math.min(newHeight, maxHeight);
        newWidth = Math.min(newWidth, maxWidth);

        // lower bounds (dictacted by screen)
        newHeight = Math.max(newHeight, minHeight);
        newWidth = Math.max(newWidth, minWidth);

        $scope.$apply(function() {
          TweenMax.set($element, { clearProps: 'scale' });
          $scope.containerStyle.height = newHeight + 'px';
          $scope.containerStyle.width = newWidth + 'px';
        });
      };
      var resizeGesture = $ionicGesture.on('transformend', handleTransformEnd, $element);

      // cleanup
      $scope.$on('$destroy', function() {
        $ionicGesture.off(pinchGesture, 'pinch', $element);
        $ionicGesture.off(resizeGesture, 'transformend', $element);
      });
    }
  };
});
