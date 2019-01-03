app.controller("pageGuildViewController",function($scope,$http,$location,$timeout,session,$rootScope,subpageService,$routeParams)
{
	$scope.subpage = subpageService.Page();
	session.onready(function(){
		$scope.subpage.goto("feed");
	});

	$scope.subpage.onload("feed",function()
	{
		$timeout(function()
		{
			$scope.$broadcast("components/post/list",{ param: "group="+$routeParams.id+"&sort=-date"});
			$scope.$broadcast('components/post/new/group',{ group: $routeParams.id });
		},1000);
	});
});