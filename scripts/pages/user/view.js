app.controller("pageUserViewController",function($scope,$http,$location,$timeout,$rootScope,session,subpageService,$routeParams)
{
	$scope.subpage  = subpageService.Page();
	$timeout(function()
	{
		$rootScope.$broadcast('user/view/load',{ _id: $routeParams.id });
	},3);

	$scope.$on('page/user/view/load/failed',function(ev,data)
	{
		$scope.subpage.goto("error");
	});
	$scope.$on('page/user/view/load/success',function(ev,data)
	{
		$scope.subpage.goto("main");
	});
});