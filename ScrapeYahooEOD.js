importPackage(java.io);
importPackage(java.util);
importPackage(java.lang);
importPackage(java.text);
importPackage(java.net);
importPackage(Packages.liquibase.util.csv);

var todayString = (new SimpleDateFormat("yyyy-MM-dd")).format(new Date());
var reader = new CSVReader( new FileReader("./CBOEWeekliesList.csv" ) );
var writer = new CSVWriter( new FileWriter("./YahooEOD-"+todayString+".csv") );
var lines = reader.readAll();
var tickers = Array();

for ( var i=0; i<lines.size(); i++ ) {
   tickers[i] = lines.get(i)[0];  
}

reader.close();

for ( var i=0; i<tickers.length; i++ ) {
   print( "Processing ticker = " + tickers[i] );
   scrapeTicker( tickers[i] ); 
   Thread.sleep( 400 );
}

function scrapeTicker( ticker ) {
    var url = new URL("http://ichart.finance.yahoo.com/table.csv?s="+ticker+"&d=2&e=7&f=2012&g=d&a=8&b=1&c=2010&ignore=.csv");
    try {
     var reader = new BufferedReader(new InputStreamReader(url.openStream()));
     var content = new java.lang.String();
     while ((s=reader.readLine())!=null) {
	content = content.concat(s+"\n");
     }
     reader.close();

     var lines = content.split("\n");
     if ( lines[0].startsWith("Date") ) {
      for ( var j=1; j<lines.length; j++ ) {
	 var row = lines[j].split(",");
         var outArray = Array( row[0].trim(), ticker, row[1].trim(), row[2].trim(), row[3].trim(), row[4].trim(), row[5].trim(), row[6].trim() );
         writer.writeNext( outArray );  
       }       
     }
    } catch ( err ) { print( err.message ); }
}