SET archetypeVersion=%1
SET artifactId=%2
SET groupId=%3
SET package=%4
SET projVersion=%5
SET filePath=%6

SET pathToProject= %cd%

Echo current directory is %cd%

Echo check for project path %pathToProject%

if exist %pathToProject%\%artifactId% (
 echo project already exists. Please delete and try to create or change projec name.
goto :endofscript
) else (
    echo "Creating project..."
cd %pathToProject%
call mvn -DarchetypeVersion=2.4.0 -DarchetypeGroupId=io.oasp.java.templates -DarchetypeArtifactId=oasp4j-template-server archetype:generate -DgroupId=%groupId% -DartifactId=%artifactId% -Dversion=projVersion -Dpackage=%package% -DinteractiveMode=false

if %ERRORLEVEL% == 0 goto :buildProject
echo "Errors encountered during execution.  Exited with status: %errorlevel%"
goto :endofscript
)


:buildProject
cd %pathToProject%\%artifactId%
echo "Build project with mvn install..."
call mvn install
if %ERRORLEVEL% == 0 goto :createServices
echo "Errors encountered during execution.  Exited with status: %errorlevel%"
goto :endofscript


:createServices
echo "creating api folder ..."
echo path is %pathToProject%\%artifactId%\core\src\main\java\%package:.=\%\general\service\impl\config
cd %pathToProject%\%artifactId%\core\src\main\java\%package:.=\%\general\service\impl\config
mkdir api
cd api
echo package %package%.general.service.impl.config.api;> SampleRestService.java
echo import %package%.general.common.api.RestService;>>SampleRestService.java
type %filePath%\RestServiceInterface.txt >> SampleRestService.java
cd..
mkdir impl
cd impl
echo package %package%.general.service.impl.config.impl;> SampleRestServiceImpl.java
echo import %package%.general.service.impl.config.api.SampleRestService;>> SampleRestServiceImpl.java
type %filePath%\RestServiceInterfaceImpl.txt >> SampleRestServiceImpl.java
if %ERRORLEVEL% == 0 goto :rebuildProject 
echo "Errors encountered during execution.  Exited with status: %errorlevel%"
goto :endofscript

:rebuildProject
echo "ReBuild project with mvn install..."
cd %pathToProject%\%artifactId%
call mvn install
if %ERRORLEVEL% == 0 goto :createTestForRestServices
echo "Errors encountered during execution.  Exited with status: %errorlevel%"
goto :endofscript

:createTestForRestServices
echo "creating test for rest services"
cd %pathToProject%\%artifactId%\core\src\test\java\%package:.=\%\general\service\impl\config
echo package %package%.general.service.impl.config;>>TestSampleRestService.java
type %filePath%\TestRestService.txt>> TestSampleRestService.Java
if %ERRORLEVEL% == 0 goto :appLaunch
echo "Errors encountered during execution.  Exited with status: %errorlevel%"
goto :endofscript

:appLaunch
cd %pathToProject%\%artifactId%\server
Echo "launching Application..."



:success
echo Script completed successfully

:endofscript
Exit /B %ERRORLEVEL%