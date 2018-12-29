app.controller("articleDeleteController",function(apiService,$scope,$http,$location,$timeout,session)
{
	$scope.api = apiService.delete("article",$scope);
});