#govpack

###made for GovHack Brisbane/Qld 2014
http://hackerspace.govhack.org/content/npm-install-g-govpack-or-github-govpackgovpack

available also on
https://www.npmjs.org/package/govpack

    npm install -f -g govpack

![image](http://hackerspace.govhack.org/sites/default/files/field/image/Screenshot%20%2812%29.png)

*all YO data is belong to us*

govpack is a tool to help download and explore all the CKAN datasets
govpack is a command line tool (and node module) that seeks out the metadata
for ALL available data sets on a given CKAN endpoint, namely

0 http://demo.ckan.org/api/3/action/current_package_list_with_resources

1 https://data.qld.gov.au/3/action/current_package_list_with_resources

2 https://data.gov.au/api/3/action/current_package_list_with_resources


CLI Usage:

     govpack {fetch:X} --> makes X.js module.exports=BigPackageList
     govpack {filter:X} --> makes X.txt filtered JSONP IIII(filtered_csv_metadata)
     govpack {download:X} --> downloads ./CSV/1.csv, ./CSV/2.csv,,, ./CSV/111.csv

the commands need to be run in that order because they depend on the previous result
results are saved in the same folder as index.js ie in your global "./node_modules/govpack/index.js" folder
downloaded "node_modules/govpack/format/1...n.format" files match up with the metadata in X.txt


###Output paths will be improved
note: result paths will get changed to "node_modules/govpack/X/format/1...n.format" and have an option to
put the results in a directory of your choice, which will be tidier/better for more ckans etc. With the
X moved up to directory level, X.js and X.txt will have a common name like a.txt and b.txt for each.

###From your node code: 

    var GP=require('govpack');
    GP({filter:1,format:'XLS'},function(){console.log('Done!!')})
    //only tested in cli mode  

####{filter:X ,format:'XYZ'}
As an option you may wish to set the format for the filter step 
to filter for some other filetype 

    govpack {filter:0 ,format:'KML'}
    txt|xlsx|jpg|json|html|png|pdf|xls|cvs|gif|xml|
    rdf|hdf5|kml|pptx|docx|doc|odp|dat|jar|zip|shp|etc

would all be okay format:'XYZ' (case insensitive) values to try 
but by far CSV is the most popular default.

#a.htm 
a.htm is the page that uses the JSONP 0.txt, and displays the filtered metadata  
it contains links to the actual CSV files, file size (where available), 
table headings, field names, field types, column and row counts
and should be useful to look at as a sample of the final ouput. I wanted to do
search and autocomplete on the field names, this is now possible :-) also ckan
has many GET verbs (including SQL) with the refined JSONP metatata one could 
genarate other ajax calls, from a web page, to open up the data even further.

###With the power of X (simple integers as the primary key)

     govpack {filter:X,format:'XLS'}

more ckan dataset catalog endpoints can be added, 
presently in the source code they are listed as:

    CK[0]={url:'http://demo.ckan.org/api/3/action/'}  // the demo data set as used by the CKAN docs
    CK[1]={url:'https://data.qld.gov.au/api/3/action/'} //the state catalog of datasets
    CK[2]={url:'https://data.gov.au/api/3/action/'}    //the national catalog of datasets 
    CK[99]={url:'https://some_CKAN_action_endpoint/'} // ie add some more
    // this array will probably end up in a seperate config file

#### NOW #2 (data.gov.au) is big and FAILS as a single request 

     the code has some in progress (INCOMPLETE) calls 
     to fetch it as several pagenated sub requests (todo)
     namely GetBiggerList(x,cb){/*conglomerate page-enated package lists*/}

#### AND npm is not making the govpack.cmd or bash script that I would like 

     also TODO is howto make npm drop an sh +govpack.cmd
     in the common bin folder ?? I put bin:{govpack:"./index.js"}
     (and other tried things) in the package.json BUT npm adds only
     govpack.cmd =
     "%~dp0\node_modules\govpack\index.js"   %*
     
     and not the prefered 
     
     govpack.cmd =
     
     @IF EXIST "%~dp0\node.exe" (
     "%~dp0\node.exe"  "%~dp0\node_modules\govpack\index.js" %*
     ) ELSE (
     node  "%~dp0\node_modules\govpack\index.js" %*
    )
    
i tried editing govpack.cmd manually and it worked, so it's close 
    
#### So it is not presently working as desired
###when the above fixes to package.json and  are made, 
###without having to reference the full paths, oh dear
####I mean, I would like it to work for other people as well

    "C:/A/N/node.exe" "C:/A/B/2/9/Ax/20/index.js" {download:0}
    (works for me, lol, angry lol) since your paths will vary

index.js has code that should make govpack to work as both a Command Line tool AND a module

    if(require.main === module){/*Use from the CommandLine*/}
    else{module.exports=init/*work as a module*/}

####But as per the above a couple of fixes are required
also todo, a.htm should generate A-Z, then AA,AB,AC,AD as the column heading (as in Excel, etc)
I will apply http://stackoverflow.com/questions/9905533/convert-excel-column-alphabet-e-g-aa-to-number-e-g-25
to that, soonish. 

####Finally (get me the data)
after having run govpack {fetch:0} and govpack {filter:0} you may also call

    govpack {download:0} 

to download the filtered CSV file set from to disc



###more endpoints/fixes and addtions are wecolme

email to
govpack@gmail.com


