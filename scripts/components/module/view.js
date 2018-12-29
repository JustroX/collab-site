app.controller("moduleViewController",function($scope,$http,$location,$timeout,session,apiService)
{
	let api = apiService.view("module",$scope);
	$scope.api    = api;
});