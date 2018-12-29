app.controller("badgeDeleteController",function(apiService,$scope,$http,$location,$timeout,session)
{
	$scope.api = apiService.delete($scope);
});