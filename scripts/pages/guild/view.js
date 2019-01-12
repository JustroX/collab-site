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
			console.log("Wew");
			$scope.$broadcast('components/post/new/group',{ group: $routeParams.id });
			$scope.$broadcast("components/post/feed/init",{ param: "group="+$routeParams.id+"&sort=-date"});
			$scope.$on('components/post/new/success',function(ev,data)
			{
				$scope.$broadcast("components/post/feed/init",{ param: "group="+$routeParams.id+"&sort=-date"});
			});
		},700);
	});


	$scope.subpage.onload("members",function()
	{
		$timeout(function()
		{
			$scope.$broadcast("components/guild/edit",$routeParams.id);
			$scope.$broadcast('components/guild/pending/main/init',{ guild_id: $routeParams.id});
			$scope.$broadcast('components/guild/membership/init',{ guild_id: $routeParams.id});
		},1);
	});



	$scope.subpage.onload("settings",function()
	{
		$timeout(function()
		{
			$scope.$broadcast("components/guild/edit",$routeParams.id);
			$scope.$broadcast('components/guild/rank/init',{ guild_id: $routeParams.id});
			$scope.$broadcast("components/guild/delete/init",{ _id: $routeParams.id});
		},1);
	});


	$scope.$on("components/guild/edit/success",function(ev,data)
	{
		$scope.$broadcast("component/guild/view",{ _id: $routeParams.id});
	});
});