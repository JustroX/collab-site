app.controller("articleViewController",function($scope,$http,$location,$timeout,session,apiService)
{
	let api = apiService.view("article",$scope);
	$scope.api    = api;
});