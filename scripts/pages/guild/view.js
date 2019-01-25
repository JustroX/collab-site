app.controller("pageGuildViewController",function($scope,$http,$location,$timeout,session,$rootScope,subpageService,$routeParams)
{
	$scope.subpage = subpageService.Page();

	$scope.guild_id = $routeParams.id;

	session.onready(function(){
		$timeout(function() {
			if($routeParams.members)
				$scope.subpage.goto("members");
			else
				$scope.subpage.goto("feed");

			$scope.$broadcast("component/guild/view",{ _id: $routeParams.id});
		}, 1);
	});

	$scope.is_admin = function()
	{
		return true; 
	}

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


	$scope.subpage.onload("modules",function()
	{
		$timeout(function()
		{
			$scope.$broadcast("components/module/list",{ param: "guild=" + $routeParams.id + "&sort=-date" });
			$scope.$broadcast("components/module/add/init",{ _id: $routeParams.id });
			$scope.$on('components/module/add/success',function(ev,data)
			{
				UIkit.modal("#modal-module-new").hide();
				UIkit.notification({
				    message: 'Your module has been created',
				    status: 'success',
				    pos: 'top',
				    timeout: 3000
				});
				$scope.$broadcast("components/module/list",{ param: "guild=" + $routeParams.id + "&sort=-date" });
			});
		},1);

		$scope.module_new_modal = function()
		{
			UIkit.modal("#modal-module-new").show();
		}
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