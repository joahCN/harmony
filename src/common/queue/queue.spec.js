/**
 * Created by joah.zhang on 14-10-29.
 */

describe('queue', function(){
    describe('harmonyQueue service', function(){

        var queue, _$q, results = [], flag, _$rootScope, _$timeout;

        beforeEach(module('harmony.queue'));

        beforeEach(inject(function(harmonyQueue, $q, $rootScope, $timeout){
            queue = harmonyQueue;
            _$q = $q;
            _$rootScope = $rootScope;
            _$timeout = $timeout;
        }));

        xit('queue exist', function(){
            expect(queue.$do).toBeDefined();
        });

        it('test $do', function(){
            var r1, r2, r3;
            function fn1(){
                var splitDefer = _$q.defer();
                setTimeout(function(){
                    results.push(1);
                    console.log("resolve fn1 promise");
                    splitDefer.resolve(1);
                    _$rootScope.$apply();
                },500);
                return splitDefer.promise;
            }
            function fn2(){
                var splitDefer = _$q.defer();
                setTimeout(function(){
                    results.push(2);
                    splitDefer.resolve(2);
                    _$rootScope.$apply();
                },1000);
                return splitDefer.promise;
            }
            function fn3(){
                var splitDefer = _$q.defer();
                setTimeout(function(){
                        results.push(3);
                        splitDefer.resolve(3);
                        _$rootScope.$apply();
                    }, 1500);
                return splitDefer.promise;
            }
            runs(function(){
                flag = false;
                queue.$do(fn3, fn3);
                queue.$do(fn2);
                queue.$do(fn1);
                queue.$do(function(){
                    console.log("resolve plain fn");
                    flag = true;
                });
            });
            waitsFor(function(){
                return flag;
            }, 'function invoke queued failed' ,4000);
            runs(function(){
                expect(results).toEqual([3,3,2,1]);
            });

        });

        xit('test async', function(){
            var flag = false;
            runs(function(){
                setTimeout(function(){
                    flag = true;
                }, 2000);
            });
            waitsFor(function(){
                return flag;
            },'fulfilled', 3000);

            runs(function(){
                expect(flag).toBe(true);
            });
            expect(flag).toBe(true);
        });

        xit('test queue', function(){
            var flag = false;
            runs(function(){
                var defer = _$q.defer();
                setTimeout(function(){
                    defer.resolve(123);
                    _$rootScope.$apply();
                }, 2000);
                defer.promise.then(function(value){
                    flag = true;
                });
            });
            waitsFor(function(){
                return flag;
            },'fulfilled', 3000);

            runs(function(){
                expect(flag).toBe(true);
            });
            expect(flag).toBe(false);
        });

        xit("test when", function(){
            var flag = false;
            runs(function(){
                var defer = _$q.defer();
                setTimeout(function(){
                    defer.resolve(123);
                    _$rootScope.$apply();
                }, 2000);
                defer.promise.then(function(value){
                    return _$q.when(function(){
                        var cd = _$q.defer();
                        setTimeout(function(){
                            cd.resolve(true);
                            _$rootScope.$apply();
                        }, 1000);
                        return cd.promise;
                    });
//                    flag = true;
                }).then(function(cmd){
//                        console.log(cmd.toString());
                        cmd().then(function(value){
                            console.log(value);
                            flag = value;
                        });
                    });
            });
            waitsFor(function(){
                return flag;
            },'fulfilled', 3000);

            runs(function(){
                expect(flag).toBe(true);
            });
            expect(flag).toBe(false);
        });


    });
});
