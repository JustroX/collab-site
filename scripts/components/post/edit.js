app.controller("postEditController",function($scope,$http,$location,$timeout,session)
{
	let post = { content: '', group: '5c226f60a51750466819b85f'};
	let api = 
	{
		loading: false,
		error: '',
		submit: function()
		{
			if(!api.validate())
			{
				api.error = "Can't update an empty content.";
				return;
			}	
			api.error = '';
			api.loading = true;
			$http.put('/api/post/'+api.view.target,$scope.post).then((res)=>
			{
				res = res.data;
				post.content = '';
				// editor.quill.setText('');
				api.loading = false;
				if(res.err)
					return api.err(res.err);
				api.success(res)
			});
		},
		err: function(mes)
		{
			api.error = mes;
			console.log("API ERROR: "+mes);
		},
		validate: function()
		{
			return post.content !='<p><br></p>';
		},
		success: function(res)
		{
			if($scope.parent_api)
				$scope.parent_api.edit.success(res);
		}
	};
	let view =
	{
		loading: false,
		error: '',
		target: '',
		param: '',
		load: function()
		{
			session.onready(function()
			{
				view.loading = true;
				$http.get('/api/post/'+view.target+'?'+view.param).then((res)=>
				{
					view.load_options();
					res = res.data;
					view.loading = false;
					if(res.err)
						return view.err(res.err);
					view.success(res);
				});
			});
		},
		load_options: function()
		{
			$http.get('/api/post?options=true').then((res)=>
			{
				res = res.data;
				view.options = res;
			});
		},
		err: function(mes)
		{
			view.error = mes;
			console.log("API ERROR: "+mes);
		},
		success: function(res)
		{
			$timeout(function()
			{
				$scope.post = res;
			},1);
		},
	}

	api.view =  view;

	$scope.post = post;
	$scope.api = api;



});