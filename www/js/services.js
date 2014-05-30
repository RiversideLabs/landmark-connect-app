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
  $http.get('http://localhost:3000/api/location/list').success(function(data){
    locations = data.locations;
  });
  
  return {
    all: function() {
      return locations;
    },
    getLocation: function(locationId) {
      // Simple index lookup
      for(var i=0, l=locations.length; i < l; i++) {
        if(locations[i].id == locationId) {
          return locations[i];
        }
      }
      //return locations[locationId];
    },
    getTour: function(locationId, tourId) {
      // Simple index lookup
      return locations[locationId].tours[tourId];
    },
    getPhoto: function(locationId, photoId) {
      // Simple index lookup
      return locations[locationId].photos[photoId];
    }
  }
  
}])

.factory('LocationsServiceBak', function($q) {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var locations = [
    {
      "id": 0,
      "name":"Mission Inn",
      "createdAt":1084579200,
      "lastModified":1084579200,
      "contact": {
        "phone":"5551231234",
        "formattedPhone":"(555) 123-1234"
      },
      "location": {
        "address": "3567 Main St",
        "city": "Riverside",
        "state": "CA",
        "postalCode": "92501",
        "cc": "US",
        "country": "United States",
        "lat": 33.983373,
        "lng": -117.373004,
        "formattedAddress": "3567 Main St, Riverside, CA 92501"
      },
      "description": "3567 Main St, Riverside, CA. Coworking and cat gifs. Memberships and day rates. Vestibulum aliquet quam sem, non hendrerit lorem commodo id. Suspendisse sit amet purus posuere, volutpat nibh quis, interdum orci. Aenean rhoncus diam sit amet justo varius tempus. In posuere, odio ac fringilla vehicula, sem felis cursus dui, quis sodales lorem ligula ut felis. Praesent vel metus vel metus mollis pretium. Aenean a sagittis odio. Maecenas sit amet dignissim nibh, vitae convallis augue. Praesent rhoncus ac velit sit amet sagittis. Ut nec elit neque. Nunc tempus suscipit interdum. Fusce commodo, risus ut pharetra gravida, turpis purus facilisis neque, molestie condimentum felis purus eu nulla. Fusce cursus vehicula lectus a cursus. Curabitur luctus euismod risus vitae congue. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec eleifend turpis metus, ut malesuada libero scelerisque vel. Duis id pellentesque nibh, non mollis odio. Cras tristique sit amet elit vel lacinia.",
      "url": "http://riverside.io.com",
      "photos": [
        {
          "id": 0,
          "url": "https://farm5.staticflickr.com/4107/5051154959_02c5db5427_b.jpg",
          "thumbnail": "https://farm5.staticflickr.com/4107/5051154959_02c5db5427_m.jpg",
          "caption": "Ut semper ligula ornare semper commodo. Mauris ultrices pretium dignissim. Cras ac dictum dolor, sit amet lacinia orci. Aliquam imperdiet accumsan lorem. Etiam turpis odio, sollicitudin sed libero in, condimentum fringilla libero. Curabitur ornare arcu eu enim pellentesque lacinia. Maecenas et porttitor est. Vivamus convallis blandit mi, et tristique felis cursus sit amet. Nullam adipiscing urna sit amet enim mattis, ut laoreet ligula varius. Sed pulvinar mi dignissim tortor accumsan aliquet at non quam. Curabitur condimentum eros at egestas venenatis. Suspendisse et arcu sed nibh ultricies gravida vitae at mauris. Fusce diam tellus, sagittis quis sapien et, pellentesque consectetur arcu. Integer viverra a dui congue ullamcorper. Curabitur accumsan velit in risus dapibus semper. Phasellus eu pretium nisi."
        }, {
          "id": 1,
          "url": "https://farm2.staticflickr.com/1032/4726062565_5cb690d2ff_b.jpg",
          "thumbnail": "https://farm2.staticflickr.com/1032/4726062565_5cb690d2ff_m.jpg",
          "caption": "Ut semper ligula ornare semper commodo. Mauris ultrices pretium dignissim. Cras ac dictum dolor, sit amet lacinia orci. Aliquam imperdiet accumsan lorem. Etiam turpis odio, sollicitudin sed libero in, condimentum fringilla libero. Curabitur ornare arcu eu enim pellentesque lacinia. Maecenas et porttitor est. Vivamus convallis blandit mi, et tristique felis cursus sit amet. Nullam adipiscing urna sit amet enim mattis, ut laoreet ligula varius. Sed pulvinar mi dignissim tortor accumsan aliquet at non quam. Curabitur condimentum eros at egestas venenatis. Suspendisse et arcu sed nibh ultricies gravida vitae at mauris. Fusce diam tellus, sagittis quis sapien et, pellentesque consectetur arcu. Integer viverra a dui congue ullamcorper. Curabitur accumsan velit in risus dapibus semper. Phasellus eu pretium nisi."
        },{
          "id": 2,
          "url": "https://farm3.staticflickr.com/2559/3756896755_1ee6fd67ee_b.jpg",
          "thumbnail": "https://farm3.staticflickr.com/2559/3756896755_1ee6fd67ee_m.jpg",
          "caption": "Ut semper ligula ornare semper commodo. Mauris ultrices pretium dignissim. Cras ac dictum dolor, sit amet lacinia orci. Aliquam imperdiet accumsan lorem. Etiam turpis odio, sollicitudin sed libero in, condimentum fringilla libero. Curabitur ornare arcu eu enim pellentesque lacinia. Maecenas et porttitor est. Vivamus convallis blandit mi, et tristique felis cursus sit amet. Nullam adipiscing urna sit amet enim mattis, ut laoreet ligula varius. Sed pulvinar mi dignissim tortor accumsan aliquet at non quam. Curabitur condimentum eros at egestas venenatis. Suspendisse et arcu sed nibh ultricies gravida vitae at mauris. Fusce diam tellus, sagittis quis sapien et, pellentesque consectetur arcu. Integer viverra a dui congue ullamcorper. Curabitur accumsan velit in risus dapibus semper. Phasellus eu pretium nisi."
        },{
          "id": 3,
          "url": "https://farm4.staticflickr.com/3096/3154462963_38b72fab82_b.jpg",
          "thumbnail": "https://farm4.staticflickr.com/3096/3154462963_38b72fab82_m.jpg",
          "caption": "Ut semper ligula ornare semper commodo. Mauris ultrices pretium dignissim. Cras ac dictum dolor, sit amet lacinia orci. Aliquam imperdiet accumsan lorem. Etiam turpis odio, sollicitudin sed libero in, condimentum fringilla libero. Curabitur ornare arcu eu enim pellentesque lacinia. Maecenas et porttitor est. Vivamus convallis blandit mi, et tristique felis cursus sit amet. Nullam adipiscing urna sit amet enim mattis, ut laoreet ligula varius. Sed pulvinar mi dignissim tortor accumsan aliquet at non quam. Curabitur condimentum eros at egestas venenatis. Suspendisse et arcu sed nibh ultricies gravida vitae at mauris. Fusce diam tellus, sagittis quis sapien et, pellentesque consectetur arcu. Integer viverra a dui congue ullamcorper. Curabitur accumsan velit in risus dapibus semper. Phasellus eu pretium nisi."
        },{
          "id": 4,
          "url": "https://farm1.staticflickr.com/21/91476141_a534776dd2_b.jpg",
          "thumbnail": "https://farm1.staticflickr.com/21/91476141_a534776dd2_m.jpg",
          "caption": "Ut semper ligula ornare semper commodo. Mauris ultrices pretium dignissim. Cras ac dictum dolor, sit amet lacinia orci. Aliquam imperdiet accumsan lorem. Etiam turpis odio, sollicitudin sed libero in, condimentum fringilla libero. Curabitur ornare arcu eu enim pellentesque lacinia. Maecenas et porttitor est. Vivamus convallis blandit mi, et tristique felis cursus sit amet. Nullam adipiscing urna sit amet enim mattis, ut laoreet ligula varius. Sed pulvinar mi dignissim tortor accumsan aliquet at non quam. Curabitur condimentum eros at egestas venenatis. Suspendisse et arcu sed nibh ultricies gravida vitae at mauris. Fusce diam tellus, sagittis quis sapien et, pellentesque consectetur arcu. Integer viverra a dui congue ullamcorper. Curabitur accumsan velit in risus dapibus semper. Phasellus eu pretium nisi."
        },{
          "id": 5,
          "url": "https://farm6.staticflickr.com/5185/5677377713_cc593f7a98_b.jpg",
          "thumbnail": "https://farm6.staticflickr.com/5185/5677377713_cc593f7a98_m.jpg",
          "caption": "Ut semper ligula ornare semper commodo. Mauris ultrices pretium dignissim. Cras ac dictum dolor, sit amet lacinia orci. Aliquam imperdiet accumsan lorem. Etiam turpis odio, sollicitudin sed libero in, condimentum fringilla libero. Curabitur ornare arcu eu enim pellentesque lacinia. Maecenas et porttitor est. Vivamus convallis blandit mi, et tristique felis cursus sit amet. Nullam adipiscing urna sit amet enim mattis, ut laoreet ligula varius. Sed pulvinar mi dignissim tortor accumsan aliquet at non quam. Curabitur condimentum eros at egestas venenatis. Suspendisse et arcu sed nibh ultricies gravida vitae at mauris. Fusce diam tellus, sagittis quis sapien et, pellentesque consectetur arcu. Integer viverra a dui congue ullamcorper. Curabitur accumsan velit in risus dapibus semper. Phasellus eu pretium nisi."
        },{
          "id": 6,
          "url": "https://farm7.staticflickr.com/6136/6042826830_af7e4f9f07_b.jpg",
          "thumbnail": "https://farm7.staticflickr.com/6136/6042826830_af7e4f9f07_m.jpg",
          "caption": "Ut semper ligula ornare semper commodo. Mauris ultrices pretium dignissim. Cras ac dictum dolor, sit amet lacinia orci. Aliquam imperdiet accumsan lorem. Etiam turpis odio, sollicitudin sed libero in, condimentum fringilla libero. Curabitur ornare arcu eu enim pellentesque lacinia. Maecenas et porttitor est. Vivamus convallis blandit mi, et tristique felis cursus sit amet. Nullam adipiscing urna sit amet enim mattis, ut laoreet ligula varius. Sed pulvinar mi dignissim tortor accumsan aliquet at non quam. Curabitur condimentum eros at egestas venenatis. Suspendisse et arcu sed nibh ultricies gravida vitae at mauris. Fusce diam tellus, sagittis quis sapien et, pellentesque consectetur arcu. Integer viverra a dui congue ullamcorper. Curabitur accumsan velit in risus dapibus semper. Phasellus eu pretium nisi."
        }
      ],
      "tours": [
        {
          "id": 0,
          "type": "video",
          "title": "Video Tour",
          "url": "http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4",
          "length": "6:11"
        },{
          "id": 1,
          "type": "audio",
          "title": "Audio Tour",
          "url": "http://landmark-connect.s3.amazonaws.com/test.mp3",
          "length": "1:07"
        },{
          "id": 2,
          "type": "audio",
          "title": "Another Audio Tour",
          "url": "http://landmark-connect.s3.amazonaws.com/test.mp3",
          "length": "1:07"
        }
      ]
    },
    {"id": 1,"name":"Metropolitan Museum","createdAt":1084579200,"lastModified":1084579200,"contact":{"phone":"5551231234","formattedPhone":"(555) 123-1234","twitter":"riversideio"},"location":{"address":"3567 Main St","lat":33.982084,"lng":-117.372593,"postalCode":"92501","cc":"US","city":"Riverside","state":"CA","country":"United States","formattedAddress":"3567 Main St, Riverside, CA 92501"},"description":"3567 Main St, Riverside, CA. Coworking and cat gifs. Memberships and day rates. Vestibulum aliquet quam sem, non hendrerit lorem commodo id. Suspendisse sit amet purus posuere, volutpat nibh quis, interdum orci. Aenean rhoncus diam sit amet justo varius tempus. In posuere, odio ac fringilla vehicula, sem felis cursus dui, quis sodales lorem ligula ut felis. Praesent vel metus vel metus mollis pretium. Aenean a sagittis odio. Maecenas sit amet dignissim nibh, vitae convallis augue. Praesent rhoncus ac velit sit amet sagittis. Ut nec elit neque. Nunc tempus suscipit interdum. Fusce commodo, risus ut pharetra gravida, turpis purus facilisis neque, molestie condimentum felis purus eu nulla. Fusce cursus vehicula lectus a cursus. Curabitur luctus euismod risus vitae congue. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec eleifend turpis metus, ut malesuada libero scelerisque vel. Duis id pellentesque nibh, non mollis odio. Cras tristique sit amet elit vel lacinia.","url":"http://riverside.io.com","photos":[{"id":1,"url":"http://lorempixel.com/960/720/sports","width":960,"height":720},{"id":2,"url":"http://lorempixel.com/960/720/nature","width":960,"height":720},{"id":3,"url":"http://lorempixel.com/960/720/nature","width":960,"height":720},{"id":4,"url":"http://lorempixel.com/960/720/nature","width":960,"height":720}],"tours":[{"id":5,"url":"http://lorempixel.com/960/720/nature","length":960433}]},
    {"id": 2,"name":"Art Museum","createdAt":1084579200,"lastModified":1084579200,"contact":{"phone":"5551231234","formattedPhone":"(555) 123-1234","twitter":"riversideio"},"location":{"address":"3567 Main St","lat":33.981805,"lng":-117.370465,"postalCode":"92501","cc":"US","city":"Riverside","state":"CA","country":"United States","formattedAddress":"3567 Main St, Riverside, CA 92501"},"description":"3567 Main St, Riverside, CA. Coworking and cat gifs. Memberships and day rates. Vestibulum aliquet quam sem, non hendrerit lorem commodo id. Suspendisse sit amet purus posuere, volutpat nibh quis, interdum orci. Aenean rhoncus diam sit amet justo varius tempus. In posuere, odio ac fringilla vehicula, sem felis cursus dui, quis sodales lorem ligula ut felis. Praesent vel metus vel metus mollis pretium. Aenean a sagittis odio. Maecenas sit amet dignissim nibh, vitae convallis augue. Praesent rhoncus ac velit sit amet sagittis. Ut nec elit neque. Nunc tempus suscipit interdum. Fusce commodo, risus ut pharetra gravida, turpis purus facilisis neque, molestie condimentum felis purus eu nulla. Fusce cursus vehicula lectus a cursus. Curabitur luctus euismod risus vitae congue. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec eleifend turpis metus, ut malesuada libero scelerisque vel. Duis id pellentesque nibh, non mollis odio. Cras tristique sit amet elit vel lacinia.","url":"http://riverside.io.com","photos":[{"id":1,"url":"http://lorempixel.com/960/720/city","width":960,"height":720},{"id":2,"url":"http://lorempixel.com/960/720/nature","width":960,"height":720},{"id":3,"url":"http://lorempixel.com/960/720/nature","width":960,"height":720},{"id":4,"url":"http://lorempixel.com/960/720/nature","width":960,"height":720}],"tours":[{"id":5,"url":"http://lorempixel.com/960/720/nature","length":960433}]},
    {"id": 3,"name":"City Hall","createdAt":1084579200,"lastModified":1084579200,"contact":{"phone":"5551231234","formattedPhone":"(555) 123-1234","twitter":"riversideio"},"location":{"address":"3567 Main St","lat":33.980563,"lng":-117.375656,"postalCode":"92501","cc":"US","city":"Riverside","state":"CA","country":"United States","formattedAddress":"3567 Main St, Riverside, CA 92501"},"description":"3567 Main St, Riverside, CA. Coworking and cat gifs. Memberships and day rates. Vestibulum aliquet quam sem, non hendrerit lorem commodo id. Suspendisse sit amet purus posuere, volutpat nibh quis, interdum orci. Aenean rhoncus diam sit amet justo varius tempus. In posuere, odio ac fringilla vehicula, sem felis cursus dui, quis sodales lorem ligula ut felis. Praesent vel metus vel metus mollis pretium. Aenean a sagittis odio. Maecenas sit amet dignissim nibh, vitae convallis augue. Praesent rhoncus ac velit sit amet sagittis. Ut nec elit neque. Nunc tempus suscipit interdum. Fusce commodo, risus ut pharetra gravida, turpis purus facilisis neque, molestie condimentum felis purus eu nulla. Fusce cursus vehicula lectus a cursus. Curabitur luctus euismod risus vitae congue. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec eleifend turpis metus, ut malesuada libero scelerisque vel. Duis id pellentesque nibh, non mollis odio. Cras tristique sit amet elit vel lacinia.","url":"http://riverside.io.com","photos":[{"id":1,"url":"http://fillmurray.com/960/720","width":960,"height":720},{"id":2,"url":"http://lorempixel.com/960/720/nature","width":960,"height":720},{"id":3,"url":"http://lorempixel.com/960/720/nature","width":960,"height":720},{"id":4,"url":"http://lorempixel.com/960/720/nature","width":960,"height":720}],"tours":[{"id":5,"url":"http://lorempixel.com/960/720/nature","length":960433}]},
    {"id": 4,"name":"Riverside.io Coworking","createdAt":1084579200,"lastModified":1084579200,"contact":{"phone":"5551231234","formattedPhone":"(555) 123-1234","twitter":"riversideio"},"location":{"address":"3567 Main St","lat":33.984361492526084,"lng":-117.37330426184035,"postalCode":"92501","cc":"US","city":"Riverside","state":"CA","country":"United States","formattedAddress":"3567 Main St, Riverside, CA 92501"},"description":"3567 Main St, Riverside, CA. Coworking and cat gifs. Memberships and day rates. Vestibulum aliquet quam sem, non hendrerit lorem commodo id. Suspendisse sit amet purus posuere, volutpat nibh quis, interdum orci. Aenean rhoncus diam sit amet justo varius tempus. In posuere, odio ac fringilla vehicula, sem felis cursus dui, quis sodales lorem ligula ut felis. Praesent vel metus vel metus mollis pretium. Aenean a sagittis odio. Maecenas sit amet dignissim nibh, vitae convallis augue. Praesent rhoncus ac velit sit amet sagittis. Ut nec elit neque. Nunc tempus suscipit interdum. Fusce commodo, risus ut pharetra gravida, turpis purus facilisis neque, molestie condimentum felis purus eu nulla. Fusce cursus vehicula lectus a cursus. Curabitur luctus euismod risus vitae congue. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec eleifend turpis metus, ut malesuada libero scelerisque vel. Duis id pellentesque nibh, non mollis odio. Cras tristique sit amet elit vel lacinia.","url":"http://riverside.io.com","photos":[{"id":1,"url":"http://lorempixel.com/960/720","width":960,"height":720},{"id":2,"url":"http://lorempixel.com/960/720/nature","width":960,"height":720},{"id":3,"url":"http://lorempixel.com/960/720/nature","width":960,"height":720},{"id":4,"url":"http://lorempixel.com/960/720/nature","width":960,"height":720}],"tours":[{"id":5,"url":"http://lorempixel.com/960/720/nature","length":960433}]},
    {"id": 5,"name":"Maven 2.0","createdAt":1084579200,"lastModified":1084579200,"contact":{"phone":"5551231234","formattedPhone":"(555) 123-1234","twitter":"riversideio"},"location":{"address":"3567 Main St","lat":33.901637,"lng":-117.493583,"postalCode":"92501","cc":"US","city":"Riverside","state":"CA","country":"United States","formattedAddress":"3567 Main St, Riverside, CA 92501"},"description":"3567 Main St, Riverside, CA. Coworking and cat gifs. Memberships and day rates. Vestibulum aliquet quam sem, non hendrerit lorem commodo id. Suspendisse sit amet purus posuere, volutpat nibh quis, interdum orci. Aenean rhoncus diam sit amet justo varius tempus. In posuere, odio ac fringilla vehicula, sem felis cursus dui, quis sodales lorem ligula ut felis. Praesent vel metus vel metus mollis pretium. Aenean a sagittis odio. Maecenas sit amet dignissim nibh, vitae convallis augue. Praesent rhoncus ac velit sit amet sagittis. Ut nec elit neque. Nunc tempus suscipit interdum. Fusce commodo, risus ut pharetra gravida, turpis purus facilisis neque, molestie condimentum felis purus eu nulla. Fusce cursus vehicula lectus a cursus. Curabitur luctus euismod risus vitae congue. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec eleifend turpis metus, ut malesuada libero scelerisque vel. Duis id pellentesque nibh, non mollis odio. Cras tristique sit amet elit vel lacinia.","url":"http://riverside.io.com","photos":[{"id":1,"url":"http://placecage.com/c/960/720","width":960,"height":720},{"id":2,"url":"http://lorempixel.com/960/720/nature","width":960,"height":720},{"id":3,"url":"http://lorempixel.com/960/720/nature","width":960,"height":720},{"id":4,"url":"http://lorempixel.com/960/720/nature","width":960,"height":720}],"tours":[{"id":5,"url":"http://lorempixel.com/960/720/nature","length":960433}]},
    {"id": 6,"name":"Mount Rubidoux","createdAt":1084579200,"lastModified":1084579200,"contact":{"phone":"5551231234","formattedPhone":"(555) 123-1234","twitter":"riversideio"},"location":{"address":"3567 Main St","lat":33.9888013,"lng":-117.3912052,"postalCode":"92501","cc":"US","city":"Riverside","state":"CA","country":"United States","formattedAddress":"3567 Main St, Riverside, CA 92501"},"description":"3567 Main St, Riverside, CA. Coworking and cat gifs. Memberships and day rates. Vestibulum aliquet quam sem, non hendrerit lorem commodo id. Suspendisse sit amet purus posuere, volutpat nibh quis, interdum orci. Aenean rhoncus diam sit amet justo varius tempus. In posuere, odio ac fringilla vehicula, sem felis cursus dui, quis sodales lorem ligula ut felis. Praesent vel metus vel metus mollis pretium. Aenean a sagittis odio. Maecenas sit amet dignissim nibh, vitae convallis augue. Praesent rhoncus ac velit sit amet sagittis. Ut nec elit neque. Nunc tempus suscipit interdum. Fusce commodo, risus ut pharetra gravida, turpis purus facilisis neque, molestie condimentum felis purus eu nulla. Fusce cursus vehicula lectus a cursus. Curabitur luctus euismod risus vitae congue. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec eleifend turpis metus, ut malesuada libero scelerisque vel. Duis id pellentesque nibh, non mollis odio. Cras tristique sit amet elit vel lacinia.","url":"http://riverside.io.com","photos":[{"id":1,"url":"http://placekitten.com/960/720","width":960,"height":720},{"id":2,"url":"http://lorempixel.com/960/720/nature","width":960,"height":720},{"id":3,"url":"http://lorempixel.com/960/720/nature","width":960,"height":720},{"id":4,"url":"http://lorempixel.com/960/720/nature","width":960,"height":720}],"tours":[{"id":5,"url":"http://lorempixel.com/960/720/nature","length":960433}]},
    {"id": 7,"name":"Riverside County Historic Courthouse","createdAt":1084579200,"lastModified":1084579200,"contact":{"phone":"5551231234","formattedPhone":"(555) 123-1234","twitter":"riversideio"},"location":{"address":"3567 Main St","lat":33.97925,"lng":-117.375567,"postalCode":"92501","cc":"US","city":"Riverside","state":"CA","country":"United States","formattedAddress":"3567 Main St, Riverside, CA 92501"},"description":"3567 Main St, Riverside, CA. Coworking and cat gifs. Memberships and day rates. Vestibulum aliquet quam sem, non hendrerit lorem commodo id. Suspendisse sit amet purus posuere, volutpat nibh quis, interdum orci. Aenean rhoncus diam sit amet justo varius tempus. In posuere, odio ac fringilla vehicula, sem felis cursus dui, quis sodales lorem ligula ut felis. Praesent vel metus vel metus mollis pretium. Aenean a sagittis odio. Maecenas sit amet dignissim nibh, vitae convallis augue. Praesent rhoncus ac velit sit amet sagittis. Ut nec elit neque. Nunc tempus suscipit interdum. Fusce commodo, risus ut pharetra gravida, turpis purus facilisis neque, molestie condimentum felis purus eu nulla. Fusce cursus vehicula lectus a cursus. Curabitur luctus euismod risus vitae congue. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec eleifend turpis metus, ut malesuada libero scelerisque vel. Duis id pellentesque nibh, non mollis odio. Cras tristique sit amet elit vel lacinia.","url":"http://riverside.io.com","photos":[{"id":1,"url":"https://farm4.staticflickr.com/3133/3155297848_fc1d03896e_b_d.jpg","width":960,"height":720},{"id":2,"url":"http://lorempixel.com/960/720/nature","width":960,"height":720},{"id":3,"url":"http://lorempixel.com/960/720/nature","width":960,"height":720},{"id":4,"url":"http://lorempixel.com/960/720/nature","width":960,"height":720}],"tours":[{"id":5,"url":"http://lorempixel.com/960/720/nature","length":960433}]},
    {"id": 8,"name":"Victoria Avenue","createdAt":1084579200,"lastModified":1084579200,"contact":{"phone":"5551231234","formattedPhone":"(555) 123-1234","twitter":"riversideio"},"location":{"address":"3567 Main St","lat":33.9190995,"lng":-117.4086693,"postalCode":"92501","cc":"US","city":"Riverside","state":"CA","country":"United States","formattedAddress":"3567 Main St, Riverside, CA 92501"},"description":"3567 Main St, Riverside, CA. Coworking and cat gifs. Memberships and day rates. Vestibulum aliquet quam sem, non hendrerit lorem commodo id. Suspendisse sit amet purus posuere, volutpat nibh quis, interdum orci. Aenean rhoncus diam sit amet justo varius tempus. In posuere, odio ac fringilla vehicula, sem felis cursus dui, quis sodales lorem ligula ut felis. Praesent vel metus vel metus mollis pretium. Aenean a sagittis odio. Maecenas sit amet dignissim nibh, vitae convallis augue. Praesent rhoncus ac velit sit amet sagittis. Ut nec elit neque. Nunc tempus suscipit interdum. Fusce commodo, risus ut pharetra gravida, turpis purus facilisis neque, molestie condimentum felis purus eu nulla. Fusce cursus vehicula lectus a cursus. Curabitur luctus euismod risus vitae congue. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec eleifend turpis metus, ut malesuada libero scelerisque vel. Duis id pellentesque nibh, non mollis odio. Cras tristique sit amet elit vel lacinia.","url":"http://riverside.io.com","photos":[{"id":1,"url":"http://lorempixel.com/960/720/transport","width":960,"height":720},{"id":2,"url":"http://lorempixel.com/960/720/nature","width":960,"height":720},{"id":3,"url":"http://lorempixel.com/960/720/nature","width":960,"height":720},{"id":4,"url":"http://lorempixel.com/960/720/nature","width":960,"height":720}],"tours":[{"id":5,"url":"http://lorempixel.com/960/720/nature","length":960433}]},
    {"id": 9,"name":"Museum of Bearded Dragons","createdAt":1084579200,"lastModified":1084579200,"contact":{"phone":"5551231234","formattedPhone":"(555) 123-1234","twitter":"riversideio"},"location":{"address":"3567 Main St","lat":33.984361492526084,"lng":-117.37330426184035,"postalCode":"92501","cc":"US","city":"Riverside","state":"CA","country":"United States","formattedAddress":"3567 Main St, Riverside, CA 92501"},"description":"In which we dedicate ourselves to the fine art and discipline of engineering the male facial form. We're here to celebrate beards, not to shame those without.","url":"http://riverside.io.com","photos":[{"id":1,"url":"http://placebeard.it/960/720","thumbnail":"http://placebeard.it/120/300","caption":"Even it means me taking a chubby… I will suck it up. And I wouldn't just lie there, if that's what you're thinking. That's not what I WAS thinking. And I wouldn't just lie there, if that's what you're thinking. That's not what I WAS thinking. And I am rock steady. No more dizzies."},{"id":2,"url":"http://placebeard.it/640/480/notag","thumbnail":"http://placebeard.it/150/180"},{"id":3,"url":"http://placebeard.it/1024/600/notag","thumbnail":"http://placebeard.it/140"},{"id":4,"url":"http://placebeard.it/1000/1400/notag","thumbnail":"http://placebeard.it/200/180"}],"tours":[{"id":5,"url":"http://placebeard.it/1200/notag","length":960433}]},
    {"id": 10,"name":"Municipal Auditorium","createdAt":1084579200,"lastModified":1084579200,"contact":{"phone":"5551231234","formattedPhone":"(555) 123-1234","twitter":"riversideio"},"location":{"address":"3567 Main St","lat":33.982095,"lng":-117.370813,"postalCode":"92501","cc":"US","city":"Riverside","state":"CA","country":"United States","formattedAddress":"3567 Main St, Riverside, CA 92501"},"description":"3567 Main St, Riverside, CA. Coworking and cat gifs. Memberships and day rates. Vestibulum aliquet quam sem, non hendrerit lorem commodo id. Suspendisse sit amet purus posuere, volutpat nibh quis, interdum orci. Aenean rhoncus diam sit amet justo varius tempus. In posuere, odio ac fringilla vehicula, sem felis cursus dui, quis sodales lorem ligula ut felis. Praesent vel metus vel metus mollis pretium. Aenean a sagittis odio. Maecenas sit amet dignissim nibh, vitae convallis augue. Praesent rhoncus ac velit sit amet sagittis. Ut nec elit neque. Nunc tempus suscipit interdum. Fusce commodo, risus ut pharetra gravida, turpis purus facilisis neque, molestie condimentum felis purus eu nulla. Fusce cursus vehicula lectus a cursus. Curabitur luctus euismod risus vitae congue. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec eleifend turpis metus, ut malesuada libero scelerisque vel. Duis id pellentesque nibh, non mollis odio. Cras tristique sit amet elit vel lacinia.","url":"http://riverside.io.com","photos":[{"id":1,"url":"http://lorempixel.com/960/720/food","width":960,"height":720},{"id":2,"url":"http://lorempixel.com/960/720/nature","width":960,"height":720},{"id":3,"url":"http://lorempixel.com/960/720/nature","width":960,"height":720},{"id":4,"url":"http://lorempixel.com/960/720/nature","width":960,"height":720}],"tours":[{"id":5,"url":"http://lorempixel.com/960/720/nature","length":960433}]},
    {"id": 11,"name":"Riverside Art Museum","createdAt":1084579200,"lastModified":1084579200,"contact":{"phone":"5551231234","formattedPhone":"(555) 123-1234","twitter":"riversideio"},"location":{"address":"3567 Main St","lat":33.981736,"lng":-117.370509,"postalCode":"92501","cc":"US","city":"Riverside","state":"CA","country":"United States","formattedAddress":"3567 Main St, Riverside, CA 92501"},"description":"3567 Main St, Riverside, CA. Coworking and cat gifs. Memberships and day rates. Vestibulum aliquet quam sem, non hendrerit lorem commodo id. Suspendisse sit amet purus posuere, volutpat nibh quis, interdum orci. Aenean rhoncus diam sit amet justo varius tempus. In posuere, odio ac fringilla vehicula, sem felis cursus dui, quis sodales lorem ligula ut felis. Praesent vel metus vel metus mollis pretium. Aenean a sagittis odio. Maecenas sit amet dignissim nibh, vitae convallis augue. Praesent rhoncus ac velit sit amet sagittis. Ut nec elit neque. Nunc tempus suscipit interdum. Fusce commodo, risus ut pharetra gravida, turpis purus facilisis neque, molestie condimentum felis purus eu nulla. Fusce cursus vehicula lectus a cursus. Curabitur luctus euismod risus vitae congue. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec eleifend turpis metus, ut malesuada libero scelerisque vel. Duis id pellentesque nibh, non mollis odio. Cras tristique sit amet elit vel lacinia.","url":"http://riverside.io.com","photos":[{"id":1,"url":"http://www.stevensegallery.com/960/720","width":960,"height":720},{"id":2,"url":"http://lorempixel.com/960/720/nature","width":960,"height":720},{"id":3,"url":"http://lorempixel.com/960/720/nature","width":960,"height":720},{"id":4,"url":"http://lorempixel.com/960/720/nature","width":960,"height":720}],"tours":[{"id":5,"url":"http://lorempixel.com/960/720/nature","length":960433}]},
    {"id": 12,"name":"Fox Theater","createdAt":1084579200,"lastModified":1084579200,"contact":{"phone":"5551231234","formattedPhone":"(555) 123-1234","twitter":"riversideio"},"location":{"address":"3567 Main St","lat":33.983999,"lng":-117.375266,"postalCode":"92501","cc":"US","city":"Riverside","state":"CA","country":"United States","formattedAddress":"3567 Main St, Riverside, CA 92501"},"description":"3567 Main St, Riverside, CA. Coworking and cat gifs. Memberships and day rates. Vestibulum aliquet quam sem, non hendrerit lorem commodo id. Suspendisse sit amet purus posuere, volutpat nibh quis, interdum orci. Aenean rhoncus diam sit amet justo varius tempus. In posuere, odio ac fringilla vehicula, sem felis cursus dui, quis sodales lorem ligula ut felis. Praesent vel metus vel metus mollis pretium. Aenean a sagittis odio. Maecenas sit amet dignissim nibh, vitae convallis augue. Praesent rhoncus ac velit sit amet sagittis. Ut nec elit neque. Nunc tempus suscipit interdum. Fusce commodo, risus ut pharetra gravida, turpis purus facilisis neque, molestie condimentum felis purus eu nulla. Fusce cursus vehicula lectus a cursus. Curabitur luctus euismod risus vitae congue. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec eleifend turpis metus, ut malesuada libero scelerisque vel. Duis id pellentesque nibh, non mollis odio. Cras tristique sit amet elit vel lacinia.","url":"http://riverside.io.com","photos":[{"id":1,"url":"http://lorempixel.com/960/720/fashion","width":960,"height":720},{"id":2,"url":"http://lorempixel.com/960/720/nature","width":960,"height":720},{"id":3,"url":"http://lorempixel.com/960/720/nature","width":960,"height":720},{"id":4,"url":"http://lorempixel.com/960/720/nature","width":960,"height":720}],"tours":[]},
  ];

  return {
    all: function() {
      return locations;
    },
    getLocation: function(locationId) {
      // Simple index lookup
      for(var i=0, l=locations.length; i < l; i++) {
        if(locations[i].id == locationId) {
          return locations[i];
        }
      }
      //return locations[locationId];
    },
    getTour: function(locationId, tourId) {
      // Simple index lookup
      return locations[locationId].tours[tourId];
    },
    getPhoto: function(locationId, photoId) {
      // Simple index lookup
      return locations[locationId].photos[photoId];
    }
  }
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
    // getPhoto: function(locationId, photoId) {
    //   // Simple index lookup
    //   return locations[locationId].photos[photoId];
    // }
  }
});
