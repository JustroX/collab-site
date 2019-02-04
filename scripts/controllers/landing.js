app.controller("landingController",function($scope,$http,$location,$timeout,$rootScope,apiService,schemaService,modelService,utilService,subpageService,session)
{
	$scope.$on('ready',function()
	{
		let  user  = session.getUser();
		$scope.user = user;
		if(user)
		{
			$location.path('/dashboard');
		}

	});
	$scope.logged = function()
	{
		session.load(function()
		{
			user = session.getUser();
			$scope.user = user;
			$location.path('/dashboard');
		});
	}

	$scope.logout = function()
	{
		$http.get("/auth/logout").then(function()
		{
			session.end();
			$location.path('/');
		});
	}
});