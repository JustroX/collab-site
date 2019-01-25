app.controller("submissionViewController",function($scope,$http,$location,$timeout,apiService,$rootScope,editorService)
{
	$scope.parent  = $scope.api;
	let api = apiService.view("submission",$scope);
	$scope.api    = api;

	$scope.parse = {};

	$scope.parse.compute_score = function(test)
	{
		let  sum = 0;
		if(!(test && test.verdict)) return;
		for(let i in test.verdict.testcases)
		{
			let r  = test.verdict.testcases[i];
			if(r.status.id==3)
				sum += r.points;
		}
		return sum;
	}

	$scope.parse.compute_total =function(test)
	{
		let  sum = 0;
		if(!(test && test.verdict)) return;
		for(let i in test.verdict.testcases)
		{
			let r  = test.verdict.testcases[i];
			sum += r.points;
		}
		return sum;	
	}

	$scope.parse.getVerdict = function(test)
	{
		let c = {};
		if(!( test && test.verdict)) return;
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
	
	$scope.$on('components/submission/view',function(ev,data)
	{
		$scope.api.target = data._id;
		$scope.api.success = function(res,cb)
		{

			try
			{
				res.content = "<pre class='ql-syntax'>" + atob(res.content).replace('<','&lt').replace('>','&gt') + "</pre>" ;
			}
			catch(err)
			{
				console.log("Parsing error");
			}

			for(let i in res.verdict.testcases)
			{
				let body_output = res.verdict.testcases[i];

				if(body_output.stderr)
				body_output.stderr = atob(body_output.stderr);

				if(body_output.compile_output)
				body_output.compile_output = atob(body_output.compile_output);

				if(body_output.status.id < 6)
					body_output.stdout = atob(body_output.stdout);
			}




			$timeout(function()
			{
				$scope.api.value = res;
				$rootScope.$broadcast('components/submission/view/success');
				$timeout(function()
				{
				   $('pre.ql-syntax').each(function(i, e) {hljs.highlightBlock(e);e.style.minHeight="30vh"});
				   cb();
				},1);
			},1);

		}
		$scope.api.load();
	});
});