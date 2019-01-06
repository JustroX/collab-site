app.controller("staticDashboardController",function($scope,$http,$location,session,subpageService,$timeout)
{
	$scope.subpage = subpageService.Page();
	session.init();
	$http.get('/auth/login').then((res)=>
	{
		if(!(res.data == true))
			$location.path("/");
		session.init();
		session.onready(function()
		{
			$scope.subpage.goto("discover");
		});
	});

	$scope.subpage.onload("feed",function()
	{
		
	});
	$scope.subpage.onload("discover",function()
	{
		$scope.subpage.goto("discover/find");
	});

	$scope.subpage.onload("discover/find",function()
	{
		$timeout(function()
		{
			$scope.$broadcast("component/guild/list",{param: "users.user=ne_"+session.getUser()._id});
		},5);
	});
	$scope.subpage.onload("discover/guilds",function()
	{
		$timeout(function()
		{
			$scope.$broadcast("component/guild/list",{param: "users.user="+session.getUser()._id});
		},5);
	});

	$scope.show_guild_modal = function(guild)
	{
		UIkit.modal("#modal-guild-view").show();
		$timeout(function()
		{
			$scope.$broadcast("component/guild/view",{_id:guild._id});
			$scope.$broadcast('components/guild/pending/init',{guild_id:guild._id});
			$scope.$broadcast('components/guild/join/init',{guild_id:guild._id});
		},100);

	}

	$scope.goto_guild = function(guild)
	{
		window.location.href = "#/guild/"+guild._id;
	}

	$scope.$on("component/guild/list/success",function()
	{

	});
	$scope.$on('components/guild/join/success',function(ev,data)
	{
		window.location.href = "#/guild/"+data.id;
	});

});