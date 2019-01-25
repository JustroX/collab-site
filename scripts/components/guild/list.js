app.controller("guildListController",function($scope,$http,$location,$timeout,session,apiService,$rootScope)
{
	let api = apiService.list("guild",$scope);
	$scope.api    = api;

	$scope.api.success = function(res)
	{
		$scope.api.list = res;
		$rootScope.$broadcast("component/guild/search/success");
		$rootScope.$broadcast("component/guild/list/success");
	}


	$scope.$on("component/guild/search",function(ev,data)
	{
		$scope.api.param = "name=rx_"+data.query;
		$scope.api.limit = 5;
		$scope.api.load(); 
	});
	$scope.$on("component/guild/list",function(ev,data)
	{
		if($scope.identifier)
		{
			if(data.identifier!=$scope.identifier)
				return;
		}
		$scope.api.param = data.param;
		$scope.api.load(); 
	});

});