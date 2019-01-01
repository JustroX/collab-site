app.controller("userSignupController",function($scope,$http,$location,$timeout,session,apiService)
{
	let model = 
	{
	   username: "",
	   email: "",
	   password: "",
	   confirm_password: ""
	};

	$scope.model   = model;

	let api = 
	{
		loading : false,
		error : "",
		succ : "",
		submit: function()
		{
			let api_ = api;
			if(!api_.validatePassword())
			{
				api_.error = "Passwords do not match";
				return;
			}
			if(!api_.validate())
			{
				api_.error = "Please fill up all fields";
				return;
			}	
			api_.error = '';
			api_.loading = true;
			$http.post('/auth/signup',$scope.model).then((res)=>
			{
				res = res.data;

				api_.loaded(res);

				api_.loading = false;
				if(res.message!="Logged In")
					return api_.err(res);

				if($scope.parent_api)
					$scope.parent_api.signup.success(res);
				api_.success(res)
			});
		},
		err: function(mes)
		{
			api.error = mes;
			console.log("API ERROR: "+mes);
		},
		loaded : function(res)
		{
			;
		},
		validatePassword : function()
		{
			return $scope.model.password == $scope.model.confirm_password;
		},
		validate : function()
		{
			return $scope.model.password!="" && $scope.model.email!="" && $scope.model.username!="";
		},
		success(res)
		{

		}
	}


	$scope.api    = api;
});