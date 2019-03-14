app.controller("moduleViewController",function($scope,$http,$location,$timeout,$rootScope,apiService,schemaService,modelService,utilService,subpageService,session,$sanitize,$routeParams,judgeService)
{
	const subpage=subpageService.Page();
	const models = schemaService.getModels();
	$scope.subpage  = subpage;
	$scope.moment = moment;

	apiService.free();
	modelService.free();

	$scope.module  = modelService.new({id:"module-model",model:"module"});
	$scope.module_id = $routeParams.id;

	let loaded  =false;

	$scope.$on('ready',function()
	{
		if(!loaded)
		{
			$scope.module.load($routeParams.id);
			load_pages(function()
			{
				$scope.access_page($routeParams.page);
			});
			submissionList.load();
		}

		loaded = true;
	});

	$scope.hide_offcanvas = function()
	{
		UIkit.offcanvas('#module-sidebar').hide();
		UIkit.offcanvas('#module-sidebar').hide();
	}

	//pages
	$scope.pages = [];
	$scope.pages_loading =false;

	let pages_article_loaded = false;
	let pages_challenge_loaded = false;

	//page
	let articleList   = apiService.new({ id: "module-article-list" , url: "module/"+$routeParams.id+"/articles", model: "module", method: "list" });
	let challengeList = apiService.new({ id: "module-challenge-list" , url: "module/"+$routeParams.id+"/challenges", model: "module", method: "list" });

	articleList.on("success",function(res)
	{
		for(let i in res)
			res[i].type = "article";
		$scope.pages.push(...res);
		pages_article_loaded = true;

		if(pages_article_loaded && pages_challenge_loaded)
			all_loaded();
	});
	challengeList.on("success",function(res)
	{
		for(let i in res)
			res[i].type = "challenge";		
		$scope.pages.push(...res);
		pages_challenge_loaded = true;

		if(pages_article_loaded && pages_challenge_loaded)
			all_loaded();
	});

	function all_loaded()
	{
		$scope.pages_loading = false;
		$scope.pages.sort( (a,b)=> a.page-b.page );
		// for(let i in $scope.pages)
		// 	$scope.pages[i].page = i;
		load_pages_cp && load_pages_cp();
	}

	let load_pages_cp ; 
	function load_pages(c)
	{
		load_pages_cp = c;
		pages_article_loaded = false;
		pages_challenge_loaded = false;
		$scope.pages = [];
		$scope.pages_loading = true;
		articleList.load();
		challengeList.load();
	}

	let access_models = 
	{
		article  : modelService.new({ id: "article-model", model: "article" }),
		challenge  : modelService.new({ id: "challenge-model", model: "challenge" }),
	};

	//view pages
	$scope.page = 0;
	$scope.access_page = function(i)
	{
		window.location.hash = "!/module/"+$routeParams.id+"/view/"+i;
		UIkit.offcanvas('#module-sidebar').hide();
		let page = $scope.pages[i];
		$scope.page = parseInt(i);
		subpage.goto(page.type);
		access_models[page.type].load(page.content._id);
 	}

 	let render_a ,render_c;
 	$scope.get_renderer_a = function(r){ render_a = r; };
 	$scope.get_renderer_c = function(r){ render_c = r; };

 	access_models.article.on("loaded",function()
 	{
 		render_a();
 	});

 	$scope.languages = [];
 	$scope.submission_new_model = {};

	$scope.language_codes = 
	{
		"python2" : "Python 2",
		"python3" : "Python 3",
		"cpp" : "C++",
		"c" : "C",
	}
 	access_models.challenge.on("loaded",function()
 	{
 		$scope.languages = access_models.challenge.value.model.settings.languages;
 		$scope.submission_new_model.language = $scope.languages[0];
 		$scope.change_language($scope.submission_new_model.language);
 		render_c();

 		for(let i=0; i< access_models.challenge.value.model.testcases.length ; i++)
 			if( !access_models.challenge.value.model.testcases[i].sample  )
 				access_models.challenge.value.model.testcases.splice(i--,1);

 	});

 	$scope.page_next = function()
 	{
 		$scope.access_page($scope.page + 1);
 	}
 	$scope.page_prev = function()
 	{
 		$scope.access_page($scope.page - 1);
 	}

 	let code_editor;

 	$scope.get_editor  =function(c)	{ code_editor  = c ;};
 	$scope.change_language = function(l)
 	{
 		code_editor.language_change(l);
 	}

 	$scope.run = {};



 	$scope.run_code  =function()
 	{
		$scope.run.error = "";
		scrollTo("scroll-run-results");
		if($scope.submission_new_model.content=="")
		{
			$scope.run.error ="Code can not be blank";
			return
		}
		let data = 
		{
			content: $scope.submission_new_model.content,
			language: $scope.submission_new_model.language,
			inputs: [],
			outputs: [],
			_ids: [],
		};

		for(let i in access_models.challenge.value.model.testcases)
		{
			data.inputs.push(btoa(access_models.challenge.value.model.testcases[i].input) );
			data.outputs.push(btoa(access_models.challenge.value.model.testcases[i].output) );
			data._ids.push(access_models.challenge.value.model.testcases[i]._id);
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

 	//submission
	let submissionNew = apiService.new({ id: "submission-new", model: "submission" , method: "post" });

	let submission = modelService.new({ id: "submission", model: "submission" });

	submissionNew.on("success",function(res)
	{
		UIkit.modal("#modal-submission-confirm").hide();
		submissionList.load();

		UIkit.switcher("#switcher-submission").show(1);
		scrollTo("switcher-submission");
		submission.load(res._id);
	});

	let submissionList = apiService.new({ id: "submission-list", model: "submission", method: "list" });
	submissionList.on("selected",function(u)
	{
		submission.load(u._id);
	});

	$scope.submit_solution = function()
	{
		let model  = 
		{
			content : btoa($scope.submission_new_model.content) ,
		    challenge: access_models.challenge.value.model._id,
		    language: $scope.submission_new_model.language,
		};

		submissionNew.load(model);
	}

		$scope.parse = {};

	$scope.parse.compute_score = function(test)
	{
		if(!test.verdict) return;
		let  sum = 0;
		for(let i in test.verdict.testcases)
		{
			let r  = test.verdict.testcases[i];
			if(r.status.id==3)
				sum += r.points;
		}
		return sum;
	}


	$scope.parse.compute_total =function(test)
	{
		if(!test.verdict) return;
		let  sum = 0;
		if(!(test && test.verdict)) return;
		for(let i in test.verdict.testcases)
		{
			let r  = test.verdict.testcases[i];
			sum += r.points;
		}
		return sum;	
	}


	$scope.parse.getVerdict = function(test)
	{
		if(!test.verdict) return;
		let c = {};
		for(let i in test.verdict.testcases)
		{
			let r = test.verdict.testcases[i].status.id;
			c[r] = (c[r] + 1) || 1;
		}
		let mx  = 0;
		let midx  = 0;
		let acc = 1;	

		for(let i in c)
		{
			acc &= (i==3);
			if(c[i]>mx && i!=3)
			{
				mx = c[i];
				midx = i;
			}
		}


		let mes =
		{
		1:"In Queue",
		2:"Processing",
		3:"Accepted",
		4:"Wrong Answer",
		5:"Time Limit Exceeded",
		6:"Compilation Error",
		7:"Runtime Error (SIGSEGV)",
		8:"Runtime Error (SIGXFSZ)",
		9:"Runtime Error (SIGFPE)",
		10:"Runtime Error (SIGABRT)",
		11:"Runtime Error (NZEC)",
		12:"Runtime Error (Other)",
		13:"Internal Error"};
		if(acc)
			return mes[3];
		else 
			return mes[midx];
	}

	$scope.atob = function(x)
	{
		let c = "";
		try
		{
			c = atob(x);
		}
		catch(err)
		{
		}
		return c;
	}
});


function scrollTo(tag_id)
{
   $('html, body').animate({
         scrollTop: $('#'+tag_id).offset().top
    }, 'slow');
}