app.controller("userListController",function($scope,$http,$location,$timeout,session,apiService,$rootScope)
{
	let api = apiService.list("user",$scope);
	$scope.api    = api;
	$scope.api.success = function(res)
	{
		$scope.api.list = res;
		$rootScope.$broadcast("component/user/search/success");
	}

	$scope.$on("component/user/search",function(ev,data)
	{
		$scope.api.param = "name=rx_"+data.query;
		$scope.api.limit = 5;
		$scope.api.load(); 
	});
});