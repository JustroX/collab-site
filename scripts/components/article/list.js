app.controller("articleListController",function($scope,$http,$location,$timeout,session,apiService,editorService)
{
	let api = apiService.list("article",$scope);
	$scope.api    = api;
});