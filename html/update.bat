@ECHO OFF

IF NOT EXIST .\src\UltraCreation (
    svn checkout https://svn.code.sf.net/p/ultracreation/code/ .\src\UltraCreation
)ELSE (
    svn update .\src\UltraCreation
)

IF NOT EXIST .\src\services\types (
    svn checkout https://svn.code.sf.net/p/ultracreation/www/api/src/services/types .\src\services\types
)ELSE (
    svn update .\src\services\types
)
svn update
