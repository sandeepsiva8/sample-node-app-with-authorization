var app = angular.module('LoginApp',[]);
//--------------------------------------------------------Login Data--------------------------------------------------------
app.controller('LoginController', function($scope,$http,$window){
  $scope.Login = function(log){
    $http({
      method : "POST",
      url : "/login",
      data : log
    }).then(function success(response){
      $scope.login = {};
      window.location.href = '/home';
    }, function error(response){
      alert('Invalid Credentials')
    })
  }
});