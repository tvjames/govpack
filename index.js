process.on('uncaughtException',function(er){console.log(er.stack)})

var CK=[] /*A number of ckan API's/Dataset Catalogs to use*/
CK[0]={url:'http://demo.ckan.org/api/3/action/'}
CK[1]={url:'https://data.qld.gov.au/api/3/action/'}
CK[2]={url:'https://data.gov.au/api/3/action/'}
CK[99]={url:'https://some_CKAN_action_endpoint/'}
/*For example to use the ckan from "data.qld.gov.au" that is API#1 CK[1] {fetch:1} 
use the command line to RUN "govpack {fetch:1}" then "govpack {filter:1}" 
or add another CKAN API endpoint of your choosing (as above) and
then RUN "govpack {fetch:1,filter:99}" then "govpack {download:99}" 
Note: At this point GetBigList FAILS to {fetch:2} from the API#2 endpoint
(API#2=is the national government package list too big??). So {fetch:1} is proving more useful 
govpak {fecth:0} gives the demo ckan sample listings filled with sample data and pictures of cats and owls.
Note: {fetch:X, filter:X} can be run as a combined sequence of operations 
but {download:X} is best run seperately (after the filtered list has been saved to disk)
*/
var fs=require('fs');
var util=require('util');
var http=require('http');http.globalAgent.maxSockets=500
var https=require('https');https.globalAgent.maxSockets=500
var path=require('path');
var cp=require('child_process');
var DIR=(__dirname+'/').replace(/\x5c/g,'/')
var FORMAT='csv';var FOM='CSV';var fom='csv' 
/*FORMAT updated by init() from {format:'XXX'} user options, the default is format:'csv' 
you may wish to specify a different resource filetype to filter on,for instance:
    txt|xlsx|jpg|json|html|png|pdf|xls|cvs|gif|xml|
    rdf|hdf5|kml|pptx|docx|doc|odp|dat|jar|zip|shp| 
case insensitive, would all be okay format:'XYZ' values to try, but CSV would be the most popular
just run something like "index.js {filter:1,format:'XLS'}" as the json command line argument 
or calling something like the following from your node code: 
var GP=require('govpack');
GP({filter:1,format:'XLS'},function(){console.log('Done!!')}) 
*/


if(require.main === module){/*Use from the CommandLine: RUN "node.exe index.js {fetch:0|1|2}" OR index.js {filter:1} etc*/ 
var OK=true
var o2={format:'csv'}
var o3={}
var ar=process.argv.slice(2).join(' ')
if(ar.charAt(0)=='{'){
try{eval('var o2=('+ar+')')}catch(er){LOG(er.message);OK=false};
if(typeof o2=='object'){for(var p in o2){o3[p]=o2[p]}}
}
LOG('All YO! format:\''+FOM+'\'\nOR {format:\'xlsx|ckml|rdf|odp|dat|etc\'}\n    iS Belong to US!!....')
if(OK){init(o3)}else{LOG('Fix json command line argument and retry');process.exit()}
}
else{/*Use as a module:*/
module.exports=init 
/***********************************************
* Usage:                                       *
*  GP=require('govpack')                       *
*  GP({fetch:1,filter:1,format:'xls'})         *
***********************************************/
}

function LOG(x){console.log(x)}
function init(o,cb){/*The One and Only function exported and required. Calls out to internal functions based on settings in o*/
cb=cb||function(){};x=parseInt(o.get||o.fetch||o.filter);
if(!CK[x]){return LOG('We dont have API #'+x+' OBJECT please add it to CK['+x+']={url:\'CKAN_API_ACTION_ENDPOINT\'} on index.js\nOr use [0|1|2] and retry')}
if(!CK[x].url){return LOG('We dont have API #'+x+' URL please add it to CK['+x+']={url:\'CKAN_API_ACTION_ENDPOINT\'} on index.js\nOr use [0|1|2] and retry')}
if(o.silent){LOG=function(){} /*turn terminal chatter off*/}
if(o.format){FORMAT=o.format.toString().toLowerCase()}
FOM=FORMAT.toUpperCase()
fom=FOM.toLowerCase()
var fp1=DIR+x+'.js' /*module.exports={GetBigList}*/
var fp2=DIR+x+'.txt' /*Our refined list of IIII(jsonp)*/
if(typeof o.get=='number'){LOG('Given {fetch:'+x+'} and {filter:'+x+'} saved a local vaild JSONP list at '+fp2+'\n\tcheck it out.The above file should be good for use inside any Browser based App\n\tCross Domain, Mobile or Desktop, Online or Offline, via file: OR http: protocols\nWe will now proceed to download '+FOM+' resources from online.\nResources '+DIR+FOM+'/1,2,3,4.'+FOM.toLowerCase()+', etc will be saved to match the numeric Array index in\n<script src="'+fp2+'"></script>\nAs recieved on an html page via function GOVH(A){/*Got resource_list */}\nSo after downloading we will have the metadata and the DATA!!');DownloadMany(o,cb);return}
if(typeof o.fetch=='number' && typeof o.filter=='number'){LOG('Please be patient while we fetch AND filter from API#'+o.fetch);GetBigList(o.fetch, (function(x,cb){return function(){ScanList(x,cb)}}(o.filter,cb)) );return}
if(typeof o.fetch=='number'){LOG('Please be patient while we fetch from API#'+o.fetch);GetBigList(o.fetch,cb);return}
if(typeof o.filter=='number'){LOG('Now we will filter and refine the Big DataSet List @'+(DIR+x+'.js')+'\n~(hopefully that\'s in place OR RUN govpack {fetch:'+o.filter+'} to put it there)\nFiltering for on datasets/resources where format='+FOM+'\nAnd using a datastore_search query on API#'+o.filter+'\n'+CK[o.filter].url+'api/action/datastore_search?resource_id=###\nto get the size, description, field names, data types, row count, and the first row of actual data!!');ScanList(o.filter,cb);return}
}

function DownloadMany(o,cb){var x=o.get
var fp1=DIR+x+'.js' /*module.exports={GetBigList}*/
var fp2=DIR+x+'.txt' /*Download from data inside IIII(resource_array)*/
var JS=''
try{JS=fs.readFileSync(fp2).toString().replace(/^\uFEFF/, '').substr(4)}catch(er){LOG(er.stack);o.d='DownloadMany failed to READ jsonp resource list';o.bad=1;cb(er,o)}
var A=0;
try{eval('var A=('+JS+')'}catch(er){LOG(er.stack);o.d='DownloadMany failed to EVAL jsonp resource list';o.bad=1;cb(er,o)}
if(typeof A!='object'){o.d='DownloadMany failed to extract an ARRAY/LIST/OBJECT';LOG(o.d);o.bad=1;return cb({bad:1,message:o.d},o)}
if(!A.pop){o.d='DownloadMany failed to extract an ARRAY/LIST';LOG(o.d);o.bad=1;return cb({bad:1,message:o.d},o)}

DoNext()
function DoNext(){
var o=A.pop();if(!A.length){return Done(cb)}
if(!o){return DoNext()}
if(!o.resources){return DoNext()};B=o.resources;
}

LOG(JS)
}

function DownloadOne(URL,FP,cb){
var file=fs.createWriteStream(FP)
var web=(url.charAt(4)=='s'?https:http)
web.get(URL,function(R){R.pipe(file);
file.on('finish',function(){file.close();
fs.stat(FP,function(er,me){if(er){LOG(er.stack);return cb(-1)}LOG('Saved ['+me.size+'bytes] '+FP+' from '+URL);cb(me.size)})
})}
)
}


function GetBigList(x,cb){cb=cb||function(){}
var url=CK[x].url+'current_package_list_with_resources'
var web=(url.charAt(4)=='s'?https:http)
var fp=DIR+x+'.js'
  LOG('Downloading=='+url)
  LOG('SavingAs====='+fp)
web.get(url
,function(R){
var data='module.exports=';
R.on('data',function(t){data+=t})
R.on('end',function(){data+='';try{fs.writeFileSync(fp,data,'utf8')}catch(er){LOG(er.stack);return cb(er,{d:'GetBigList Failed to write File',fp:fp});
cb(null,{d:'GetBigList Saved package list!',fp:fp} )
};
})

})
}


function ScanList(x,cb){cb=cb||function(){}
var C=[{DataSets:0,Fields:0}];
var DataSets=0;var Fields=0;/*CountThem*/
var fp1=DIR+x+'.js' /*module.exports={GetBigList}*/
var fp2=DIR+x+'.txt' /*IIII([{},{},{}]) our refined list of CSV datasets,sizes, row count, field Names, field types, and the first row of sample data*/
var B=[];var JS=''
var O=require(fp1)
if(!O){LOG(-4);return cb({message:'Failed to find package list on disc. Run govpack.cmd {fetch:'+x+'} and retry'})}
var A=O.result
if(!A){LOG(-5);return cb({message:'Failed to objectify package list from file. Run govpack.cmd {fetch:'+x+'} and retry'})}
if(!A.pop){LOG(-6);return cb({message:'Failed to arrayify package list from above. Run govpack.cmd {fetch:'+x+'} and retry'})}

LOG(CK[x])
LOG('\n\tFOUND ['+A.length+'] packages/datasets\n\twith many subfiles and linked resources...')
LOG('  ...now scanning to find the titles, field-names\n\t\tand row count for each ['+FORMAT.toUpperCase()+'] resource....\n\t\t\t\t......\n')
var fe=null;
var LEN=A.length;var o=null;

DoNext()
function DoNext(){
var o=A.pop();if(!A.length){;return Done(cb)}
if(!o){return DoNext()}
if(!o.resources){return DoNext()};B=o.resources;
if(!B){return DoNext()}
if(!B.length){return DoNext()}
for(n=0;n<B.length;n++){bb=B[n] ;if(!bb){return DoNext()};if(!bb.format){return DoNext()}
if(bb.format.toString().toLowerCase()!=FORMAT){return DoNext()}
if(!bb.url){return DoNext()}
ux=CK[x].url+'datastore_search?resource_id='+bb.id+'&limit=1'

var web=(ux.charAt(4)=='s'?https:http)
var oo={
rows:0//'fe.result.total'
,cols:0//'fe.result.fields.length'
,size:parseInt(bb.size)||-1
,d:bb.title||bb.description||''
,url:bb.url
,id:'fe.result.resource_id'
,made:bb.created
,mods:bb.last_modified
,C:[]
,T:[]
,R:0
}


web.get(ux,function(R){var js='';
R.on('error',function(){return setTimeout(DoNext,100)})
R.on('data',function(t){js+=t;})
R.on('end',function(){js+='';
try{var fe=JSON.parse(js)}catch(er){LOG(js)+'#######'+er.message+'####NaughtyJSON#######';return setTimeout(DoNext,10)}

if(!fe){return}
if(typeof fe!='object'){return}
if(!fe.result){return}
if(!fe.result.fields){return}
oo.id=fe.result.resource_id
oo.rows=fe.result.total
if(fe.result.records){
if(fe.result.records[0]){oo.R=fe.result.records[0]}
}
var FZ=fe.result.fields
if(FZ){
if(FZ.length){oo.cols=FZ.length
for(var i=0;i<FZ.length;i++){Fields+=1;
oo.C[i]=FZ[i].id
oo.T[i]=FZ[i].type
}
}
}

C.push(oo);DataSets+=1
LOG('['+DataSets+' DataSets]   ['+Fields+' Fields]')
setTimeout(DoNext,0)
})})


}

function Done(cb){
C[0].DataSets=DataSets
C[0].Fields=Fields
try{fs.writeFileSync(fp2,'IIII('+l.j(C)+')','utf8')}catch(er){LOG(-1);LOG(er.message);LOG(er.stack);return cb(er,{d:'Failed to Save',fp:fp2})}
cb(null,{Saved:fp2})
}


}




}


var l={j:function(o,s,q){/*JSON.stringify alternative*/
if(s==2){return JSON.stringify(o)}
if(o===null){return 'null'}
switch(typeof o){case 'undefined':return 'undefined';
case 'string':return '\''+o.replace(/[\\]/g, '\\\\').replace(/'/g, '\\\'').replace(/[\b]/g,'\\b').replace(/[\f]/g,'\\f').replace(/[\n]/g,'\\n').replace(/[\r]/g,'\\r').replace(/[\t]/g,'\\t')+'\'';
case 'number':return ''+o;case 'object':
if(o.constructor.toString().indexOf('Date()')>0){return o.getTime()}
if(o.constructor.toString().indexOf('RegExp()')>0){return ''+o}
var RA=[];var AR=(o.constructor.toString().indexOf('Array()')>0);
var v;for(var p in o){if(p=='REQ'||p=='RES'){continue}
if(s){v=''+o[p]}else{v=this.j(o[p])}if(AR){RA.push(v);continue}
if(q){RA.push('"'+p+'":'+v);continue}
if((/^[$\w]+$/.test(p) && !/^\d/.test(p))||/^\d+$/.test(p)){RA.push(p+':'+v);continue}
RA.push('"'+p+'":'+v)}return ((AR?'[':'{')+RA.join(',')+(!AR?'}':']')).replace(/},/g,'}\n,').replace(/,T:\[/g,',\n   T:[').replace(/,C:\[/g,',\n   C:[').replace(/,R:\{/g,',\n   R:{');
default:return ''+o}
}
}



