angular.module( 'ngBoilerplate', [
  'templates-app',
  'templates-common',
  'ngBoilerplate.home',
  'ngBoilerplate.about',
  'ui.router',
  'harmony.network'
])

.config( function myAppConfig ( $stateProvider, $urlRouterProvider, harmonyNetworkProvider ) {
    $urlRouterProvider.otherwise( '/home' );
    harmonyNetworkProvider.setProxyUrl("http://localhost");
})

.run( function run () {
})

.controller( 'AppCtrl', function AppCtrl ( $scope, $location, $log, harmonyNetwork ) {
        $log.debug("proxy url: " + harmonyNetwork.getProxyUrl());
  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    if ( angular.isDefined( toState.data.pageTitle ) ) {
      $scope.pageTitle = toState.data.pageTitle + ' | ngBoilerplate' ;
    }
  });
})

;

