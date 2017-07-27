var Event = require('./models/event');

var one = {
	college : 'dtu' ,
	college_name : 'Delhi Techno Uni' ,
	events :  [
		{
			"id": "293",
			"title": "This is warning class event",
			"url": "http://www.example.com/",
			"class": "event-warning",
			"start": "1362938400000",
			"end":   "1363197686300"
		},
		{
			"id": "256",
			"title": "Event that ends on timeline",
			"url": "http://www.example.com/",
			"class": "event-warning",
			"start": "1363155300000",
			"end":   "1363227600000"
		},
		{
			"id": "276",
			"title": "Short day event",
			"url": "http://www.example.com/",
			"class": "event-success",
			"start": "1363245600000",
			"end":   "1363252200000"
		},
		{
			"id": "294",
			"title": "This is information class ",
			"url": "http://www.example.com/",
			"class": "event-info",
			"start": "1363111200000",
			"end":   "1363284086400"
		},
		{
			"id": "297",
			"title": "This is success event",
			"url": "http://www.example.com/",
			"class": "event-success",
			"start": "1363234500000",
			"end":   "1363284062400"
		},
		{
			"id": "54",
			"title": "This is simple event",
			"url": "http://www.example.com/",
			"class": "",
			"start": "1363712400000",
			"end":   "1363716086400"
		},
		{
			"id": "532",
			"title": "This is inverse event",
			"url": "http://www.example.com/",
			"class": "event-inverse",
			"start": "1364407200000",
			"end":   "1364493686400"
		},
		{
			"id": "548",
			"title": "This is special event",
			"url": "http://www.example.com/",
			"class": "event-special",
			"start": "1363197600000",
			"end":   "1363629686400"
		},
		{
			"id": "295",
			"title": "Event 3",
			"url": "http://www.example.com/",
			"class": "event-important",
			"start": "1364320800000",
			"end":   "1364407286400"
		}
	]
}

var two = {
	college : 'nsit' ,
	college_name : 'Netaji Uni' ,
	events :  [
		{
			"id": "293",
			"title": "This is warning class event",
			"url": "http://www.example.com/",
			"class": "event-warning",
			"start": "1362938400000",
			"end":   "1363197686300"
		},
		{
			"id": "256",
			"title": "Event that ends on timeline",
			"url": "http://www.example.com/",
			"class": "event-warning",
			"start": "1363155300000",
			"end":   "1363227600000"
		},
		{
			"id": "276",
			"title": "Short day event",
			"url": "http://www.example.com/",
			"class": "event-success",
			"start": "1363245600000",
			"end":   "1363252200000"
		},
		{
			"id": "294",
			"title": "This is information class ",
			"url": "http://www.example.com/",
			"class": "event-info",
			"start": "1363111200000",
			"end":   "1363284086400"
		},
		{
			"id": "297",
			"title": "This is success event",
			"url": "http://www.example.com/",
			"class": "event-success",
			"start": "1363234500000",
			"end":   "1363284062400"
		},
		{
			"id": "54",
			"title": "This is simple event",
			"url": "http://www.example.com/",
			"class": "",
			"start": "1363712400000",
			"end":   "1363716086400"
		},
		{
			"id": "532",
			"title": "This is inverse event",
			"url": "http://www.example.com/",
			"class": "event-inverse",
			"start": "1364407200000",
			"end":   "1364493686400"
		},
		{
			"id": "548",
			"title": "This is special event",
			"url": "http://www.example.com/",
			"class": "event-special",
			"start": "1363197600000",
			"end":   "1363629686400"
		},
		{
			"id": "295",
			"title": "Event 3",
			"url": "http://www.example.com/",
			"class": "event-important",
			"start": "1364320800000",
			"end":   "1364407286400"
		}
	]
}

var dtu = new Event(one)
dtu.save().then(function(doc){
	console.log(doc);
} , function(err) {
	console.log(err);
})


var nsit = new Event(two)
nsit.save().then(function(doc){
	console.log(doc);
} , function(err) {
	console.log(err);
})