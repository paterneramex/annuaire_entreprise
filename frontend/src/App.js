import React, { useEffect, useState, useMemo, useRef } from 'react';
import api from './api';

<<<<<<< HEAD
const init = { matricule: '', nom: '', prenom: '', poste: '', agence: '', telephone: '' };
const fields = ['matricule', 'nom', 'prenom', 'poste', 'agence', 'telephone'];
const perPageOptions = [10, 20, 50];

function App() {
  // Données principales
  const [emps, setEmps] = useState([]);
  const [form, setForm] = useState(init);
  const [edit, setEdit] = useState(null);

  // Authentification
  const [token, setToken] = useState(localStorage.getItem('access_token'));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showLogin, setShowLogin] = useState(false);

  // UI et Filtres
  const [load, setLoad] = useState(true);
  const [msg, setMsg] = useState({ t: '', txt: '' });
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState({ field: 'nom', dir: 'asc' });
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const formRef = useRef(null);

  // Chargement des employés
  const fetchEmps = () => {
    setLoad(true);
    api.get('employes/')
      .then(response => {
        setEmps(response.data);
        setMsg({ t: '', txt: '' });
      })
      .catch(error => {
        console.error("Erreur chargement :", error);
        setMsg({ t: 'error', txt: 'Impossible de charger les employés' });
      })
      .finally(() => setLoad(false));
  };

  useEffect(() => {
    fetchEmps();
  }, []);

  // Scroll vers le formulaire de modif
  useEffect(() => {
    if (edit && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [edit]);

  // Filtrage, Tri, Pagination
  const filtered = useMemo(() => {
    let res = emps.filter(e =>
      fields.some(key => e[key]?.toString().toLowerCase().includes(search.toLowerCase()))
    );
    res.sort((a, b) => {
      let va = a[sort.field], vb = b[sort.field];
      if (va < vb) return sort.dir === 'asc' ? -1 : 1;
      if (va > vb) return sort.dir === 'asc' ? 1 : -1;
      return 0;
    });
    return res;
  }, [emps, search, sort]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  // GESTION DU LOGIN
  const handleLogin = (e) => {
    e.preventDefault();
    api.post('token/', { username, password })
      .then(response => {
        const { access, refresh } = response.data;
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
        setToken(access);
        setShowLogin(false);
        setUsername('');
        setPassword('');
        setMsg({ t: 'success', txt: 'Connexion réussie ! Vous pouvez modifier les données.' });
      })
      .catch(err => {
        console.error("Erreur login :", err);
        setMsg({ t: 'error', txt: 'Identifiants invalides' });
      });
  };

  // GESTION DE LA DÉCONNEXION
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setToken(null);
    setEdit(null);
    setForm(init);
    setMsg({ t: 'success', txt: 'Vous êtes déconnecté.' });
  };

  // Soumission (Créer / Modifier)
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { ...form, telephone: form.telephone.trim() || null };

    if (edit) {
      api.put(`employes/${edit.matricule}/`, data)
        .then(() => {
          setEmps(p => p.map(x => x.matricule === edit.matricule ? { ...x, ...data } : x));
          setMsg({ t: 'success', txt: 'Employé modifié avec succès' });
          setForm(init);
          setEdit(null);
          //setPage(1);
        })
        .catch(err => {
          console.error("Erreur modification :", err);
          const txt = err.response?.status === 401 || err.response?.status === 403 
            ? 'Action non autorisée. Veuillez vous connecter.' 
            : 'Erreur lors de la modification';
          setMsg({ t: 'error', txt });
        });
    } else {
      api.post('employes/', data)
        .then(response => {
          setEmps(p => [...p, response.data]);
          setMsg({ t: 'success', txt: 'Employé créé avec succès' });
          setForm(init);
          setPage(1);
        })
        .catch(err => {
          console.error("Erreur création :", err);
          const txt = err.response?.status === 401 || err.response?.status === 403 
            ? 'Action non autorisée. Veuillez vous connecter.' 
            : 'Erreur lors de la création';
          setMsg({ t: 'error', txt });
        });
    }
  };

  // Suppression
  const del = (m) => {
    if (!window.confirm('Supprimer cet employé ?')) return;

    api.delete(`employes/${m}/`)
      .then(() => {
        setEmps(p => p.filter(x => x.matricule !== m));
        setMsg({ t: 'success', txt: 'Employé supprimé' });
      })
      .catch(err => {
        console.error("Erreur suppression :", err);
        const txt = err.response?.status === 401 || err.response?.status === 403 
          ? 'Action non autorisée. Veuillez vous connecter.' 
          : 'Erreur lors de la suppression';
        setMsg({ t: 'error', txt });
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* BARRE EN-TÊTE AVEC BOUTON DE CONNEXION */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">Gestion Employés</h1>
          {token ? (
            <div className="flex items-center gap-4">
              <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">Session Active</span>
              <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-700 transition">
                Déconnexion
              </button>
            </div>
          ) : (
            <button onClick={() => setShowLogin(!showLogin)} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition">
              {showLogin ? 'Fermer' : 'Espace Admin (Connexion)'}
            </button>
          )}
        </div>

        {/* Message d'alerte global */}
        {msg.txt && (
          <div className={`p-4 mb-6 rounded-xl font-medium ${msg.t === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {msg.txt}
          </div>
        )}

        {/* ==================== FORMULAIRE VISUEL DE LOGIN ==================== */}
        {showLogin && !token && (
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-xl p-6 mb-8 text-white">
            <h2 className="font-semibold mb-4 text-xl">Connexion Administrateur</h2>
            <form onSubmit={handleLogin} className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="Nom d'utilisateur"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                className="p-3 rounded-xl text-gray-900 outline-none flex-1"
              />
              <input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="p-3 rounded-xl text-gray-900 outline-none flex-1"
              />
              <button type="submit" className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition">
                Se connecter
              </button>
            </form>
          </div>
        )}

        {/* ==================== FORMULAIRE CRUD (Affiché uniquement si connecté) ==================== */}
        {token && (
          <div ref={formRef} className="bg-white rounded-2xl shadow p-6 mb-8 border-t-4 border-blue-600">
            <h2 className="font-semibold mb-4 text-xl text-gray-700">
              {edit ? '✏️ Modifier' : '➕ Ajouter'} un Employé
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {fields.map(f => (
                <input
                  key={f}
                  name={f}
                  placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
                  value={form[f] || ''}
                  onChange={e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))}
                  required={f !== 'telephone'}
                  disabled={edit && f === 'matricule'} // Sécurité : on ne modifie pas la clé primaire
                  className="p-3 border rounded-xl focus:border-blue-500 outline-none"
                />
              ))}
              <div className="md:col-span-3 flex gap-3 mt-2">
                <button type="submit" className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700">
                  {edit ? 'Mettre à jour' : 'Créer'}
                </button>
                <button type="button" onClick={() => { setForm(init); setEdit(null); }} className="flex-1 bg-gray-500 text-white py-3 rounded-xl font-semibold">
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ==================== LISTE + CONTRÔLES (Toujours accessible en Read-Only) ==================== */}
        <div className="bg-white rounded-2xl shadow p-6">
          {/* ... Votre bloc de recherche, tris et pagination reste identique ... */}
          <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-center">
            <input
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="w-full md:w-80 p-3 border rounded-xl"
            />
            <div className="flex gap-3 items-center flex-wrap">
              <select value={sort.field} onChange={e => setSort(s => ({ ...s, field: e.target.value }))} className="p-3 border rounded-xl">
                {['matricule', 'nom', 'prenom', 'poste', 'agence'].map(f => <option key={f} value={f}>{f}</option>)}
              </select>
              <button onClick={() => setSort(s => ({ ...s, dir: s.dir === 'asc' ? 'desc' : 'asc' }))} className="px-4 py-3 border rounded-xl">
                {sort.dir === 'asc' ? '↑' : '↓'}
              </button>
              <select value={perPage} onChange={e => { setPerPage(+e.target.value); setPage(1); }} className="p-3 border rounded-xl">
                {perPageOptions.map(n => <option key={n} value={n}>{n} par page</option>)}
              </select>
            </div>
          </div>

          {load ? (
            <p className="text-center py-12">Chargement...</p>
          ) : (
            <>
              <div className="space-y-3">
                {paginated.map(emp => (
                  <div key={emp.matricule} className="flex items-center justify-between p-5 border rounded-2xl hover:bg-gray-50 group">
                    <div>
                      <div className="font-medium text-lg text-gray-900">
                        {emp.prenom} {emp.nom} <span className="text-gray-500 text-sm">({emp.matricule})</span>
                      </div>
                      <div className="text-gray-600">{emp.poste} • {emp.agence}</div>
                      {emp.telephone && <div className="text-sm text-gray-500">{emp.telephone}</div>}
                    </div>

                    {/* BOUTONS ACTIONS : Masqués si pas connecté, apparaissent au survol si connecté */}
                    {token && (
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                        <button onClick={() => { setForm(emp); setEdit(emp); }} className="px-5 py-2 text-blue-600 hover:bg-blue-50 rounded-xl">
                          ✏️ Modifier
                        </button>
                        <button onClick={() => del(emp.matricule)} className="px-5 py-2 text-red-600 hover:bg-red-50 rounded-xl">
                          🗑 Supprimer
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                {filtered.length === 0 && <p className="text-center py-12 text-gray-500">Aucun résultat trouvé</p>}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-5 py-3 border rounded-xl disabled:opacity-40">Précédent</button>
                  <span className="px-6 py-3 font-medium">Page {page} sur {totalPages}</span>
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-5 py-3 border rounded-xl disabled:opacity-40">Suivant</button>
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
=======
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
>>>>>>> dc53584ad54ad99af434d315b54fddaa2fe02e62
}

export default App;