app.controller("articleDeleteController",function(apiService,$scope,$http,$location,$timeout,session,$rootScope)
{
	let id;
	let index;
	$scope.api = apiService.delete("article",$scope);
	$scope.$on('component/article/delete/init',function(ev,data)
	{
		id = data.target;
		$scope.api.target = data.target;
		index  = data.idx;
	});	

	$scope.api.success = function()
	{
		$rootScope.$broadcast('component/article/delete/success',{idx: index});
	};
	
});