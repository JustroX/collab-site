app.controller("badgeController",function($scope,$http,$location,$timeout,$rootScope,apiService,schemaService,modelService,utilService,subpageService,session,$sanitize,$routeParams)
{
	const subpage=subpageService.Page();
	const models = schemaService.getModels();

	apiService.free();
	modelService.free();
	


	$scope.subpage  = subpage;
	$scope.moment = moment;


	$scope.$on('ready',function()
	{
		badgeList.config.param =  "created_by="+$scope.SESSION_USER._id ;
		badgeList.load();
	});


	let badgeList = apiService.new({ id: "badge-list" , model: "badge" , method: "list"});
	let badgeNew  = apiService.new({ id: "badge-new" , model: "badge" , method: "post" });
	let badge     = modelService.new({ id: "badge" , model: "badge" });

	badgeNew.on("success",function()
	{
		badgeList.load();
	});

	badgeList.on("selected",function(u)
	{
		badge.load(u._id);
	});

	badge.on("loaded",function()
	{

	});
	badge.on("saved",function()
	{
		badgeList.load();
	});
	badge.on("deleted",function()
	{
		badge.value.model = {};
		badgeList.load();
	});

	$scope.temp = {};
	$scope.image_change = function()
	{
		var preview = document.getElementById('badge-preview');
	    var file    = document.getElementById('badge-input').files[0];
	    var reader  = new FileReader();
  
  	    reader.addEventListener("load", function () {
  	      preview.src = reader.result;
  	      let img = new Image();
  	      img.onload = function()
  	      {
	          var canvas = document.createElement('canvas'),
		            max_size = 544,// TODO : pull max size from a site config
		            width = img.width,
		            height = img.height;
		        if (width > height) {
		            if (width > max_size) {
		                height *= max_size / width;
		                width = max_size;
		            }
		        } else {
		            if (height > max_size) {
		                width *= max_size / height;
		                height = max_size;
		            }
		        }
		        canvas.width = width;
		        canvas.height = height;
		        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
		        var dataUrl = canvas.toDataURL('image/jpeg');
			  badge.value.model.asset = ""+ dataUrl;
  	      }

  	      img.src = reader.result;

  	    }, false);
  
  	    if (file) {
  	      reader.readAsDataURL(file);
	    }

	}
});