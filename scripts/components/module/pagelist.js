app.controller("modulePageListController",function($scope,$http,$location,$timeout,session,apiService,$rootScope)
{
	let api = apiService.list("module",$scope);
	$scope.api    = api;

	$scope.$on('components/module/page/list',function(ev,data)
	{
		$scope.api.param = data.param || "";
		$scope.api.url = 'module/' + data._id + '/page';
		$scope.api.load();
	});

	$scope.api.success = function(res)
	{
		$scope.api.list = res;
		$rootScope.$broadcast('components/module/page/list/success',{ list: $scope.api.list });
	}
});