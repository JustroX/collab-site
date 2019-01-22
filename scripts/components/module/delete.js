app.controller("moduleDeleteController",function($scope,$http,$location,$timeout,session,apiService,$rootScope)
{

	let id;
	$scope.api = apiService.delete("module",$scope);
	$scope.$on('component/module/delete/init',function(ev,data)
	{
		id = data.target;
		$scope.api.target = data.target;
	});	

	$scope.api.success = function()
	{
		$rootScope.$broadcast('component/module/delete/success');
	};
	
});