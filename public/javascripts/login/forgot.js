var app = angular.module('ForgotApp',[]);
//--------------------------------------------------------Login Data--------------------------------------------------------
app.controller('ForgotController', function($scope,$http){
  $scope.Forgot = function(mail){
    $http({
      method : "POST",
      url : "/forgot",
      data : mail
    }).then(function success(response){
      alert('Please check your email');
    }, function error(response){
      alert('Email not found');
    })
  }
});