app.controller("pageNavigationNavbarController",function($scope,$rootScope,$location,session,$timeout
	)
{
	$scope.invite = function()
	{
		$rootScope.$broadcast('pages/navigation/navbar/click-invite');
	}

	$scope.profile = function()
	{
		// $rootScope.$broadcast('pages/navigation/navbar/click-settings');
		$location.path("/user/"+session.getUser()._id );
	}

	$scope.settings = function()
	{
		$location.path("/user/edit" );
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