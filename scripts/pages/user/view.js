app.controller("pageUserViewController",function($scope,$http,$location,$timeout,$rootScope,session,subpageService,$routeParams,apiService)
{
	$scope.subpage  = subpageService.Page();
	$scope.profile_user = {};
	$scope.user = {};
	$scope.model = {};
	$scope.follow  = apiService.new("",$scope);
	$scope.follow.success = function()
	{
		let arr = $scope.user.follows;
		if($scope.user.follows.includes($scope.profile_user))
			arr.splice(arr.indexOf($scope.profile_user),1);
		else
			arr.push($scope.profile_user);
	}

	$scope.subpage.onload("main",function(ev,data)
	{
		$timeout(function()
		{
			$scope.$broadcast('components/post/list',{ param: "sort=-date&author=" + $routeParams.id });
		},3);
	});

	session.onready(function()
	{
		$timeout(function()
		{
			$scope.follow.url = 'user/'+$routeParams.id +'/follow';
			$scope.profile_user = $routeParams.id;
			$rootScope.$broadcast('user/view/load',{ _id: $routeParams.id });
			$scope.user = session.getUser();
		},3);
	});

	$scope.follow_click = function()
	{
		$scope.follow.submit();
	}

	$scope.$on('page/user/view/load/failed',function(ev,data)
	{
		$scope.subpage.goto("error");
	});
	$scope.$on('page/user/view/load/success',function(ev,data)
	{
		$scope.subpage.goto("main");
	});
});