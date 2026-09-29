@echo off
cd /d C:\Users\MSI\jewelify
if not exist ".data" mkdir ".data"
call npm --prefix client run dev > "C:\Users\MSI\jewelify\.data\client.log" 2>&1
