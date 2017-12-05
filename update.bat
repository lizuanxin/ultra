@ECHO OFF

IF NOT EXIST .\src\UltraCreation (
    svn checkout https://svn.code.sf.net/p/ultracreation/code/ .\src\UltraCreation
)ELSE (
    svn update .\src\UltraCreation
)

IF NOT EXIST .\src\services\cloud (
    svn checkout https://svn.code.sf.net/p/ultracreation/cloud .\src\services\cloud
)ELSE (
    svn update .\src\services\cloud
)

IF NOT EXIST .\src\services\cloud\types (
    svn checkout https://svn.code.sf.net/p/ultracreation/www/api/src/services/types .\src\services\cloud\types
)ELSE (
    svn update .\src\services\cloud\types
)

svn update
