importPackage(java.io);
importPackage(java.lang);
importPackage(Packages.liquibase.util.csv);
importPackage(com.gargoylesoftware.htmlunit);
importPackage(com.gargoylesoftware.htmlunit.html);

var reader = new CSVReader( new FileReader("/tmp/NasdaqIPOs.csv") );
var lines = reader.readAll();
var webClient = new WebClient( BrowserVersion.FIREFOX_3_6 );
webClient.setJavaScriptEnabled( false );
webClient.setCssEnabled( false );
var writer = new BufferedWriter( new FileWriter("/tmp/NasdaqIPOProfiles.csv") );

for ( var i=0; i<lines.size(); i++ ) {
    var row = lines.get(i);
    var profileData = getPage( row[8] );
    for ( var cols=0; cols<row.length; cols++ )	writer.write( "\"" + row[cols] + "\"," );
    writer.write( profileData + "\n" );
    Thread.sleep( 350 );    
}

reader.close();
writer.close();

function getPage( urlString ) {
   print( "getting " + urlString );
   var page = webClient.getPage( urlString );
   var divList = page.getElementsByTagName("div");

   var companyName = "";
   var companyAddress = "";
   var companyPhone = "";
   var companyWebsite = "";
   var employeeCount = "";
   var proposedSymbol = "";
   var sharesOutstanding = "";

   for ( var j=0; j<divList.size(); j++ ) {
     if ( divList.get(j).getAttribute("id") != null ) {
      if ( divList.get(j).getAttribute("id").equals("infoTable") ) {
	 var infoTableList = divList.get(j).getElementsByTagName("table");
         var infoTableTbl = infoTableList.get(0);
         var rowList = infoTableTbl.getElementsByTagName("tr");
         for ( var k=0; k<rowList.size(); k++ ) {
	     var row = rowList.get(k);
	     if ( row.getCell(0).asText().trim().equals("Company Name") ) {
		 companyName =  row.getCell(1).asText().trim();
	     }
             if ( row.getCell(0).asText().trim().equals("Company Address") ) {
                 companyAddress =  row.getCell(1).asText().trim();
             }
             if ( row.getCell(0).asText().trim().equals("Company Phone") ) {
                 companyPhone =  row.getCell(1).asText().trim();
             }
             if ( row.getCell(0).asText().trim().equals("Company Website") ) {
                 companyWebsite =  row.getCell(1).asText().trim();
             }
             if ( row.getCell(0).asText().trim().startsWith("Employees") ) {
                 employeeCount =  row.getCell(1).asText().trim();
             }
             if ( row.getCell(0).asText().trim().equals("Proposed Symbol") ) {
                proposedSymbol =  row.getCell(1).asText().trim();
             }
             if ( row.getCell(0).asText().trim().equals("Shares Outstanding") ) {
                 sharesOutstanding =  row.getCell(1).asText().trim();
             }                                      
         }
      }   
     } 
   }

   return  "\"" + companyName + "\",\"" + companyAddress + "\",\"" + companyPhone + "\",\"" + companyWebsite + "\",\"" + employeeCount + "\",\"" + sharesOutstanding + "\"";
}