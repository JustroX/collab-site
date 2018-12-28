app.controller("guildDeleteController",function($scope,$http,$location,$timeout,session)
{
	let api = 
	{
		target: ($scope.parent_api && $scope.parent_api.target) || "",
		loading: false,
		error: '',
		delete: function()
		{
			api.error = '';
			api.loading = true;
			$http.delete('/api/guild/'+api.target).then((res)=>
			{
				res = res.data;
				api.loading = false;
				api.target = '';
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
				$scope.parent_api.delete.success(res);
		}
	}

	$scope.api = api;
});