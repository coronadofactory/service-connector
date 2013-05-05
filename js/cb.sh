compresor=../../builder/componentbuild/lib/yuicompressor/yuicompressor-2.4.jar

file1=service-connector.js
min=service-connector.min.js
java -jar $compresor $file1 -o $min --charset utf-8

file1=service-connector.js
file2=service-connector.bootstrap.js
min=service-connector.bootstrap.min.js

cat $file2 | awk '{if(NR<12)print}' >  tmp.js
cat $file1 | awk '{if(NR>11)print}' >> tmp.js
cat $file2 | awk '{if(NR>11)print}' >> tmp.js

java -jar $compresor tmp.js -o $min --charset utf-8
rm tmp.js
