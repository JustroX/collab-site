app.controller("submissionViewController",function($scope,$http,$location,$timeout,apiService)
{
	let api = apiService.view("submission",$scope);
	$scope.api    = api;
});