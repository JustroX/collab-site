var mongoose  = require('mongoose');
var Schema = mongoose.Schema;
var fs = require('fs');


module.exports.init = function()
{
	if(!global.divider)
	{
		global.divider = 
		{
			MODELS : {},
			DEFINITIONS : {}			
		}
	}
	let model_index = require("./model_index.js").models;
	let old_model = fs.readFileSync("./views/models/index.ejs", "utf8");

	for(let model of model_index)
	{
		global.divider.DEFINITIONS[model] = require("./"+model.toLowerCase()+".js");
	}
	if(true || old_model!=JSON.stringify(model_index))
	{
		console.log("DIVIDER: Models have been modified.");

		console.log("DIVIDER: exporting model index");
		fs.writeFileSync('./views/models/index.ejs', JSON.stringify(model_index), 'utf8');
		

		for(let i in global.divider.DEFINITIONS)
		{
			let obj = {};
			

			obj.permissions = global.divider.DEFINITIONS[i].permissions;
			obj.required = global.divider.DEFINITIONS[i].required;
			obj.populate = global.divider.DEFINITIONS[i].populate;


			console.log("DIVIDER: exporting "+i+" model");
			fs.writeFileSync('./views/models/'+i.toLowerCase()+'.ejs', JSON.stringify(obj), 'utf8');
		}
	}



	for(let i in global.divider.DEFINITIONS)
	{
		let model = global.divider.DEFINITIONS[i];
		let ModelSchema = new Schema(model.schema,model.config);

		//methods
		for(let i in model.methods)
		    ModelSchema.methods[i]  =	model.methods[i];

		//virtuals
		for(let i in model.virtual)
			ModelSchema.virtual(i).get(model.virtual[i].get).set(model.virtual[i].set);

		ModelSchema.statics.defaultPermission = function()
		{
			return model.default.permission;
		}
		ModelSchema.statics.selfPermission = function()
		{
			return model.default.self;
		}

		let mongoose_model = mongoose.model(i, ModelSchema); 
		mongoose_model.config = { PERMISSIONS: model.permissions , POPULATE: model.populate , endpoints: model.endpoints };
		global.divider.MODELS[i] = mongoose_model;
	}
}


module.exports.model = function(name)
{
	let model = global.divider.DEFINITIONS[name];
	if(!model) throw new Error("Model is not defined");
	return global.divider.MODELS[name];
}