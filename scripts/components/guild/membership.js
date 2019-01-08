app.controller("guildMembershipController",function($scope,$http,$location,$timeout,session,apiService,$rootScope)
{
	let guild_id;
	$scope.model = {};
	$scope.view = apiService.view("",$scope);
	$scope.new = apiService.new("",$scope,"new_member");
	$scope.edit = apiService.edit("",$scope,"rank_model");
	$scope.delete = apiService.delete("",$scope);
	$scope.delete_confirm = false;

	$scope.new_member = {};
	$scope.selected_user = {};

	$scope.rank_model = {};

	$scope.update_privileges = function(m)
	{
		$scope.edit.view.target  = m._id;
		$scope.rank_model = { rank: m.ranks[0] };
		$timeout(function()
		{
			$scope.edit.submit();
		},100);
	}

	$scope.$on('components/guild/membership/init',function(ev,data)
	{
		guild_id = data.guild_id;
		$scope.view.url = 'guild/'+data.guild_id;
		$scope.new.url = 'guild/'+data.guild_id+'/members';
		$scope.delete.url = 'guild/'+data.guild_id+'/members';
		$scope.edit.url = 'guild/'+data.guild_id+'/members';
		$scope.edit.view = {};
		$timeout(function()
		{
			$scope.view.load();
		},100);
	});

	$scope.new.validate = function()
	{	
		return $scope.new_member.user;
	};

	$scope.new.success = function()
	{	
		$scope.new_member = { user: "" };
		$scope.selected_user = {};
		UIkit.notification({
		    message: 'User added.',
		    status: 'success',
		    pos: 'top-right',
		    timeout: 5000
		});
		$scope.view.load();
	};

	$scope.edit.success = function()
	{	
		$scope.new_member = { user: "" };
		$scope.selected_user = {};
		UIkit.notification({
		    message: 'User rank updated.',
		    status: 'success',
		    pos: 'top-right',
		    timeout: 5000
		});
		$scope.view.load();
	};

	$scope.delete.success = function()
	{	
		UIkit.notification({
		    message: 'User deleted.',
		    status: 'success',
		    pos: 'top-right',
		    timeout: 5000
		});
		$scope.view.load();
	};

	$scope.select_user  = function(u)
	{
		$scope.search.query = "";
		$timeout(function()
		{
			$scope.new_member = { user: u._id };
			$scope.selected_user = u;
		},1);
	}
	$scope.delete_user = function(u)
	{
		if($scope.delete_confirm)
		{
			if($scope.delete.target == u._id)
			{
				$timeout(function() {
					$scope.delete.delete();
				},1);
			}
			else
			$scope.delete.target = u._id;
		}
		else
		{
			$scope.delete.target = u._id;
			$scope.delete_confirm = true;
		}
	}

	$scope.search  = 
	{
		timer: 0,
		wait: function()
		{
			$scope.search.timer +=1;
			if($scope.search.timer == 2)
				$rootScope.$broadcast("component/user/search",{query: $scope.search.query});
			else
			if($scope.search.timer < 3)
				$timeout(function(){$scope.search.wait();},300);

		}
	};


	$scope.searchtry = function()
	{
		$scope.search.timer = 0;
		if(!$scope.search.waiting)
		{
			$scope.search.wait();
		}
	}


});