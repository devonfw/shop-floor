IF EXIST D:\Jenkins\workspace\createProject\sampleNewTest (
echo Yes 
del /S /q D:\Jenkins\workspace\createProject\sampleNewTest\*
rmdir /S /q D:\Jenkins\workspace\createProject\sampleNewTest
) ELSE (
echo No
)