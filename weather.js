var weather=angular.module('weather',[]);
weather.controller('weather',function($scope,$http){
  var app_key="16617229f6b991e5b3e28c8c13daa521";
  $http.get('http://api.openweathermap.org/data/2.5/weather?q=pentapadu&appid=16617229f6b991e5b3e28c8c13daa521').then(success,fail);
  function success(data)

  {console.log(data);
    $scope.data=data.data.main.temp-273.15;
    console.log(data.main);
  }
  function fail(data){
    console.log(data);
  }


})
