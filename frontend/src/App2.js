import React, {useEffect, useState} from 'react';
import api from './api';

function App(){
  const [employes, setEmployes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [matricule, setMatricule] = useState('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [poste, setPoste] = useState('');
  const [agence, setAgence] = useState('');
  const [telephone, setTelephone] = useState('');

  useEffect(() => {
    fetchEmployes();
  }, []);

  const fetchEmployes = () =>{
    setLoading(true);
    api.get('employes/')
    .then(response => {
      setEmployes(response.data);
      setError(null);
    })
    .catch(error=>console.error("no data", error));
  }

  return();
}