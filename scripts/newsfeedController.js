var comment_editor;
app.controller("newsfeedController", function($scope,$location,$http)
{
	$scope.logout = function()
	{
		$http.get('/auth/logout').then((res)=>
		{
			$location.path('/');
		});
	}

	$scope.view_details = function()
	{
		var toolbarOptions = [
		  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
		  ['bold', 'italic', 'underline', 'link'],        // toggled buttons
		  ['blockquote', 'code-block'],

		  [{ 'list': 'ordered'}, { 'list': 'bullet' }],


		  ['clean']                                         // remove formatting button
		];
		
		UIkit.modal('#modal-post-details').show();
		if(!comment_editor)
		comment_editor = new Quill('#editor-comment', {
			 modules: {
			    syntax: true,              // Include syntax module
			    toolbar: toolbarOptions  // Include button in toolbar
			  },
			theme: 'snow',
		});
	
	}
});