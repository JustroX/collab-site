var moduleEditor;

app.controller("moduleEditorController",function($scope,$http,$location)
{
	var toolbarOptions = [
		  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
		  ['bold', 'italic', 'underline', 'link'],        // toggled buttons
		  ['blockquote', 'code-block'],

		  [{ 'list': 'ordered'}, { 'list': 'bullet' }],


		  ['clean']                                         // remove formatting button
		];
		
	moduleEditor = new Quill('#editor-module', {
		 modules: {
		    syntax: true,              // Include syntax module
		    toolbar: toolbarOptions  // Include button in toolbar
		  },
		theme: 'snow',
	});

	$http.get('/auth/login').then((res)=>
	{
		if(!(res.data == true))
			$location.path("/");
	});

	$scope.show_testcases = function()
	{
		UIkit.modal('#modal-challenge-testcases').show();
	}


	$scope.edit_title = function()
	{
		UIkit.modal('#modal-module-title').show();
	}

	$scope.edit_badges = function()
	{
		UIkit.modal('#modal-module-badge').show();
	}
	$scope.badge_forge = function()
	{
		UIkit.modal('#modal-badge-forge').show();
	}
});
