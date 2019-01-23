app.controller("challengeDeleteController",function($scope,$http,$location,$timeout,apiService,$rootScope)
{
	let id;
	let index;
	$scope.api = apiService.delete("challenge",$scope);
	$scope.$on('component/challenge/delete/init',function(ev,data)
	{
		id = data.target;
		$scope.api.target = data.target;
		index  = data.idx;
	});

	$scope.api.success = function()
	{
		$rootScope.$broadcast('component/challenge/delete/success',{idx: index});
	};
	
});