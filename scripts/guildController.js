app.controller("guildController",function($scope,$http,$location)
{

	$http.get('/auth/login').then((res)=>
	{
		if(!(res.data == true))
			$location.path("/");
	});
});
