app.controller("moduleListController",function($scope,$http,$location,$timeout,session)
{
	let api = 
	{
		loading: false,
		error: '',

		limit: 10,
		page: 0,
		options: null,

		list: [],
		param : '',

		load: function()
		{
			session.onready(function()
			{
				api.loading = true;
				$http.get('/api/module?limit='+api.limit+'&offset='+api.page+'&'+api.param).then((res)=>
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
			$http.get('/api/module?options=true').then((res)=>
			{
				res = res.data;
				api.options = res;
			});
		},
		next()
		{
			api.page+=1;
			api.load();
		},
		prev()
		{
			api.page = (api.page < 0) ? 0 : (api.page - 1);
			api.load();
		},

		err: function(mes)
		{
			api.error = mes;
			console.log("API ERROR: "+mes);
		},
		success: function(res)
		{
			api.list = res;
		},
		init: function()
		{
			session.onready(function()
			{
				api.param = '';
				api.load();
			});
		}
	}

	$scope.api    = api;
});