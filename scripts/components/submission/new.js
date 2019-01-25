function scrollTo(tag_id)
{
   $('html, body').animate({
         scrollTop: $('#'+tag_id).offset().top
    }, 'slow');
}

app.controller("submissionNewController",function($scope,$http,$location,$timeout,apiService,codeService,judgeService,$rootScope)
{

	$scope.parent = $scope.api;
	let model = 
	{
		content : "",
	   	challenge: "",
	   	language:  "",
	};


	$scope.model   = model;

	let editor = codeService.create($scope,"editor-challenge");
	editor.textchange = function()
	{
		$scope.model.content = btoa(editor.codemirror.getValue());
	}

	let api = apiService.new("submission",$scope);


	$scope.editor = editor;
	$scope.api    = api;
	$scope.api.validate = function()
	{
		return $scope.model.content !='' && $scope.model.challenge!='' && $scope.model.language!='';
	};

	$scope.api.success = function()
	{
		$rootScope.$broadcast('components/submission/new/success');
	}

	$scope.$on('components/submission/new/init',function(ev,data)
	{
		$scope.model.challenge = data._id;
		editor.init("editor-challenge");
		$timeout(function()
		{
			$scope.model.language =  $scope.parent.value.settings.languages[0];
			$scope.change_language();
		},1);
	});




	CodeMirror.modeURL = "https://codemirror.net/mode/%N/%N.js";

	$scope.change_language = function()
	{
		function change() {
		  let val = { "python2": "text/x-python","python3": "text/x-python","cpp": "text/x-c++src","c": "text/x-csrc", }[$scope.model.language], m, mode, spec;
		  if (m = /.+\.([^.]+)$/.exec(val)) {
		    var info = CodeMirror.findModeByExtension(m[1]);
		    if (info) {
		      mode = info.mode;
		      spec = info.mime;
		    }
		  } else if (/\//.test(val)) {
		    var info = CodeMirror.findModeByMIME(val);
		    if (info) {
		      mode = info.mode;
		      spec = val;
		    }
		  } else {
		    mode = spec = val;
		  }
		  if (mode) {
		    editor.codemirror.setOption("mode", spec);
		    editor.codemirror.setOption("autoRefresh", true);
		    CodeMirror.autoLoadMode(editor.codemirror, mode);
		    editor.codemirror.refresh();
		  } else {
		    alert("Could not find a mode corresponding to " + val);
		  }
		}
		 change();
	}

	$scope.run = {
		loading: false,
		results: [],
		error: "",
	};

	$scope.run_code = function()
	{
		$scope.run.error = "";
		scrollTo("scroll-run-results");
		if(model.content=="")
		{
			$scope.run.error ="Code can not be blank";
			return
		}
		let data = 
		{
			content: $scope.model.content,
			language: $scope.model.language,
			inputs: [],
			outputs: [],
			_ids: [],
		};

		for(let i in $scope.parent.value.testcases)
		{
			data.inputs.push(btoa($scope.parent.value.testcases[i].input) );
			data.outputs.push(btoa($scope.parent.value.testcases[i].output) );
			data._ids.push($scope.parent.value.testcases[i]._id);
		}

		$scope.run.loading = true;
		judgeService.judge(data,function(results)
		{
			$scope.run.loading = false;
			$scope.run.results = results;
			scrollTo("scroll-run-results");
		},function(err)
		{
		});

	}

});