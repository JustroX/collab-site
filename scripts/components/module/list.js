app.controller("moduleListController",function($scope,$http,$location,$timeout,session,apiService)
{
	let api = apiService.list("module",$scope);
	$scope.api    = api;
});