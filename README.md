# annuaire project
## Description du projet
Numérisation de l'annuaire de RAMEX

- **Backend** : API REST en Django.
- **Frontend** : SPA en **React** (Vite) pour l’interface utilisateur.
- **Base de données** : **PostgreSQL**

### Backend
git pull https://github.com/paterneramex/annuaire_entreprise.git<br>
cd backend<br>
python -m venv venv<br>
venv\Scripts\activate<br>
pip install django djangorestframework django-cors-headers python-dotenv psycopg2-binary<br>

- **Créer un fichier.env à coté de manage.py**<br>
DB_NAME=annuaire_db<br>
DB_USER=your_postgre_user<br>
DB_PASSWORD=your_postgre_password<br>
DB_HOST=localhost<br>
DB_PORT=5432<br>
SECRET_KEY=#generate key and paste here by using [python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"]<br><br>

- **Configure Postgre db and user**<br>
  psql -U postgres -d postgres<br>
  CREATE DATABASE annuaire_db;<br>
  CREATE USER it WITH PASSWORD 'your_postgre_password';<br>
  \c annuaire_db;<br>
  ALTER SCHEMA PUBLIC OWNER TO it;<br>
  GRANT ALL PRIVILEGES ON DATABASE annuaire_db TO it;<br><br>

- **Migrate**<br>
  python manage.py migrate
  - if error<br>
    del employes\migrations\*.py<br>
    del /Q employes\migrations\__pycache__\*<br>
    python manage.py makemigration employes<br>
    python manage.py migrate<br><br>

- **superuser pour la partie admin de django**<br>
  python manage.py createsuperuser<br><br>

- **populate the database**<br>
D:\annuaire\backend>psql -U it -d annuaire_db -f data.sql

- **Run server**<br>
  python manage.py runserver 0.0.0.0:8000<br>
  Tester :<br>
  localhost:8000/api/employes/<br>
  localhost:8000/api/employes/12/<br>

### FrontEnd
#### Initialisation de React<br>
  annuaire_entreprise>npx create-react-app frontend<br>
  annuaire_entreprise>cd frontend<br>
  Installer la bibliothèque axios pour simplifier(simple que fetch() de JS) l'appel vers API Django <br>
  annuaire\frontend>npm install axios<br>
  DJango gets data from postgre => EmployeSerializer (text -> JSON)<br>
Axios gets the serializedJSON => Objet JS (tableau contenant des dicts)<br>
npm list
#### frontend/src/App.js (display)
#### frontend/src/api.js (manage toward-backend requests)
npm install -D tailwindcss@3.4.17 postcss autoprefixer<br>
npm list @tailwindcss/cli <br>
npx tailwindcss init -p<br>
#### configure tailwind
- frontend/tailwind.config.js (<- point here React components) <br>
content: ["./src/\**/*{.extension}"] ** parcourir récursivement tous les sous-dossiers, quel que soit leur niveau
- frontend/src/index.css (<-update) <br>
- frontend/src/App.js (<-update) <br>
