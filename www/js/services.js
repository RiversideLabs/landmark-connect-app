angular.module('landmarkConnect.services', [])

// Shared data from settings needed by different controllers
.service('SettingsService', function() {
  var _variables = {};

  return {
    get: function(varname) {
      return (typeof _variables[varname] !== 'undefined') ? _variables[varname] : false;
    },
    set: function(varname, value) {
      _variables[varname] = value;
    }
  };
})

.factory('LocationsService', [ '$http', function($http) {
  var locations = [];
  $http.get('http://landmarkjs-demo.herokuapp.com/api/location/list').success(function(data){
    locations = data.locations;
  });

  return {
    all: function() {
      return locations;
    },
    getLocation: function(locationId) {
      // Simple index lookup
      for(var i=0, l=locations.length; i < l; i++) {
        if(locations[i]._id == locationId) {
          return locations[i];
        }
      }
      //return locations[locationId];
    },
    getTour: function(locationId, tourId) {
      // Simple index lookup
      return locations[locationId].tours[tourId];
    },
    getImage: function(locationId, imageId) {
      // Simple index lookup
      found_location = _.find(locations, function(location) {
        return location._id == locationId;
      });

      found_image = _.find(found_location.images, function(image) {
        return image._id == imageId;
      });

      return found_image;
    }
  }

}])

.factory('Geolocation', function($rootScope, $ionicLoading) {
    return {
        /**
         * Plugin Get from https://github.com/xelita/angular-cordova-geolocation
         *
         * Check the geolocation plugin availability.
         * @returns {boolean}
         */
        checkGeolocationAvailability: function() {
            //$log.debug('starter.services.Geolocation.checkGeolocationAvailability.');
            if (!navigator.geolocation) {
                //$log.warn('Geolocation API is not available.');
                return false;
            }
            return true;
        },
        /**
         * Returns the device's current position to the geolocationSuccess callback with a Position object as the parameter.
         * For more information: https://github.com/apache/cordova-plugin-geolocation/blob/master/doc/index.md#navigatorgeolocationgetcurrentposition
         */
        getCurrentPosition: function(successCallback, errorCallback, options) {
            //$log.debug('starter.services.Geolocation.getCurrentPosition.');
            // Checking API availability
            if (!this.checkGeolocationAvailability()) {
                return;
            }

            $ionicLoading.show({
              content: '<i class=\'ion-ios7-reloading\'></i><br/>Getting current location...',
              showBackdrop: false
            });

            // API call
            navigator.geolocation.getCurrentPosition(
                    function(position) {
                        $rootScope.$apply(successCallback(position));
                    },
                    function(error) {
                        $rootScope.$apply(errorCallback(error));
                    },
                    options
                    );
        },
        /**
         * Returns the device's current position when a change in position is detected.
         * For more information: https://github.com/apache/cordova-plugin-geolocation/blob/master/doc/index.md#navigatorgeolocationwatchposition
         */
        watchPosition: function(successCallback, errorCallback, options) {
            //$log.debug('cordovaGeolocationService.watchPosition.');

            // Checking API availability
            if (!this.checkGeolocationAvailability()) {
                return;
            }


            // API call
            return navigator.geolocation.watchPosition(
                    function(position) {
                        $rootScope.$apply(successCallback(position));
                    },
                    function(error) {
                        $rootScope.$apply(errorCallback(error));
                    },
                    options
                    );
        },
        /**
         * Stop watching for changes to the device's location referenced by the watchID parameter.
         * For more information: https://github.com/apache/cordova-plugin-geolocation/blob/master/doc/index.md#navigatorgeolocationclearwatch
         */
        clearWatch: function(watchID) {
            //$log.debug('cordovaGeolocationService.clearWatch.');

            // Checking API availability
            if (!this.checkGeolocationAvailability()) {
                return;
            }

            // API call
            navigator.geolocation.clearWatch(watchID);
        }
    };
})



.service('geomath', function() {
    var self = this;
    var R = 6378137; // earth's radius in meters
    this.rad = function(x) {
      return x * Math.PI / 180;
    };
    /**
     * calculate distance
     * @param geo1
     * @param geo2
     * @returns {Number}
     */
    this.calculateDistance = function(geo1, geo2) {
      self.convertFromGoogle([geo1, geo2]);
      var dLat = self.toRad(geo2.latitude - geo1.latitude);
      var dLon = self.toRad(geo2.longitude - geo1.longitude);
      var lat1 = self.toRad(geo2.latitude);
      var lat2 = self.toRad(geo1.latitude);

      var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      var m = parseInt(R * c);
      var mi = m * 0.000621371192;
      return parseFloat(Math.round(mi * 100) / 100);
    }

    /**
     * convert from google lat/long object
     */
    this.convertFromGoogle = function(llobjs) {
       llobjs.forEach( function(llo) {
           if (typeof(llo.lat) != "undefined" && typeof(llo.lng) != "undefined") {
               llo.latitude = llo.lat();
               llo.longitude = llo.lng();
           }
       });
    }

    /**
     * math util to convert lat/long to radians
     * @param value
     * @returns {number}
     */
    this.toRad = function(value) {
        return value * Math.PI / 180;
    }

    /**
     * math util to convert radians to latlong/degrees
     * @param value
     * @returns {number}
     */
    this.toDeg = function(value) {
        return value * 180 / Math.PI;
    }

})

.factory('AudioService', function() {
  // Audio player
  //
  var my_media = null;
  var mediaTimer = null;

  return {
    // Play audio
    //
    playAudio: function(src) {
      // Create Media object from src
      my_media = new Media(src, this.onSuccess, this.onError);

      // Play audio
      my_media.play();

      // Update my_media position every second
      if (mediaTimer == null) {
        mediaTimer = setInterval(function() {
          // get my_media position
          my_media.getCurrentPosition(
            // success callback
            function(position) {
              if (position > -1) {
                this.setAudioPosition((position) + " sec");
              }
            },
            // error callback
            function(e) {
              console.log("Error getting pos=" + e);
              this.setAudioPosition("Error: " + e);
            }
          );
        }, 1000);
      }
    },
    // Pause audio
    //
    pauseAudio: function() {
      if (my_media) {
        my_media.pause();
      }
    },

    // Stop audio
    //
    stopAudio: function() {
      if (my_media) {
        my_media.stop();
      }
      clearInterval(mediaTimer);
      mediaTimer = null;
    },

    // onSuccess Callback
    //
    onSuccess: function() {
      console.log("playAudio():Audio Success");
    },

    // onError Callback
    //
    onError: function(error) {
      alert('code: '    + error.code    + '\n' + 'message: ' + error.message + '\n');
    },

    // Set audio position
    //
    setAudioPosition: function(position) {
      document.getElementById('audio_position').innerHTML = position;
    }
  }


  return {
    // all: function() {
    //   return locations;
    // },
    // getLocation: function(locationId) {
    //   // Simple index lookup
    //   for(var i=0, l=locations.length; i < l; i++) {
    //     if(locations[i].id == locationId) {
    //       return locations[i];
    //     }
    //   }
    //   //return locations[locationId];
    // },
    // getTour: function(locationId, tourId) {
    //   // Simple index lookup
    //   return locations[locationId].tours[tourId];
    // },
    // getImage: function(locationId, imageId) {
    //   // Simple index lookup
    //   return locations[locationId].images[imageId];
    // }
  }
});
