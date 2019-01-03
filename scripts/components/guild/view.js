app.controller("guildViewController",function($scope,$http,$location,$timeout,session,apiService,subpageService)
{
	let api = apiService.view("guild",$scope);
	$scope.api    = api;

	$scope.$on('component/guild/view',function(ev,data)
	{
		$scope.api.target = data._id;
		$scope.api.load();
	});
});