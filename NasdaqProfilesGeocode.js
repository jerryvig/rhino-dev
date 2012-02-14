importPackage(java.io);
importPackage(java.lang);
importPackage(Packages.geo.google);
importPackage(Packages.geo.google.datamodel);
importPackage(Packages.liquibase.util.csv);

var reader = new CSVReader(new FileReader("/tmp/NasdaqSPOProfiles.csv"));
var lines = reader.readAll();
var writer = new CSVWriter(new FileWriter("/tmp/NasdaqSPOProfilesGeocode.csv"));
reader.close();

var st = new GeoAddressStandardizer( "ABQIAAAAI1oIsi6Dv7MlmxUm1lRR_xTmarcuMJj81CoryY3grjEx5dFcyxQoeQTublWNe-B1iLVnHNrRuJD6_w" );

for ( var i=0; i<lines.size(); i++ ) {
   var row = lines.get(i);
   var addyString = row[10].replace("\n",", ");
   try {
     var geoList = st.standardizeToGeoUsAddresses( addyString );
     var city = geoList.get(0).getCity();
     var state = geoList.get(0).getState();
     var outArray = Array();
     for ( var j=0; j<16; j++ ) outArray[j] = row[j];
     outArray[16] = city;
     outArray[17] = state;
     writer.writeNext( outArray );
     print( row[1] + ", " + city + ", " + state );
   } catch ( err ) {}
   Thread.sleep( 250 );
}

writer.close();
