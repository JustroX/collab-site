app.controller("staticController", function($rootScope,$scope,$location,$http,$routeParams)
{
	$scope.location = {};
	$scope.location.url = $routeParams.location;
});