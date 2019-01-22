app.controller("modulePageListController",function($scope,$http,$location,$timeout,session,apiService)
{
	let api = apiService.list("module",$scope);
	$scope.api    = api;

	$scope.$on('components/module/page/list',function(ev,data)
	{
		$scope.api.param = data.param || "";
		$scope.api.url = 'module/' + data._id + '/page';
		$scope.api.load();
	});
});