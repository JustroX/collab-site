
app.controller("moduleViewerController",function($scope,$http,$location)
{
	document.body.style.backgroundColor = "white";

	$scope.init_codebox = function()
	{
		 var editor = CodeMirror.fromTextArea(document.getElementById("editor-challenge"), {
		    lineNumbers: true,
		    keyMap: "sublime",
		    theme: "monokai",
		    mode: "python"
		  });
	}

	setTimeout(function()
	{
		$scope.init_codebox();
	},1);

});
