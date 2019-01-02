app.controller("pageNavigationNavbarController",function($scope,$rootScope,$location,session)
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
});