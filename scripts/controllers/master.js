app.controller("masterController",function($scope,$http,$location,$timeout,$rootScope,apiService,schemaService,modelService,utilService,subpageService,session)
{
	const subpage=subpageService.Page();
	const models = schemaService.getModels();

	$scope.subpage  = subpage;
	$scope.models = models;

	let user_list = apiService.new({id:"user-list",model:"user",method:"list"});
	let user_new  = apiService.new({id:"user-new",model:"user", method:"post"});
	let user_model = modelService.new({id:"user-model",model:"user"});

	subpage.when("dashboard/view",function()
	{
		return user_model.config.target;
	});
	user_list.on("selected",function(u)
	{
		user_model.load(u._id);
		user_model.api.put.on("success",function(){user_list.load();});
		user_model.api.delete.on("success",function(){user_list.load();});
		subpage.goto("dashboard/view");
	});
	user_new.on("success",function(res)
	{
		user_list.load();
	});


	$scope.$on('ready',function()
	{
		let  user  = session.getUser();
		$scope.user = user;
		if(!user)
			subpage.goto("login");
		else
			subpage.goto("dashboard");

		subpage.onload("login",function()
		{

		});
		subpage.onload("dashboard",function()
		{
			user_list.load();
		});

		$scope.logged = function()
		{
			session.load(function()
			{
				user = session.getUser();
				$scope.user = user;
				subpage.goto("dashboard");
			});
		}

		$scope.logout = function()
		{
			$http.get("/auth/logout").then(function()
			{
				session.end();
				subpage.goto("login");
			});
		}
	});
	$scope.temp = {};
	$scope.cbox_permit =function( model, num)
	{
		model  =model.toLowerCase()+"s";
		if(!user_model.value.model.authorization) user_model.value.model.authorization = {};
		if(!user_model.value.model.authorization[model]) user_model.value.model.authorization[model] = { all : 0};
		user_model.value.model.authorization[model].all ^= num;		
	}
	$scope.cbox_checked =function( model, num)
	{
		model  =model.toLowerCase()+"s";
		return user_model && user_model.value.model.authorization && user_model.value.model.authorization[model] && (user_model.value.model.authorization[model].all & num);
	}


	$scope.field_permission = {};

	$scope.field_permission_delete = function(k)
	{
		delete user_model.value.model.authorization[$scope.field_permission.name][k];
	};
	$scope.field_permission_add = function(k)
	{
		user_model.value.model.authorization[$scope.field_permission.name][$scope.field_permission.key] = $scope.field_permission.value;
		$scope.field_permission.key = "";
		$scope.field_permission.value = 0;
	};
});