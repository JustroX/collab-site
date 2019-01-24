var mongoose  = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;
var Judge = require('../judge/judge.js');

var SubmissionSchema = mongoose.Schema({
	content : String,
   challenge: { type: Schema.Types.ObjectId, ref: "Challenge"},
   language: String,
   author : { type: Schema.Types.ObjectId, ref: "User"},
   verdict: { testcases: [ Object ]  }
});

SubmissionSchema.methods.get_verdict = function(res,challenge,cb)
{
	let data = 
	{
		content: this.content,
		language: this.language,
		inputs: [],
		outputs: [],
		_ids: [],
	};

	for(let i in challenge.testcases)
	{
		data.inputs.push(Buffer.from(challenge.testcases[i].input).toString('base64') );
		data.outputs.push(Buffer.from(challenge.testcases[i].output).toString('base64') );
		data._ids.push(challenge.testcases[i]._id);
	}

	Judge.judge(res,data,cb);
}

module.exports = mongoose.model('Submission', SubmissionSchema);