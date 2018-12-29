app.controller("userViewController",function($scope,$http,$location,$timeout,session,apiService)
{
	let api = apiService.view("user",$scope);
	$scope.api    = api;
});