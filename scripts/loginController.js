app.controller("loginController", function($scope,$location,$http)
{

	$http.get('/auth/login').then((res)=>
	{
		if(res.data === 'true')
			$location.path("/dashboard");
	});
	let form = 
	{
		email: "",
		password: "",
		message : "",
		error: ""
	};

	$scope.form = form;

	$scope.login = function()
	{
		$http.post('/auth/login',form).then((res)=>
		{
			res = res.data;
			if(res.err)
			{
				form.message = "";
				form.error = res.err;
			}
			else
			{
				form.error =  "";
				form.message = res.message;
				$location.path("/dashboard");
			}
		});
	}

});