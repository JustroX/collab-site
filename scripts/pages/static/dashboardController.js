app.controller("staticDashboardController",function($scope,$http,$location,session)
{
	$http.get('/auth/login').then((res)=>
	{
		if(!(res.data == true))
			$location.path("/");
		session.init();
	});
	
});