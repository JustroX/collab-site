app.controller("moduleDeleteController",function($scope,$http,$location,$timeout,session,apiService)
{
	$scope.api = apiService.delete("module",$scope);
});