app.controller("badgeViewController",function($scope,$http,$location,$timeout,session,apiService)
{
	let api = apiService.view($scope);
	$scope.api    = api;
});