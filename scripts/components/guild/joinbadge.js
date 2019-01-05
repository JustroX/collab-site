app.controller("guildNewJoinBadgeController",function($scope,$http,$location,$timeout,session,apiService,$rootScope)
{
	let model = 
	{
	   message: "",
	 };

	 let guild_id;

	$scope.model   = model;

	$scope.api = apiService.new("",$scope);
	$scope.api.success = function(res)
	{
		UIkit.notification({
		    message: 'Congrats! You are now a guild member!',
		    status: 'success',
		    pos: 'top-right',
		    timeout: 5000
		});
		$rootScope.$broadcast('components/guild/join/success',{ id: guild_id});
	};

	$scope.$on('components/guild/join/init',function(ev,data)
	{
		guild_id = data.guild_id;
		$timeout(function()
		{
			$scope.api.url = 'guild/'+data.guild_id+'/members/';
		},100);
	});


});