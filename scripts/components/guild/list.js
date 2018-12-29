app.controller("guildListController",function($scope,$http,$location,$timeout,session,apiService)
{
	let api = apiService.list("guild",$scope);
	$scope.api    = api;
});