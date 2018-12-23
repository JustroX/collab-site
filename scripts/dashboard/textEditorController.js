app.controller("textEditorController",function($scope,$http,$location,$timeout)
{
	var editor =
	{
		id: "text-editor",
		active: false,
		content: "",
		quill : null,
		content: "",
		is_empty: function()
		{
			return  editor.content == "<p><br></p>"
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
			editor.quill = new Quill('#'+editor.id, {
				 modules: {
				    syntax: true,
				    toolbar: toolbarOptions
				  },
				theme: 'snow',
			});
			editor.quill.on('text-change',()=>
			{
				editor.content = editor.quill.root.innerHTML;
			})
		},
		toggle: function()
		{
			editor.active = !editor.active
			if(editor.active) editor.focus();
		},
		focus: function()
		{
			$timeout(function()
			{
				editor.quill.blur()
				editor.quill.focus()
			},1);
		},
	}

	$scope.editor = editor;

	$scope.post   = post;
	var post = 
	{
		content: '',
		group: null
	}


	$timeout(editor.init , 1);
});