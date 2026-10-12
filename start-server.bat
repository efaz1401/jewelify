@echo off
cd /d C:\Users\MSI\jewelify
if not exist ".data" mkdir ".data"
call npm --prefix server run dev > "C:\Users\MSI\jewelify\.data\server.log" 2>&1
