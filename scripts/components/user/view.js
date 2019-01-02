app.controller("userViewController",function($scope,$http,$location,$timeout,session,apiService,$rootScope)
{
	let api = apiService.view("user",$scope);
	$scope.api    = api;
	$scope.api.err  = function(mes)
	{
		$scope.api.error = mes;
		$rootScope.$broadcast('page/user/view/load/failed');
	}
	$scope.api.success = function(res)
	{
		$scope.api.value = res;
		$scope.model = res;
		$rootScope.$broadcast('page/user/view/load/success');
	}

	$scope.$on('user/view/load',function(ev,data)
	{
		$scope.api.target = data._id;
		$scope.api.load();
	});
});