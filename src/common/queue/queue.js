/**
 * Created by joah.zhang on 14-10-28.
 */
angular.module('harmony.queue', [])
    .service('harmonyQueue', ['$q','$rootScope','$log',function($q, $rootScope, $log){
        var self = this;
        var glueDefers = [], index = 1;

        /**
         * execute commands sync/async.
         * $do(cmd1, cmd2, cmd3) invoked async
         * $do(cmd1); $do(cmd2) invoke cmd1 and cmd2 in order
         */
        this.$do = function(){
            var commands = Array.prototype.slice.call(arguments, 0);
            var commandsDefer, glueDefer, isEntryPoint;

            $log.debug("commands length: " + commands.length );
            commandsDefer = glueDefers[index-1];
            glueDefer = $q.defer();
            isEntryPoint = !commandsDefer;
            commandsDefer = commandsDefer || $q.defer();
            glueDefers[index++] = glueDefer;

            run();

            function run(){
                commandsDefer.promise.then(function(){
                    $log.debug("enter queue");
                    var promiseQueue = [], promise;
                    commands.forEach(function(cmd){
                        promise = cmd();
                        if(promise && promise.then) {
                            promiseQueue.push(promise);
                        }
                    });
                    if(promiseQueue.length > 0){
                        return $q.all(promiseQueue);
                    } else {
                        return 0;
                    }
                }).then(function(){
                        $log.debug("resolve defer");
                        glueDefer.resolve("done");
                        if(!$rootScope.$$phase) {
                            $rootScope.$apply();
                        }
                    });

                if(isEntryPoint){
                    $log.debug("resolve immediate defer");
                    commandsDefer.resolve("done");
                    $rootScope.$apply();
                }
            }

        };
        /**
         * clear queues and reset
         */
        this.done = function(){
            var finalDefer = glueDefers[index-1];
            if(finalDefer){
                finalDefer.resolve('finish');
                glueDefers.length = 0;
                index = 1;
                $log.debug("queue finished");
            }
        };
    }]);