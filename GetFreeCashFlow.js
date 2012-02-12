importPackage(java.io);
importPackage(java.lang);
importPackage(org.openqa.selenium.htmlunit);
importPackage(com.gargoylesoftware.htmlunit);
importPackage(org.openqa.selenium);
importPackage(org.hsqldb.util);

var tickerFile = readFile("/tmp/R3K-CBOE-TickerList.csv");
var tickerList = tickerFile.split("\n");
for ( var i=0; i<tickerList.length-1; i++ ) {
    tickerList[i] = tickerList[i].trim();
}

var driver = new HtmlUnitDriver( BrowserVersion.FIREFOX_3_6 );
var csvOut = new CSVWriter( new File("/tmp/MorningstarFCF.csv"), null );

for ( var i=0; i<tickerList.length; i++ ) {
   try {
     print( tickerList[i] );
     driver.get( "http://financials.morningstar.com/ajax/ReportProcess4HtmlAjax.html?t="+tickerList[i]+"&region=USA&culture=en_us&reportType=cf&period=12&dataType=A&order=asc&columnYear=5&rounding=3&view=raw&productCode=USA&r=914863&callback=jsonp1328927199094&_=1328927199373" );
     var jsonContent = driver.getPageSource();
     var colIndex = jsonContent.indexOf('{"c');
     var cleanJson = eval( '(' + jsonContent.substring( colIndex, jsonContent.length()-1 ) + ')' );
     var writer = new BufferedWriter( new FileWriter( "/tmp/tmp.html" ) );
     writer.write( "<html><body>" + cleanJson.result + "</body></html>" );
     writer.close();
     driver.get( "file:///tmp/tmp.html" );
   
     var yearDiv = driver.findElementByXPath("//div[@id='Year']");
     var div97 = driver.findElementByXPath("//div[@id='data_i97']");
  
     for ( var j=1; j<=6; j++ ) {
      var fcfDiv = div97.findElement( By.id("Y_"+j ) );
      var freeCashFlow = fcfDiv.getAttribute("rawValue");
      var yearVal = yearDiv.findElement( By.id("Y_"+j ) );
      var yearMonth = yearVal.getText().trim();
      // print( tickerList[i] + ", " + yearMonth + ", " + freeCashFlow );
      var outArray = Array( tickerList[i], yearMonth, freeCashFlow );
      csvOut.writeData( outArray );
     }
   } catch ( err ) {}

   Thread.sleep( 300 );
}

csvOut.close();
