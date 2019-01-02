app.controller("pageUserEditController",function($scope,$http,$location,$timeout,session)
{
	$scope.visible = { personal: false};
	session.onready(function()
	{
		console.log("wew");
		$timeout(function()
		{
			$scope.$broadcast("component-user-edit-load",{_id: session.getUser()._id });
		},3);
	});

	$scope.$on("component/user/edit/load/success",function(res)
	{
		console.log('wew2')
		$scope.visible.personal = true;
	});
	$scope.$on("component/user/edit/save/success",function(res)
	{
		UIkit.notification({
		    message: 'Settings Saved!',
		    status: 'success',
		    pos: 'top-right',
		    timeout: 5000
		});
	});
});