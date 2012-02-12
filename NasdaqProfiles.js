importPackage(java.io);
importPackage(Packages.liquibase.util.csv);
importPackage(org.openqa.selenium.htmlunit);
importPackage(com.gargoylesoftware.htmlunit);
importPackage(org.openqa.selenium);

var reader = new CSVReader( new FileReader("/tmp/NasdaqIPOs.csv") );
var lines = reader.readAll();
var driver = new HtmlUnitDriver( BrowserVersion.FIREFOX_3_6 );
driver.setJavascriptEnabled( false );

for ( var i=0; i<lines.size(); i++ ) {
    var row = lines.get(i);
    getPage( row[8] );    
}

reader.close();

function getPage( urlString ) {
   print( "getting " + urlString );
   driver.get( urlString );
   var divList = driver.findElementsByTagName("div");
   for ( var j=0; j<divList.size(); j++ ) {
      if( divList.get(j).getAttribute("id") != null ) {
	if ( divList.get(j).getAttribute("id").equals("infoTable") ) {
	  print( divList.get(j).getText() );
        }  
      }   
   }
   //var infoTableTbl = infoTableDiv.findElement( By.tagName("table") );
   //print( infoTableTbl.getText() );
}