app.controller("badgeListController",function(apiService,$scope,$http,$location,$timeout,session)
{
	let api = apiService.list();
	$scope.api    = api;
});