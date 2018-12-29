app.controller("postListController",function($scope,$http,$location,$timeout,session,apiService)
{
	let api = apiService.list("post",$scope);
	$scope.api    = api;
});