app.controller("pageGuildViewController",function($scope,$http,$location,$timeout,session,$rootScope,subpageService,$routeParams)
{
	$scope.subpage = subpageService.Page();
	session.onready(function(){
		$scope.subpage.goto("feed");
		$scope.$broadcast("component/guild/view",{ _id: $routeParams.id});
	});

	$scope.subpage.onload("feed",function()
	{
		$timeout(function()
		{
			$scope.$broadcast("components/post/list",{ param: "group="+$routeParams.id+"&sort=-date"});
			$scope.$broadcast('components/post/new/group',{ group: $routeParams.id });
		},3);
	});


	$scope.subpage.onload("settings",function()
	{
		$scope.$broadcast("components/guild/edit",$routeParams.id);
		$timeout(function()
		{
			$scope.$broadcast("components/guild/edit",$routeParams.id);
		},2000);
	});


	$scope.$on("components/guild/edit/success",function(ev,data)
	{
		$scope.$broadcast("component/guild/view",{ _id: $routeParams.id});
	});
});