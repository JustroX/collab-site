app.controller("userListController",function($scope,$http,$location,$timeout,session,apiService)
{
	let api = apiService.list("user",$scope);
	$scope.api    = api;
});