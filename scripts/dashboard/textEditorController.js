app.controller("textEditorController",function($scope,$http,$location,$timeout)
{
	var editor =
	{
		id: "text-editor",
		active: false,
		content: "",
		obj : null,
		is_empty: function()
		{
			return 
		},
		init: function()
		{
			var toolbarOptions = [
			  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
			  ['bold', 'italic', 'underline', 'link'],
			  ['blockquote', 'code-block'],
			  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
			  ['clean']
			];
			editor.obj = new Quill('#'+editor.id, {
				 modules: {
				    syntax: true,
				    toolbar: toolbarOptions
				  },
				theme: 'snow',
			});
		},
		getvalue: function()
		{

		}
	}

	$timeout(editor.init , 1);
});