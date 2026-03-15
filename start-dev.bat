@echo off
echo Starting PetConnect Local Development Environment
echo ==================================================

echo Starting MongoDB...
net start MongoDB
timeout /t 2 /nobreak > nul

echo Starting Backend Server...
start cmd /k "cd Petconnet_BE && npm run dev"

echo Waiting for backend to start...
timeout /t 3 /nobreak > nul

echo Starting Frontend Server...
start cmd /k "cd Petconnet_FE && npm run dev"

echo.
echo Development servers started!
echo - Backend: http://localhost:5000
echo - Frontend: http://localhost:5173
echo - MongoDB: mongodb://localhost:27017/PetConnect
echo.
echo Press any key to stop all servers...
pause > nul

echo Stopping servers...
taskkill /f /im node.exe > nul 2>&1
echo All servers stopped.