app.controller("guildDeleteController",function($scope,$http,$location,$timeout,session,apiService)
{
	$scope.api = apiService.delete("guild",$scope);
});