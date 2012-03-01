importPackage(java.io);
importPackage(java.util);
importPackage(java.lang);
importPackage(java.text);
importPackage(Packages.liquibase.util.csv);
importPackage(org.openqa.selenium.htmlunit);
importPackage(com.gargoylesoftware.htmlunit);

var todayString = (new SimpleDateFormat("yyyy-MM-dd")).format(new Date());
var reader = new CSVReader( new FileReader("/mnt/ramdisk/rhino-dev/CBOEWeekliesList.csv" ) );
var writer = new CSVWriter( new FileWriter("/mnt/ramdisk/rhino-dev/YahooEOD-"+todayString+".csv") );
var lines = reader.readAll();
var tickers = Array();

var driver = new HtmlUnitDriver( BrowserVersion.FIREFOX_3_6 );

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
    var urlString = "http://ichart.finance.yahoo.com/table.csv?s="+ticker+"&d=1&e=29&f=2012&g=d&a=8&b=1&c=2010&ignore=.csv";
    driver.get( urlString );
    var lines = driver.getPageSource().split("\n");
    if ( lines[0].startsWith("Date") ) {
      for ( var j=1; j<lines.length; j++ ) {
	 var row = lines[j].split(",");
         var outArray = Array( row[0].trim(), ticker, row[1].trim(), row[2].trim(), row[3].trim(), row[4].trim(), row[5].trim(), row[6].trim() );
         writer.writeNext( outArray );  
      }       
    }
}