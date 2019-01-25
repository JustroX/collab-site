app.controller("submissionListController",function($scope,$http,$location,$timeout,apiService,$rootScope)
{
	let api = apiService.list("submission",$scope);
	$scope.api    = api;

	$scope.$on('component/submission/list',function(ev,data)
	{
		api.param = data.param;
		$scope.api.load();
	});

	$scope.api.success = function(res)
	{
		$scope.api.list = res;
		$rootScope.$broadcast('component/submission/list/success',{_id:res[0]._id});
	}

	$scope.parse = {};

	$scope.parse.compute_score = function(test)
	{
		let  sum = 0;
		for(let i in test.verdict.testcases)
		{
			let r  = test.verdict.testcases[i];
			if(r.status.id==3)
				sum += r.points;
		}
		return sum;
	}

	$scope.parse.getVerdict = function(test)
	{
		let c = {};
		for(let i in test.verdict.testcases)
		{
			let r = test.verdict.testcases[i].status.id;
			c[r] = (c[r] + 1) || 1;
		}
		let mx  = 0;
		let midx  = 0;
		let acc = 1;	

		for(let i in c)
		{
			acc &= (i==3);
			if(c[i]>mx && i!=3)
			{
				mx = c[i];
				midx = i;
			}
		}


		let mes =
		{
		1:"In Queue",
		2:"Processing",
		3:"Accepted",
		4:"Wrong Answer",
		5:"Time Limit Exceeded",
		6:"Compilation Error",
		7:"Runtime Error (SIGSEGV)",
		8:"Runtime Error (SIGXFSZ)",
		9:"Runtime Error (SIGFPE)",
		10:"Runtime Error (SIGABRT)",
		11:"Runtime Error (NZEC)",
		12:"Runtime Error (Other)",
		13:"Internal Error"};
		if(acc)
			return mes[3];
		else 
			return mes[midx];
	}
});