app.controller("invitationController",function($scope,$http,$location,$timeout,$rootScope,apiService,schemaService,modelService,utilService,subpageService,session,$sanitize,$routeParams,ukAnimate)
{
	const subpage=subpageService.Page();
	const models = schemaService.getModels();

	apiService.free();
	modelService.free();
	
	$scope.subpage  = subpage;
	$scope.moment = moment;

	let invitation  = modelService.new({ model: "invitation" , id: "invitation" });

	$scope.$on('ready',function()
	{
		invitation.load($routeParams.id);
	});

	$scope.invitation = {};

	invitation.on("loaded",function()
	{
		$scope.invitation = invitation.value.model;
		if($scope.invitation.confirmed)
				window.location.href = '/';
		else
		if($scope.SESSION_USER._id && $scope.invitation.user == $scope.SESSION_USER._id)
		{
			if( $scope.SESSION_USER.username )
				window.location.href = '/';
			else
				user.load($scope.SESSION_USER._id);
		}
		else
		if($scope.invitation.user)
		{
			user.load($scope.invitation.user);			
		}
		else
		$scope.gotoMain();	
	});	
	invitation.api.get.on("error",function()
	{
		$scope.subpage.goto("error");
	});	

	let userNew = apiService.new({ model: "user", url: "user/register", id: "user-new-invite" , method: "post"  , incomplete_default: "Please make sure that your passwords match." });
	
	$scope.new_user_model = { invitation: $routeParams.id };

	let new_user = false;
	userNew.on("success",function(res)
	{
		user.load(res._id);
		new_user = true;
	});

	userNew.validate = function(m)
	{
		return m.password == m.confirm_password ;
	}

	let user  = modelService.new({ model: "user", id: "user-invite-model", dates:["birthday"] });
	let done = false;
	user.on("loaded",function()
	{
		if(done) return;
		if(new_user)
			$scope.subpage.goto('register-edit/2');
		else
			$scope.subpage.goto('register-edit/1');
	});

	let confirm_invitation =  apiService.new({ model: "invitation", method: "put", target: $routeParams.id});

	user.on("saved",function()
	{
		done = true;
		confirm_invitation.load({ confirmed : true });
	});

	confirm_invitation.on("success",function()
	{
		$scope.gotoDone();
	});


	// ukAnimate.play("#static-invitation-main","uk-animation-slide-bottom-small");


	$scope.gotoMain = function()
	{
		ukAnimate.play("#static-invitation-register",true,function()
		{
			$scope.subpage.goto("main");
		});
	}

	$scope.gotoRegister = function()
	{
		ukAnimate.play("#static-invitation-main",true,function()
		{
			ukAnimate.play("#static-invitation-register");
			$scope.subpage.goto("register");
		});
	}

	$scope.gotoPage2 = function()
	{
		user.api.put.config.feedback.error = "";
		ukAnimate.play("#component-user-edit-1",true,function()
		{
			ukAnimate.play("#component-user-edit-2");
			$scope.subpage.goto('register-edit/2');
		});
	}

	
	$scope.gotoPage1 = function()
	{
		ukAnimate.play("#component-user-edit-2",true,function()
		{
			ukAnimate.play("#component-user-edit-1");
			$scope.subpage.goto('register-edit/1');
		});
	}

	$scope.gotoDone = function()
	{
		ukAnimate.play("#component-user-edit-2",true,function()
		{
			$scope.subpage.goto("done");
			ukAnimate.play("#static-invitation-done-1");
		});
	}

	$scope.validateForm1 = function()
	{
		let m = user.value.model;
		if( m.password != m.confirm_password )
		{
			user.api.put.config.feedback.error  = "Passwords don't match.";
		}
		else
			$scope.gotoPage2();
	}

});