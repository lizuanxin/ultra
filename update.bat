@ECHO OFF

IF NOT EXIST .\src\UltraCreation (
    svn checkout https://svn.code.sf.net/p/ultracreation/code/ .\src\UltraCreation
)ELSE (
    svn update .\src\UltraCreation
)

IF EXIST .\src\services\cloud\types\.git (
    rmdir .\src\services\cloud\types /s /q
)

IF NOT EXIST .\src\services\cloud (
    svn checkout https://svn.code.sf.net/p/ultracreation/cloud .\src\services\cloud
)ELSE (
    svn update .\src\services\cloud
)

svn update
