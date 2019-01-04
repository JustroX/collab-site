app.controller("pageGuildViewController",function($scope,$http,$location,$timeout,session,$rootScope,subpageService,$routeParams)
{
	$scope.subpage = subpageService.Page();
	session.onready(function(){
		$timeout(function() {
			$scope.subpage.goto("feed");
			$scope.$broadcast("component/guild/view",{ _id: $routeParams.id});
		}, 1);
	});

	$scope.subpage.onload("feed",function()
	{
		$timeout(function()
		{
			$scope.$broadcast('components/post/new/group',{ group: $routeParams.id });
		});
		$timeout(function()
		{
			$scope.$broadcast("components/post/list",{ param: "group="+$routeParams.id+"&sort=-date"});
		},100);
	});


	$scope.subpage.onload("members",function()
	{
		$timeout(function()
		{
			$scope.$broadcast("components/guild/edit",$routeParams.id);
		},1);
	});


	$scope.subpage.onload("settings",function()
	{
		$timeout(function()
		{
			$scope.$broadcast("components/guild/edit",$routeParams.id);
		},1);
	});


	$scope.$on("components/guild/edit/success",function(ev,data)
	{
		$scope.$broadcast("component/guild/view",{ _id: $routeParams.id});
	});
});