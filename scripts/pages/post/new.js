app.controller("pagePostNewController",function($scope,$http,$location,$timeout,session,ukAnimate)
{
	$scope.user = {};
	$scope.parent_editor =
	{
		ontoggleBreak : function(editor)
		{
			if(!editor.active)
				ukAnimate.play("#components-post-add-overlay","uk-animation-slide-bottom uk-animation-reverse",function()
				{
					editor.active = true;
					ukAnimate.play("#components-post-add-main","uk-animation-slide-bottom",function()
					{
					    editor.focus();
					});
				});
			else
				ukAnimate.play("#components-post-add-main","uk-animation-slide-bottom uk-animation-reverse",function()
				{
					editor.active = false;
					ukAnimate.play("#components-post-add-overlay","uk-animation-slide-bottom",function()
					{});
				});
		}
	}
	$scope.components = 
	{
		new: { ready: false}
	}
	session.onready(function()
	{
		$scope.user = session.getUser();
		$scope.components.new.ready = true;
	});
});