app.controller("guildRankController",function($scope,$http,$location,$timeout,session,apiService,$rootScope)
{
	let guild_id;
	$scope.model = {};
	$scope.view = apiService.view("",$scope);
	$scope.new = apiService.new("",$scope);
	$scope.edit = apiService.edit("",$scope,"edit_model");
	$scope.edit.view = {};
	$scope.edit_model = {};
	$scope.temp_model = 
	{
		permission_modules : [0,0,0],
		permission_members : [0,0,0],
		permission_posts : [0,0,0],
		permission_settings : [0,0,0],
	}

	$scope.new.success = function()
	{
		UIkit.notification({
		    message: 'Rank added.',
		    status: 'success',
		    pos: 'top-right',
		    timeout: 5000
		});
		$scope.view.load();
	}
	$scope.edit.success = function()
	{
		UIkit.notification({
		    message: 'Rank saved.',
		    status: 'success',
		    pos: 'top-right',
		    timeout: 5000
		});
		$scope.edit_model = {};
		$scope.view.load();
	}

	$scope.view_rank = function(i)
	{
		$scope.edit_model = i;
		$scope.edit.view.target = i._id;
		for(let perm in $scope.edit_model)
		{
			if(perm.substring(0,10)=="permission")
				for(let i of [0,1,2])
					$scope.temp_model[perm][i] = ($scope.edit_model[perm] & ( 1<<i ))!=0;
		}
	}

	$scope.check_change = function(permission)	
	{
		$timeout(function()
		{
			let x = 0;
			for(let i in $scope.temp_model[permission])
			{
				if($scope.temp_model[permission][i])
					x |= (1<<i) 
			}
			console.log(x);
			$scope.edit_model[permission] = x;
		},1);
	}

	$scope.is_permitted = function(permission,num)
	{
		return $scope.edit_model[permission] & num;
	}

	$scope.$on('components/guild/rank/init',function(ev,data)
	{
		guild_id = data.guild_id;
		$scope.view.url = 'guild/'+data.guild_id;
		$scope.new.url = 'guild/'+data.guild_id + '/ranks';
		$scope.edit.url = 'guild/'+data.guild_id + '/ranks';
		$timeout(function()
		{
			$scope.view.load();
		},100);
	});

});