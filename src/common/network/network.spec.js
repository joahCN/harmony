describe( 'networkProvider', function() {
    describe("network", function(){
        var network,
            proxyUrl = "http://123",
            $httpBacked;

        beforeEach(module("harmony.network"));

        beforeEach(function(){
            module(function(harmonyNetworkProvider){
                harmonyNetworkProvider.setProxyUrl(proxyUrl);
            });
            inject(function(harmonyNetwork){
                network = harmonyNetwork;
            });
        });

        it('test set/getProxyUrl', function(){
            expect(network.getProxyUrl()).toEqual(proxyUrl);
        });

        it('test request user', function(){
            inject(function(_$httpBackend_){
                $httpBacked = _$httpBackend_;
                $httpBacked.when('GET', proxyUrl+'user').respond({id: 1, name: 'joah'});
                $httpBacked.when('POST', proxyUrl+'user').respond({id: 2, name: 'joah'});
            });

            var data = network.request({
                command: 'user'
            });
            var data2 = network.request({
                command: 'user',
                data: {test: true}
            });
            $httpBacked.flush();
            expect(data.name).toBe('joah');
            expect(data2.id).toBe(2);
        });
    });
});