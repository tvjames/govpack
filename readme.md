'''govpack

CLI Usage:
govpack {fetch:0}
govpack {filter:0}

OR from your node code: 
var GP=require('govpack');
GP({filter:1,format:'XLS'},function(){console.log('Done!!')})

As an option you may wish to set the filetype for the filter step 
to filter on someother resource type {format:'XXX'} like:

    txt|xlsx|jpg|json|html|png|pdf|xls|cvs|gif|xml|
    rdf|hdf5|kml|pptx|docx|doc|odp|dat|jar|zip|shp|etc

would all be okay format:'XYZ' (case insensitive) values to try 
but by far CSV is the most popular default.

from the command line:
node.ex index.js {filter:1,format:'XLS'}

The dataset catalog endpoints we are fetching from {fetch:0|1|2} etc
are in, and can be added to, in the source code:

CK[0]={url:'http://demo.ckan.org/api/3/action/'}
CK[1]={url:'https://data.qld.gov.au/api/3/action/'}
CK[2]={url:'https://data.gov.au/api/3/action/'}
CK[99]={url:'https://some_CKAN_action_endpoint/'}

also you may want to call

    govpack {download:0|1|2} function 

to download the filtered file set from online to disc

