describe('networkUtil', function(){
    describe('harmonyNetworkUtil', function(){
        var _harmonyNetworkUtil;
        beforeEach(module('harmony.networkUtil'));

        beforeEach(inject(function(harmonyNetworkUtil){
            _harmonyNetworkUtil = harmonyNetworkUtil;
        }));

        it('test get Cached url key', function(){
            var url = "http://abc.com/:uid;jsessionid=:jsessionid",
                params = {
                    uid: '001',
                    page: '2',
                    sort: 'id'
                },
                defaultParmas = {
                    jsessionid: 'ABCDEFG'
                };

            expect(_harmonyNetworkUtil.getCachedUrlKey(url, params, defaultParmas)).toBe('http://abc.com/001;jsessionid=ABCDEFG?page=2&sort=id');

        });

    });
});
