angular.module('logtankApp')
  .controller('NavbarCtrl', function ($scope: ng.IScope, $location: ng.ILocationService, Auth) {
    $scope['menu'] = [{
      'title': 'Home',
      'link': '/'
    }];

    $scope['isCollapsed'] = true;
    $scope['isLoggedIn'] = Auth.isLoggedIn;
    $scope['isAdmin'] = Auth.isAdmin;
    $scope['getCurrentUser'] = Auth.getCurrentUser;

    $scope['logout'] = function() {
      Auth.logout();
      $location.path('/login');
    };

    $scope['isActive'] = function(route) {
      return route === $location.path();
    };
  });