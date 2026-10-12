@echo off
REM Jewelify - start everything (MongoDB + API + storefront)
echo Starting MongoDB...
start "" /min "C:\Users\MSI\mongodb-local\extracted\mongodb-win32-x86_64-windows-6.0.26\bin\mongod.exe" --dbpath "C:\Users\MSI\jewelify\.data\mongo" --port 27017 --bind_ip 127.0.0.1
timeout /t 4 /nobreak >nul
echo Starting API server (http://localhost:5000)...
start "Jewelify API" /min "C:\Users\MSI\jewelify\start-server.bat"
echo Starting storefront (http://localhost:5173)...
start "Jewelify Store" /min "C:\Users\MSI\jewelify\start-client.bat"
echo.
echo Done.  Store:      http://localhost:5173
echo        Admin panel: http://localhost:5173/admin  (admin@jewelify.com / AdminPass123!)
pause
