

app.controller("dashboardController",function($scope,$http,$location)
{

	$http.get('/auth/login').then((res)=>
	{
		if(!(res.data == true))
			$location.path("/");
	});

	$scope.onload_newsfeed = function()
	{
		// $('pre.code').each(function(i, block) {
		//     hljs.highlightBlock(block);
		//     alert('ere');
		// });
		// hljs.initHighlighting();

		// hljs.configure({   // optionally configure hljs
		//   languages: ['javascript', 'ruby', 'python']
		// });
		var toolbarOptions = [
		  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
		  ['bold', 'italic', 'underline', 'link'],        // toggled buttons
		  ['blockquote', 'code-block'],

		  [{ 'list': 'ordered'}, { 'list': 'bullet' }],


		  ['clean']                                         // remove formatting button
		];
		quill = new Quill('#editor', {
			 modules: {
			    syntax: true,              // Include syntax module
			    toolbar: toolbarOptions  // Include button in toolbar
			  },
			theme: 'snow',
		});
	}
});
