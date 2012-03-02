importPackage(java.io);
importPackage(java.lang);
importPackage(java.net);
importPackage(org.openqa.selenium.htmlunit);
importPackage(com.gargoylesoftware.htmlunit);
importPackage(org.openqa.selenium);
importPackage(org.hsqldb.util);

var tickerList = readFile("./CBOEWeekliesList.csv").split("\n");
for ( var i=0; i<tickerList.length-1; i++ ) {
    tickerList[i] = tickerList[i].trim();
}

var driver = new HtmlUnitDriver( BrowserVersion.FIREFOX_3_6 );
var csvOut = new CSVWriter( new File("./MorningstarFCF.csv"), null );
var epsOut = new CSVWriter( new File("./MorningstarEPS.csv"), null );
var balanceOut = new CSVWriter( new File("./MorningstarBalanceSheet.csv"), null );
var keyRatiosOut = new CSVWriter( new File("./MorningstarKeyRatios.csv"), null );

for ( var i=0; i<tickerList.length; i++ ) {
    print( tickerList[i] );
    getFreeCashFlow( tickerList[i] );
    Thread.sleep( 200 );
    getEPS( tickerList[i] );
    Thread.sleep( 200 );
    getBalanceSheet( tickerList[i] );
    Thread.sleep( 200 );
    getKeyRatios( tickerList[i] );
    Thread.sleep( 200 );
}

csvOut.close();
epsOut.close();
balanceOut.close();
keyRatiosOut.close();

function getFreeCashFlow( tickerSymbol ) {
   try {
     var url = new URL("http://financials.morningstar.com/ajax/ReportProcess4HtmlAjax.html?t="+tickerSymbol+"&region=USA&culture=en_us&reportType=cf&period=12&dataType=A&order=asc&columnYear=5&rounding=3&view=raw&productCode=USA&r=914863&callback=jsonp1328927199094&_=1328927199373");
     var reader = new BufferedReader(new InputStreamReader(url.openStream()));
     var jContent = new java.lang.String();
     var s = new java.lang.String();
     while ((s = reader.readLine())!=null) {
	 jContent = jContent.concat(s);
     }
     reader.close();

     // var colIndex = jContent.indexOf('{"c');
     var cleanJson = eval( '(' + jContent.substring(19,jContent.length()-1) + ')' );
     var writer = new BufferedWriter( new FileWriter( "/mnt/ramdisk/rhino-dev/tmp.html" ) );
     writer.write( "<html><body>" + cleanJson.result + "</body></html>" );
     writer.close();
     driver.get( "file:///mnt/ramdisk/rhino-dev/tmp.html" );
   
     var yearDiv = driver.findElementByXPath("//div[@id='Year']");
     var div97 = driver.findElementByXPath("//div[@id='data_i97']");
  
     for ( var j=1; j<=6; j++ ) {
      var fcfDiv = div97.findElement( By.id("Y_"+j ) );
      var freeCashFlow = fcfDiv.getAttribute("rawValue");
      var yearVal = yearDiv.findElement( By.id("Y_"+j ) );
      var yearMonth = yearVal.getText().trim();
      print( tickerSymbol + ", " + yearMonth + ", " + freeCashFlow );
      csvOut.writeData( Array( tickerSymbol, yearMonth, freeCashFlow ) );
     }
   } catch ( err ) {
      print( err.message );
   }
}

function getEPS( tickerSymbol ) {
   try {
      var url = new URL("http://financials.morningstar.com/ajax/ReportProcess4HtmlAjax.html?t="+tickerSymbol+"&region=USA&culture=en_us&reportType=is&period=12&dataType=A&order=asc&columnYear=5&rounding=3&view=raw&productCode=USA&r=911627&callback=jsonp1330597700027&_=1330597700381");
     var reader = new BufferedReader(new InputStreamReader(url.openStream()));
     var jContent = new java.lang.String();
     var s = new java.lang.String();
     while ((s = reader.readLine())!=null) {
	 jContent = jContent.concat(s);
     }
     reader.close();

     // var colIndex = jContent.indexOf('{"c');
     var cleanJson = eval( '(' + jContent.substring(19,jContent.length()-1) + ')' );
     var writer = new BufferedWriter( new FileWriter( "/mnt/ramdisk/rhino-dev/tmp.html" ) );
     writer.write( "<html><body>" + cleanJson.result + "</body></html>" );
     writer.close();
     driver.get( "file:///mnt/ramdisk/rhino-dev/tmp.html" );
     
     var yearDiv = driver.findElementByXPath("//div[@id='Year']");
     var div83 = driver.findElementByXPath("//div[@id='data_i83']");
     var div84 = driver.findElementByXPath("//div[@id='data_i84']");     

     for ( var j=1; j<=6; j++ ) {
      var basicEpsDiv = div83.findElement( By.id("Y_"+j ) );
      var basicEps = basicEpsDiv.getAttribute("rawValue");
      var dilutedEpsDiv = div84.findElement( By.id("Y_"+j ) );
      var dilutedEps = dilutedEpsDiv.getAttribute("rawValue");
      var yearVal = yearDiv.findElement( By.id("Y_"+j ) );
      var yearMonth = yearVal.getText().trim();
      print( tickerSymbol + ", " + yearMonth + ", " + dilutedEps );
      epsOut.writeData( Array( tickerSymbol, yearMonth, basicEps, dilutedEps ) );
     }
   } catch ( err ) {
       print( err.message );
   }
}

function getBalanceSheet( tickerSymbol ) {
   try {
     var url = new URL("http://financials.morningstar.com/ajax/ReportProcess4HtmlAjax.html?t="+tickerSymbol+"&region=USA&culture=en_us&reportType=bs&period=12&dataType=A&order=asc&columnYear=5&rounding=3&view=raw&productCode=USA&r=103644&callback=jsonp1330604904079&_=1330604904613");
     var reader = new BufferedReader(new InputStreamReader(url.openStream()));
     var jCon = new java.lang.String();
     var s = new java.lang.String();
     while ((s = reader.readLine())!=null) {
	jCon = jCon.concat(s);
     }
     reader.close();

     // var colIndex = jCon.indexOf('{"c');
     var cleanJson = eval( '(' + jCon.substring(19,jCon.length()-1) + ')' );
     var writer = new BufferedWriter( new FileWriter( "/mnt/ramdisk/rhino-dev/tmp.html" ) );
     writer.write( "<html><body>" + cleanJson.result + "</body></html>" );
     writer.close();
     driver.get( "file:///mnt/ramdisk/rhino-dev/tmp.html" );
     
     var yearDiv = driver.findElementByXPath("//div[@id='Year']");
     var cashDiv = driver.findElementByXPath("//div[@id='data_gg1']");
     var equityDiv = driver.findElementByXPath("//div[@id='data_g8']");

     for ( var j=1; j<=5; j++ ) {
       var yearVal = yearDiv.findElement( By.id("Y_"+j ) );
       var yearMonth = yearVal.getText().trim();
       var cashValDiv = cashDiv.findElement( By.id("Y_"+j) );
       var cash = cashValDiv.getAttribute("rawValue");
       var equityValDiv = equityDiv.findElement( By.id("Y_"+j) );
       var equity = equityValDiv.getAttribute("rawValue");
       print( tickerSymbol + ", " + yearMonth + ", " + equity );
       balanceOut.writeData( Array( tickerSymbol, yearMonth, cash, equity ) );    
     }

   } catch ( err ) {
      print ( err.message );
   }
}

function getKeyRatios( tickerSymbol ) {
   try {
     var url = new URL("http://financials.morningstar.com/ajax/keystatsAjax.html?t="+tickerSymbol+"&culture=en_us&region=USA&order=asc&r=704546&callback=jsonp1330654623137&_=1330654623233");
     var reader = new BufferedReader(new InputStreamReader(url.openStream()));
     var jCon = new java.lang.String();
     var s = new java.lang.String();
     while ((s = reader.readLine())!=null) {
	jCon = jCon.concat(s);
     }
     reader.close();

     var colIndex = jCon.indexOf('{"C');
     var cleanJson = eval( '(' + jCon.substring(colIndex,jCon.length()-1) + ')' );
     var writer = new BufferedWriter( new FileWriter( "/mnt/ramdisk/rhino-dev/tmp.html" ) );
     writer.write( "<html><body>" + cleanJson.ksContent + "</body></html>" );
     writer.close();
     driver.get( "file:///mnt/ramdisk/rhino-dev/tmp.html" );
     
     for ( var k=0; k<=10; k++ ) {
       try {
         var td = driver.findElementByXPath("//td[@headers='pr-pro-Y"+k+" pr-profit i22']");
         var headerTd = driver.findElementByXPath("//th[@id='pr-pro-Y"+k+"']");
         print( tickerSymbol + "," + headerTd.getText() + "," + td.getText() );
         keyRatiosOut.writeData( new Array( tickerSymbol, headerTd.getText(), td.getText() ) );
       } catch ( err ) { print( err.message ); }
     }

   } catch ( err ) {
       print( err.message );
   }
}