#govpack

###made for govhack qld 2014
http://hackerspace.govhack.org/content/npm-install-g-govpack-or-github-govpackgovpack
available also on
https://www.npmjs.org/package/govpack

CLI Usage:
    govpack {fetch:0}

    govpack {filter:0}

OR from your node code: 
var GP=require('govpack');
GP({filter:1,format:'XLS'},function(){console.log('Done!!')})
//only tested in cli mode  

As an option you may wish to set the filetype for the filter step 
to filter on someother resource type {filter:0 ,format:'XXX'}

    txt|xlsx|jpg|json|html|png|pdf|xls|cvs|gif|xml|
    rdf|hdf5|kml|pptx|docx|doc|odp|dat|jar|zip|shp|etc

would all be okay format:'XYZ' (case insensitive) values to try 
but by far CSV is the most popular default.

###from the command line:
     node.exe index.js {filter:1,format:'XLS'}

The ckan dataset catalog endpoints we are fetching from 
{fetch:0|1|2} etc, can be added to, in the source code:

CK[0]={url:'http://demo.ckan.org/api/3/action/'}
CK[1]={url:'https://data.qld.gov.au/api/3/action/'}
CK[2]={url:'https://data.gov.au/api/3/action/'}    
####2 is big  and FAILS as a single request 
// the code has some in progress (incomplete) calls 
// to fetch it as several pagenated sub requests (todo)
// also todo is howto make npm drop an sh +govpack.cmd
// in the common bin folder ??

CK[99]={url:'https://some_CKAN_action_endpoint/'}

you may also call

    govpack {download:0|1|2} 

to download the filtered file set from online to disc
more endpoints/ fixes an addtions are wecolme

email to
govpack@gmail.com


