app.controller("postViewController",function($scope,$http,$location,$timeout,session)
{
	let api = 
	{
		loading: false,
		error: '',
		value: null,
		target: '',
		param: '',
		load: function()
		{
			session.onready(function()
			{
				api.loading = true;
				$http.get('/api/post/'+api.target+'?'+api.param).then((res)=>
				{
					api.load_options();
					res = res.data;
					api.loading = false;
					if(res.err)
						return api.err(res.err);
					api.success(res);
				});
			});
		},
		load_options: function()
		{
			$http.get('/api/post?options=true').then((res)=>
			{
				res = res.data;
				api.options = res;
			});
		},
		err: function(mes)
		{
			api.error = mes;
			console.log("API ERROR: "+mes);
		},
		success: function(res)
		{
			api.value = res;
		},
	}

	$scope.api    = api;
});