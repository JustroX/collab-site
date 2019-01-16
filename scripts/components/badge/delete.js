app.controller("badgeDeleteController",function(apiService,$scope,$http,$location,$timeout,session,$rootScope)
{
	$scope.api = apiService.delete("badge",$scope);

	$scope.api.success = function(res)
	{
		$rootScope.$broadcast('components/badge/delete/success');
	}

	$scope.$on('components/badge/delete/init',function(ev,data)
	{
		$scope.api.target = data._id;
	});
});