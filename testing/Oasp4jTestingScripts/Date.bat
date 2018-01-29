set hh=%time:~0,2%

set mm=%time:~3,2%



set /A mm=%mm%+2



if %mm% GTR 60 set /A mm=%mm%-60 && set /A hh=%hh%+1

if %hh% GTR 24 set hh=00



set hhmm=%hh%:%mm%

set sec=%time:~6,2%

set ms=%time:~9,2%

echo %hhmm%:%sec%.%ms%

SCHTASKS /Create /RU SYSTEM /ST %hhmm% /SC ONCE /TN spring-boot /TR "start mvn spring-boot:run --server.port=8081"
