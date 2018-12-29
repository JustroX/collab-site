app.controller("badgeListController",function(apiService,$scope,$http,$location,$timeout,session)
{
	let api = apiService.list("badge",$scope);
	$scope.api    = api;
});