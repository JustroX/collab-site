app.controller("challengeViewController",function($scope,$http,$location,$timeout,apiService)
{
	let api = apiService.view("challenge",$scope);
	$scope.api    = api;
});