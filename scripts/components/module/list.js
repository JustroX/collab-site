app.controller("moduleListController",function($scope,$http,$location,$timeout,session,apiService)
{
	let api = apiService.list("module",$scope);
	$scope.api    = api;

	$scope.$on('components/module/list',function(ev,data)
	{
		$scope.api.param = data.param;
		$scope.api.load();
	});
});