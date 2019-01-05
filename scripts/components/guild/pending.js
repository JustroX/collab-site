app.controller("guildNewPendingController",function($scope,$http,$location,$timeout,session,apiService)
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
		    message: 'Request sent!',
		    status: 'success',
		    pos: 'top-right',
		    timeout: 5000
		});
	};
	$scope.api.validate = function()
	{
		return $scope.model.message!=""  ;
	};

	$scope.$on('components/guild/pending/init',function(ev,data)
	{
		guild_id = data.guild_id;
		$timeout(function()
		{
			$scope.api.url = 'guild/'+data.guild_id+'/users_pending/request';
		},100);
	});


});