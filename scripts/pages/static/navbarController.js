app.controller("staticNavbarController", function($scope,$location,$http)
{
	$scope.logout = function()
	{
		$http.get('/auth/logout').then((res)=>
		{
			$location.path('/');
		});
	}
});