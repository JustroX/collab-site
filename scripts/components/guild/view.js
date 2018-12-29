app.controller("guildViewController",function($scope,$http,$location,$timeout,session,apiService)
{
	let api = apiService.view("guild",$scope);
	$scope.api    = api;
});