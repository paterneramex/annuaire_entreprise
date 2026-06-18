import React, {useEffect, useState} from 'react';
import api from './api';

function App(){
	const [employes, setEmployoes] = useState([]);

	useEffect(() => {
		api.get('employes/')
		.then(response => {
			setEmployoes(response.data);
		})
		.catch(error=>console.error("no data", error));
	}, []);

	return(
		<div>
			<h2>Le mieux qu'on puisse faire</h2>
			<ul>
				{employes.map(emp =>(
					<li key={emp.matricule}> {emp.nom} {emp.prenom} - {emp.poste} </li>
					))}
			</ul>
		</div>
		);
}

export default App;