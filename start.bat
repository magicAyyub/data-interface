@echo off
echo Demarrage de l'application de recherche...
echo.

REM Vérification de Docker
docker --version > nul 2>&1
if %errorlevel% neq 0 (
    echo Docker n'est pas lance. Veuillez lancer Docker Desktop.
    pause
    exit
)

REM Démarrage de la base de données
echo Demarrage de la base de donnees...
cd backend
docker-compose up -d

REM Activation de l'environnement Python et lancement du backend
start "Backend Flask" cmd /k "call venv\Scripts\activate && python app.py"

REM Retour au dossier racine
cd ..

REM Attente de quelques secondes pour que Flask démarre
timeout /t 5 /nobreak

REM Lancement du frontend React
echo Demarrage de l'interface...
start "Frontend React" cmd /k "cd frontend && npm run dev"

REM Attente de quelques secondes
timeout /t 5 /nobreak

REM Ouverture automatique du navigateur
start http://localhost:5173

echo.
echo Application lancee avec succes !
echo Pour arreter l'application, fermez les fenetres et Docker Desktop.
echo.
exit