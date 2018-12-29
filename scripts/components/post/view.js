app.controller("postViewController",function($scope,$http,$location,$timeout,session,apiService)
{
	let api = apiService.view("post",$scope);
	$scope.api    = api;
});