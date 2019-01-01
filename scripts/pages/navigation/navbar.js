app.controller("pageNavigationNavbarController",function($scope,$rootScope)
{
	$scope.invite = function()
	{
		$rootScope.$broadcast('pages/navigation/navbar/click-invite');
	}
});