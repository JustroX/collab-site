app.controller("postViewController",function($scope,$http,$location,$timeout,session,apiService,editorService)
{
	let api = apiService.view("post",$scope);
	$scope.api    = api;

	$scope.api.success = function(res,cb)
	{
		try
		{
			res.content = editorService.toHTML(JSON.parse(res.content));
			for(let i in res.replies)
			{
				try
				{
					res.replies[i].content = editorService.toHTML(JSON.parse(res.replies[i].content));
				}
				catch(err)
				{
					console.log("Parsing error for replies");
				}
			}
		}
		catch(err)
		{
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
	 
	$scope.$on('components/post/view/init',function(ev,data)
	{
		$scope.api.target = data._id;
		$scope.api.load(data.cb);
	});
});