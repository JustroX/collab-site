app.controller("staticInvitationController",function($scope,$http,$location,ukAnimate,subpageService,$timeout)
{
	$scope.subpage = subpageService.Page();

	$scope.parent_api = { user: {}};
	$scope.parent_api.signup = 
	{
		success: function(res)
		{
			$scope.subpage.goto("register-edit");
			$scope.subpage.goto("register-edit/2");
			ukAnimate.play("#static-invitation-register","uk-animation-slide-bottom-small uk-animation-reverse",function()
			{
				$http.get('/api/user/self').then(function(res)
				{
					// ukAnimate.play("#component-user-edit-2","uk-animation-slide-bottom-small",function(){});
					res = res.data;
					$scope.$broadcast("component-user-edit-load",{ _id : res._id });
				});
			});
			
		}
	}
	$scope.parent_api.edit = 
	{
		success: function(res)
		{
			$scope.gotoDone();	
		}
	}

	// ukAnimate.play("#static-invitation-main","uk-animation-slide-bottom-small");


	$scope.gotoMain = function()
	{
		ukAnimate.play("#static-invitation-register","uk-animation-slide-bottom-small uk-animation-reverse",function()
		{
			$scope.subpage.goto("main");
		});
	}

	$scope.gotoRegister = function()
	{
		ukAnimate.play("#static-invitation-main","uk-animation-slide-bottom-small uk-animation-reverse",function()
		{
			$scope.subpage.goto("register");
		});
	}

	$scope.gotoPage2 = function()
	{
		ukAnimate.play("#component-user-edit-1","uk-animation-slide-bottom-small uk-animation-reverse",function()
		{
			$scope.subpage.goto('register-edit/2');
			ukAnimate.play("#component-user-edit-2","uk-animation-slide-bottom-small",function(){});
		});
	}

	
	$scope.gotoPage1 = function()
	{
		ukAnimate.play("#component-user-edit-2","uk-animation-slide-bottom-small uk-animation-reverse",function()
		{
			$scope.subpage.goto('register-edit/1');
			ukAnimate.play("#component-user-edit-1","uk-animation-slide-bottom-small",function(){});
		});
	}

	$scope.gotoDone = function()
	{
		ukAnimate.play("#component-user-edit-2","uk-animation-slide-bottom-small uk-animation-reverse",function()
		{
			$scope.subpage.goto("done");
			ukAnimate.play("#static-invitation-done-1","uk-animation-slide-bottom-small",function(){});
		});
	}

	$http.get('/auth/login').then((res)=>
	{
		res = res.data;
		if(res)
			$http.get('/api/user/self').then(function(res)
			{
				res = res.data
				if(res.name)
				{
					$location.path("/dashboard");
				}
				else
				{
					$scope.gotoRegister();
					$scope.subpage.goto('register-edit/2');
					ukAnimate.play("#component-user-edit-2","uk-animation-slide-bottom-small",function(){});
					$http.get('/api/user/self').then(function(res)
					{
						res = res.data;
						$scope.$broadcast("component-user-edit-load",{ _id : res._id });
					});
				}
			});
		else
			$scope.subpage.goto("main");
		
	})


	
});