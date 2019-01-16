app.controller("badgeListController",function(apiService,$scope,$http,$location,$timeout,session,$rootScope)
{
	let api = apiService.list("badge",$scope);
	$scope.api    = api;

	$scope.api.success = function(res)
	{
		$scope.api.list = res;
		$rootScope.$broadcast('components/badge/list/success');
	};

	$scope.$on('components/badge/list/init',function(ev,data)
	{
		$scope.api.param = data.param;
		$scope.api.load();
	});
});