app.controller("guildMainPendingController",function($scope,$http,$location,$timeout,session,apiService)
{
	let guild_id;
	$scope.list = apiService.list("",$scope);
	$scope.approve = apiService.new("",$scope);
	$scope.reject = apiService.new("",$scope);

	$scope.list.success = function(res)
	{
		UIkit.notification({
		    message: 'Request sent!',
		    status: 'success',
		    pos: 'top-right',
		    timeout: 5000
		});
	};
	$scope.list.validate = function()
	{
		return $scope.model.message!=""  ;
	};

	$scope.$on('components/guild/pending/main/init',function(ev,data)
	{
		guild_id = data.guild_id;
		$scope.list.url = 'guild/'+data.guild_id+'/users_pending';
		$scope.approve.url = 'guild/'+data.guild_id+'/users_pending';
		$scope.reject.url = 'guild/'+data.guild_id+'/users_pending';
		$timeout(function()
		{
			$scope.list.load();
		},100);
	});


});