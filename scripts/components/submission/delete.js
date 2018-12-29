app.controller("submissionDeleteController",function($scope,$http,$location,$timeout,apiService)
{
	$scope.api = apiService.delete("submission",$scope);
});