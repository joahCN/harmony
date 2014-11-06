/**
 * Created by joah.zhang on 14-10-21.
 */

angular.module('harmony.utils',[])
    .constant('harmonyUtils', {
        dummyFn: function(){},
        type: function(obj){
            return typeof obj;
        }
    });
