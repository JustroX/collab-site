app.service('session', function($http,$timeout) 
{
	let user ;
	$http.get('/api/user/self').then((res)=>
	{
		res = res.data;
		if(res.err) return console.log(res.err);
		user = res;
	});

	let onready = function(_f)
	{
		if( user )
			_f();
		else
			$timeout(function(){onready(_f);},3);
	};

	this.getUser = function(){return user;}

	this.onready = onready;

});


