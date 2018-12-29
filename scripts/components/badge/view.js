app.controller("badgeViewController",function($scope,$http,$location,$timeout,session,apiService)
{
	let api = apiService.view("badge",$scope);
	$scope.api    = api;
});