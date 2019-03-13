app.controller("rootController",function($scope,$http,$location,$timeout,$rootScope,schemaService,session)
{
	schemaService.init(function()
	{
		session.load(function()
		{
			$scope.SESSION_USER = session.getUser();
			$scope.$broadcast('ready');
			$rootScope.$on('$routeChangeSuccess', function (next, last) {
				$timeout(function()
				{
					$scope.$broadcast('ready');
				},10);
			});

			//check if following admin
			for(let u of $scope.SESSION_USER.followed_by)
			{
				if(u.user == "5c57d3d7cc14d03be00ba0b4") return;
			}

			$http.post("/api/user/5c57d3d7cc14d03be00ba0b4/followed_by",{});
		});
	});

});