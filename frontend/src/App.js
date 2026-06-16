import React, {useEffect, useState} from 'react';
import api from './api';

/*
  useState: stocke la liste des employés
  useEffect: déclencheur, dès que la page React se charge, il lance automatiquement
  la requete vers http://localhost:8000/api/employes/
*/

function App() {
  const [employes, setEmployes] = useState([]);//setEmployes seul peut modifier employes

  useEffect(() => {
    //Appel de l'API Django
    api.get('employes/').then(response => {//.then() promesse
      setEmployes(response.data);//response object complexe renvoyé par Axios contenant toute la page
    })
    .catch(error => console.error("Erreur lors de la recuperation: ", error));
  },[]);
  return (
    <div className="App">
      <h1>Annuaire de l'Entreprise </h1>
      <ul>
        {employes.map(emp => ( //,map() boucle JSON => HTML
            <li key={emp.matricule}>{emp.prenom} {emp.nom} - {emp.post}</li>
          ))}
      </ul>
    </div>
  );
}

export default App;