app.controller("challengeViewController",function($scope,$http,$location,$timeout,apiService,editorService)
{
	let api = apiService.view("challenge",$scope);
	$scope.api    = api;

	$scope.api.success = function(res,cb)
	{
		try
		{
			res.content = editorService.toHTML(JSON.parse(res.content));
		}
		catch(err)
		{
			console.log(err);
			console.log("Parsing error");
		}
		$timeout(function()
		{
			$scope.api.value = res;
			$timeout(function()
			{
			   $('pre.ql-syntax').each(function(i, e) {hljs.highlightBlock(e)});
			   cb();
			},1);
		},1);
	}

	$scope.$on('components/challenge/view',function(ev,data)
	{
		$scope.api.target = data._id;
		$scope.api.load();
	});
});