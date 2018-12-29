app.controller("userDeleteController",function($scope,$http,$location,$timeout,session,apiService)
{
	$scope.api = apiService.delete("user",$scope);
});