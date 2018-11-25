
app.controller("dashboardController",function($scope,$http)
{
	setTimeout(
		function()
		{
			hljs.initHighlightingOnLoad();
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
		},1);
});
