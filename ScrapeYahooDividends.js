importPackage(java.io);
importPackage(java.util);
importPackage(Packages.liquibase.util.csv);
importPackage(org.openqa.selenium.htmlunit);
importPackage(com.gargoylesoftware.htmlunit);
importPackage(org.openqa.selenium);

var today = new Date();

var reader = new CSVReader( new FileReader("/mnt/DriveTwo/rhino-dev/ETFList.csv" ) );
var lines = reader.readAll();
var tickers = Array();

var driver = new HtmlUnitDriver( BrowserVersion.FIREFOX_3_6 );

for ( var i=0; i<lines.size(); i++ ) {
   var row = lines.get(i);
   tickers[i] = row[1];  
}

reader.close();

for ( var i=0; i<tickers.length; i++ ) {
   print( "Processing ticker = " + tickers[i] );
   scrapeTicker( tickers[i] ); 
}

function scrapeTicker( ticker ) {
    var urlString = "http://ichart.finance.yahoo.com/table.csv?s="+ticker+"&a=00&b=29&c=2000&d=01&e=19&f=2012&g=v&ignore=.csv";
    print( urlString );
    driver.get( urlString );
}

