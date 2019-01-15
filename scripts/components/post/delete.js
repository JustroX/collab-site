app.controller("postDeleteController",function($scope,$http,$location,$timeout,apiService,$rootScope)
{
	$scope.api = apiService.delete("post",$scope);

	$scope.api.success = function(res)
	{
		$rootScope.$broadcast('components/post/delete/success');
	}

	$scope.$on('components/post/delete/init',function(ev,data)
	{
		$scope.api.target = data._id;
	});
});