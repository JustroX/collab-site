app.controller("challengeDeleteController",function($scope,$http,$location,$timeout,apiService)
{
	$scope.api = apiService.delete("challenge",$scope);
});