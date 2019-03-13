app.controller("navbarController",function($scope,$http,$location,$timeout,$rootScope,apiService,schemaService,modelService,utilService,subpageService,session,$sanitize,$routeParams)
{
	const subpage=subpageService.Page();
	const models = schemaService.getModels();

	apiService.free();
	modelService.free();
	


	$scope.subpage  = subpage;
	$scope.moment = moment;


	$scope.$on('ready',function()
	{

	});


	let invitationNew = apiService.new({ id: "invitation-new" , model: "invitation", method: "post" });

	$scope.invitation = {};

	$scope.invite = function()
	{
		UIkit.modal("#modal-invitation").show();
		$scope.invitation  = {};
	}

	invitationNew.on("success",function(res)
	{
		$scope.invitation.link  = window.location.protocol +"//"+ window.location.host + "/#!/invitation/" + res._id;
	});

	
	$scope.logout = function()
	{
		$http.get('/auth/logout').then((res)=>
		{
			session.end();
			$location.path('/');
		});
	}


	let userList = apiService.new({ id: "user-search" , model: "user", method: "list", limit: 3 });
	$scope.query=  "";
	$scope.search  = 
	{
		timer: 0,
		wait: function()
		{
			$scope.search.timer +=1;
			if($scope.search.timer == 2)
			{
				userList.config.param = "fullname=rx_"+$scope.search.query;
				userList.load();
			}
			else
			if($scope.search.timer < 3)
				$timeout(function(){$scope.search.wait();},300);

		}
	};


	$scope.searchtry = function()
	{
		$scope.search.timer = 0;
		if(!$scope.search.waiting)
		{
			$scope.search.wait();
		}
	}

});