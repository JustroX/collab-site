app.controller("challengeListController",function($scope,$http,$location,$timeout,apiService)
{
	let api = apiService.list("challenge",$scope);
	$scope.api    = api;
});