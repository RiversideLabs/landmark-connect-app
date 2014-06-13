angular.module('landmarkConnect.filters', [])

.filter('capitalize', function() {
    return function(input, scope) {
        if (input!=null)
            return input.substring(0,1).toUpperCase()+input.substring(1);
    }
})

.filter('lookInside', function(){
    return function(item, array){
        var name = 'no';
        for (var i=0; i<array.length; i++){
            if (array[i] == item) {
                name = 'si';
            }
        }
        return name;
    };
})
