app.controller("postDeleteController",function($scope,$http,$location,$timeout,apiService)
{
	$scope.api = apiService.delete("post",$scope);
});