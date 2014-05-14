angular.module('landmarkConnect.directives', [])

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

.directive('zoomable', function($ionicGesture) {
  console.log("zoom");
  return {
    restrict: 'A',
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
        $scope.$apply(function() {
          TweenMax.set($element, { scale: e.gesture.scale });
        });
      };
      var pinchGesture = $ionicGesture.on('pinch', handlePinch, $element);

      // resize after done
      var handleTransformEnd = function() {
        //resize zoomable container
        var newHeight, newWidth;
        var dimensions = $element[0].getBoundingClientRect();

        newHeight = Math.round(dimensions.height);
        newWidth = Math.round(dimensions.width);

        newHeight = Math.min(newHeight, maxHeight);
        newWidth = Math.min(newWidth, maxWidth);

        newHeight = Math.max(newHeight, minHeight);
        newWidth = Math.max(newWidth, minWidth);

        $scope.$apply(function() {
          TweenMax.set($element, { clearProps: 'scale' });
          $scope.containerStyle.height = newHeight + 'px';
          $scope.containerStyle.width = newWidth + 'px';
        })
      };
      $ionicGesture.on('transformend', handleTransformEnd, $element);

      // cleanup
      $scope.$on('$destroy', function() {
        $ionicGesture.off(handlePinch, 'pinch', $element);
        $ionicGesture.off(handleTransformEnd, 'transformend', $element);
      });
    }
  };
});
