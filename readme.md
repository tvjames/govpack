#govpack

###made for govhack qld 2014
http://hackerspace.govhack.org/content/npm-install-g-govpack-or-github-govpackgovpack

available also on
https://www.npmjs.org/package/govpack

![image](http://hackerspace.govhack.org/sites/default/files/field/image/Screenshot%20%2812%29.png)

*all YO data is belong to us*

govpack is a tool to help explore all the datasets

govpack is a command line tool that seeks out the metadata
for ALL available data sets on a given CKAN endpoint, like

0 http://demo.ckan.org/api/3/action/current_package_list_with_resources

1 https://data.qld.gov.au/3/action/

2 https://data.gov.au/api/3/action/

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

    
CK[99]={url:'https://some_CKAN_action_endpoint/'} // ie add some more
  
you may also call

    govpack {download:0|1|2} 

to download the filtered CSV file set from to disc

###more endpoints/ fixes an addtions are wecolme

email to
govpack@gmail.com


