importPackage(java.io);
importPackage(Packages.geo.google);
importPackage(Packages.geo.google.datamodel);
importPackage(Packages.liquibase.util.csv);

var reader = new CSVReader(new FileReader("/tmp/NasdaqIPOProfiles.csv"));
var lines = reader.readAll();
reader.close();

for ( var i=0; i<lines.size(); i++ ) {
   print( lines.get(i)[0] );
}
