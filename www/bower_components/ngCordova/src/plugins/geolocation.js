angular.module('ngCordova.plugins.geolocation', [])

.factory('$cordovaGeolocation', ['$rootScope', function($rootScope) {

  return {
    checkGeolocationAvailability: function () {
        if (!navigator.geolocation) {
            return false;
        }
        return true;
    },
    getCurrentPosition: function(successCallback, errorCallback, options) {
      // Checking API availability
      if (!this.checkGeolocationAvailability()) {
          return;
      }

      navigator.geolocation.getCurrentPosition(
        function (position) {
            $rootScope.$apply(successCallback(position));
        },
        function (error) {
            $rootScope.$apply(errorCallback(error));
        },
        options
      );
    },
    watchPosition: function (successCallback, errorCallback, options) {
        // Checking API availability
        if (!this.checkGeolocationAvailability()) {
            return;
        }

        // API call
        return navigator.geolocation.watchPosition(
            function (position) {
                $rootScope.$apply(successCallback(position));
            },
            function (error) {
                $rootScope.$apply(errorCallback(error));
            },
            options
        );
    },
    clearWatch: function (watchID) {
      // Checking API availability
      if (!this.checkGeolocationAvailability()) {
          return;
      }

      // API call
      navigator.geolocation.clearWatch(watchID);
    }
  }
}]);
