var app = angular.module('HomeApp',[]);
//--------------------------------------------------------Login Data--------------------------------------------------------
app.controller('HomeController', function($scope,$http){
  $scope.UserData = function(){
    $http({
      method : "GET",
      url : "/userdata"
    }).then(function success(response){
      $scope.user = response.data[0];
    }, function error(response){
      alert('Error Occured !')
    })
  }
});