app.controller("rootController",function($scope,$http,$location,$timeout,$rootScope,schemaService,session)
{
	schemaService.init(function()
	{
		session.load(function()
		{
			$scope.$broadcast('ready');
			$scope.SESSION_USER = session.getUser();
			$rootScope.$on('$routeChangeSuccess', function (next, last) {
				$timeout(function()
				{
					$scope.$broadcast('ready');
				},10);
			});
		});
	});

});