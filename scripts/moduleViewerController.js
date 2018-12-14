
app.controller("moduleViewerController",function($scope,$http,$location)
{
	document.body.style.backgroundColor = "white";
	$scope.open_sidebar = function()
	{
		UIkit.offcanvas("#module-sidebar").hide();
		UIkit.offcanvas("#module-sidebar").show();
	}
});
