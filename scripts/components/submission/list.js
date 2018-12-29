app.controller("submissionListController",function($scope,$http,$location,$timeout,apiService)
{
	let api = apiService.list("submission",$scope);
	$scope.api    = api;
});