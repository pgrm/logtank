angular.module('logtankApp')
  .config(function ($routeProvider: ng.route.IRouteProvider) {
    $routeProvider
      .when('/admin', {
        templateUrl: 'app/admin/admin.html',
        controller: 'AdminCtrl'
      });
  });