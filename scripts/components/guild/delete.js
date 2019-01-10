app.controller("guildDeleteController",function($scope,$http,$location,$timeout,session,apiService)
{
	$scope.api = apiService.delete("guild",$scope);

	$scope.$on('components/guild/delete/init',function(ev,guild)
	{
		$timeout(function()
		{
			$scope.api.target = guild._id;
			$scope.api.err = function()
			{
				$scope.api.target  =guild._id;
			}
			$scope.api.success = function()
			{
				UIkit.modal("#modal-delete").hide()
				$timeout(function()
				{
					window.location.href ='#/dashboard';
				},10);
			}
		},10);
	});

});