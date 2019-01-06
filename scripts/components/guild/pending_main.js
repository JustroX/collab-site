app.controller("guildMainPendingController",function($scope,$http,$location,$timeout,session,apiService)
{
	let guild_id;
	$scope.list = apiService.list("",$scope);
	$scope.approve = apiService.new("",$scope);
	$scope.reject = apiService.delete("",$scope);
	$scope.model  = {};

	$scope.reject.success = function(res)
	{
		$scope.list.load();
		UIkit.notification({
		    message: 'Request rejected.',
		    status: 'danger',
		    pos: 'top-right',
		    timeout: 5000
		});
	}
	$scope.approve.success = function(res)
	{
		$scope.list.load();
		UIkit.notification({
		    message: 'Request approved!',
		    status: 'success',
		    pos: 'top-right',
		    timeout: 5000
		});
	}

	$scope.$on('components/guild/pending/main/init',function(ev,data)
	{
		guild_id = data.guild_id;
		$scope.list.url = 'guild/'+data.guild_id+'/users_pending';
		$scope.approve.url = 'guild/'+data.guild_id+'/members';
		$scope.reject.url = 'guild/'+data.guild_id+'/users_pending/request' ;
		$timeout(function()
		{
			$scope.list.load();
		},100);
	});

	$scope.approve_user = function(u)
	{
		$scope.model.user = u._id;
		$scope.approve.submit();
	}
	$scope.reject_user = function(p)
	{
		$scope.reject.target = p._id ;
		$scope.reject.delete();
	}


});