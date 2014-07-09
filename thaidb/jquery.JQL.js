/*
 * JQL v. 1.0 (20 May 2014)
 * Created By Earthchie (http://www.earthchie.com/)
 */
 
var JQL = function(obj){
	this.data_source = obj;
	this.buffer = obj;
	this.focused_field = '';
	this.options = [];
	this.size = false;
	
	for(var key in obj){
		for(var field in obj[key]){
			this.options.push(field);
		}
		break;
	}
	
	this.fetch = function(){
		
		if(typeof this.options == 'object'){
			var obj = {};
			for(var i in this.buffer){
				obj[i] = {};
				for(var j in this.options){
					var field = this.options[j];
					if(this.buffer[i][field]){
						obj[i][field] = this.buffer[i][field];
					}
				}
			}
			
			this.buffer = obj;
		}
		
		if(this.size){

			var temp = this.size.toString().split(',');
			
			var start = 0;
			var end = this.size;
			
			if(temp.length > 1 && temp[0] < temp[1]){
				start = parseInt(temp[0]);
				end = start + parseInt(temp[1]);
			}
			
			var results = {};
			for(var i = start; i < end; i++){
			
				if(this.buffer[i]){
					results[i] = this.buffer[i];
				}else{
					break;
				}
			}
			
			this.buffer = results;
			
		}
		
		return this.buffer;
	}
	
	this.new = function(obj){
		this.data_source = obj;
		this.buffer = obj;
	}
	
	this.limit = function(limit){
		this.size = limit;
		
		return this;
	}
	
	this.select = function(options){
		this.options = options;
		this.buffer = this.data_source;
		this.size = false;
		return this;
	}
	
	this.where = function(field){
		this.focused_field = field;
		
		return this;
	}
	
	// alias
	this.and = function(field){
		return this.where(field);
	}
	
	// sets of conditions
	
	this.contains = function(str,caseSensitive){
		if(caseSensitive == undefined){
			caseSensitive == false;
		}
		var obj = this.buffer;
		this.buffer = [];
		
		for(var i in obj){
			if(caseSensitive){
				if(~obj[i][this.focused_field].indexOf(str)){
					this.buffer.push(obj[i]);
				}
			}else{
				if(~obj[i][this.focused_field].toLowerCase().indexOf(str.toLowerCase())){
					this.buffer.push(obj[i]);
				}
			}
		}
		
		return this;
	}
	
	this.equalTo = function(val){
		var obj = this.buffer;
		this.buffer = [];
		
		for(var i in obj){
			if(obj[i][this.focused_field] == val){
				this.buffer.push(obj[i]);
			}
		}
		
		return this;
	}
	
	this.in = function(vals){
		var obj = this.buffer;
		this.buffer = [];
		
		for(var i in obj){
			if(this.in_array(obj[i][this.focused_field],vals)){
				this.buffer.push(obj[i]);
			}
		}
		
		return this;
	}
	
	this.moreThan = function(val){
		var obj = this.buffer;
		this.buffer = [];
		
		for(var i in obj){
			if(parseFloat(obj[i][this.focused_field]) > parseFloat(val)){
				this.buffer.push(obj[i]);
			}
		}
		
		return this;
	}
	
	this.moreThanOrEqualTo = function(val){
		var obj = this.buffer;
		this.buffer = [];
		
		for(var i in obj){
			if(parseFloat(obj[i][this.focused_field]) >= parseFloat(val)){
				this.buffer.push(obj[i]);
			}
		}
		
		return this;
	}
	
	this.lessThan = function(val){
		var obj = this.buffer;
		this.buffer = [];
		
		for(var i in obj){
			if(parseFloat(obj[i][this.focused_field]) < parseFloat(val)){
				this.buffer.push(obj[i]);
			}
		}
		
		return this;
	}
	
	this.lessThanOrEqualTo = function(val){
		var obj = this.buffer;
		this.buffer = [];
		
		for(var i in obj){
			if(parseFloat(obj[i][this.focused_field]) <= parseFloat(val)){
				this.buffer.push(obj[i]);
			}
		}
		
		return this;
	}
	
	// end - set of conditions
	
	// order
	
	this.orderBy = function(field){
		var sequence = 'asc';
		var temp = field.split(' ');
		
		if(temp[1] && temp[1].toLowerCase() == 'desc'){
			sequence = 'desc';
			field = temp[0]; 
		}
		
		// prepare object
		var obj = [];
		for(var i in this.buffer){
			obj.push([i,this.buffer[i][field]]);
		}
		
		obj.sort(function(a,b){
			return a[1] - b[1];
		});
		
		results = [];
		for(var i in obj){
			results.push(this.buffer[obj[i][0]]);
		}
		
		this.buffer = results;
		if(sequence == 'desc'){
			this.buffer = this.buffer.reverse();
		}
		
		return this;
	}
	
	//helper
	this.in_array = function(val,list){
		for(var i in list){
			if(val == list[i]){
				return true;
			}
		}
		
		return false;
	}
	
}