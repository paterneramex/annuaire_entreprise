# annuaire project
## Description du projet

Numérisation de l'annuaire de RAMEX

- **Backend** : API REST en Django.
- **Frontend** : SPA en **React** (Vite) pour l’interface utilisateur.
- **Base de données** : **PostgreSQL**

### Backend
pip install django djangorestframework django-cors-headers python-dotenv psycopg2-binary
- **.env à coté de manage.py**<br>
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
- - if error<br>
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
  test<br>
  localhost:8000/api/employes/<br>
  localhost:8000/api/employes/12/<br>

### FrontEnd
- 
