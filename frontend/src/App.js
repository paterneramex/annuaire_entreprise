import React, { useEffect, useState, useMemo, useRef } from 'react';
import api from './api';

// Déclaration des constantes
const init = { matricule: '', nom: '', prenom: '', poste: '', agence: '', telephone: '' };
const fields = ['matricule', 'nom', 'prenom', 'poste', 'agence', 'telephone'];
const perPageOptions = [10, 20, 50];

function App() {
  // États des données principales
  const [emps, setEmps] = useState([]);
  const [form, setForm] = useState(init);
  const [edit, setEdit] = useState(null);

  // États pour l'UI et les filtres
  const [load, setLoad] = useState(true);
  const [msg, setMsg] = useState({ t: '', txt: '' });
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState({ field: 'nom', dir: 'asc' });
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // Référence pour le défilement automatique vers le formulaire
  const formRef = useRef(null);

  // Récupération des données
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

  // Défilement automatique vers le formulaire quand on clique sur "Modifier"
  useEffect(() => {
    if (edit && formRef.current) {
      formRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [edit]);

  // Filtrage, Tri, Pagination
  const filtered = useMemo(() => {
    let res = emps.filter(e =>
      Object.values(e).some(v => v?.toString().toLowerCase().includes(search.toLowerCase()))
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

  // Soumission (Créer / Modifier)
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { ...form, telephone: form.telephone.trim() || null };

    if (edit) {
      api.put(`employes/${edit.matricule}/`, data)
        .then(() => {
          setEmps(p => p.map(x => x.matricule === edit.matricule ? data : x));
          setMsg({ t: 'success', txt: 'Employé modifié avec succès' });
          setForm(init);
          setEdit(null);
          setPage(1);
        })
        .catch(err => {
          console.error("Erreur modification :", err);
          const txt = err.response?.data?.telephone ? 'Téléphone invalide' : 'Erreur lors de la modification';
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
          const txt = err.response?.data?.telephone ? 'Téléphone invalide' : 'Erreur lors de la création';
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
        setMsg({ t: 'error', txt: 'Erreur lors de la suppression' });
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-600 mb-8">Gestion Employés</h1>

        {/* ==================== FORMULAIRE ==================== */}
        <div ref={formRef} className="bg-white rounded-2xl shadow p-6 mb-8">
          <h2 className="font-semibold mb-4 text-xl">
            {edit ? 'Modifier' : 'Ajouter'} un Employé
          </h2>

          {msg.txt && (
            <div className={`p-3 mb-4 rounded-lg ${msg.t === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {msg.txt}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {fields.map(f => (
              <input
                key={f}
                name={f}
                placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
                value={form[f] || ''}
                onChange={e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))}
                required={f !== 'telephone'}
                className="p-3 border rounded-xl focus:border-blue-500 outline-none"
              />
            ))}
            <div className="md:col-span-3 flex gap-3 mt-2">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700"
              >
                {edit ? 'Mettre à jour' : 'Créer'}
              </button>
              {edit && (
                <button
                  type="button"
                  onClick={() => { setForm(init); setEdit(null); }}
                  className="flex-1 bg-gray-500 text-white py-3 rounded-xl font-semibold"
                >
                  Annuler
                </button>
              )}
            </div>
          </form>
        </div>

        {/* ==================== LISTE + CONTRÔLES ==================== */}
        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-center">
            <input
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="w-full md:w-80 p-3 border rounded-xl"
            />

            <div className="flex gap-3 items-center flex-wrap">
              <select
                value={sort.field}
                onChange={e => setSort(s => ({ ...s, field: e.target.value }))}
                className="p-3 border rounded-xl"
              >
                {['matricule', 'nom', 'prenom', 'poste', 'agence'].map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>

              <button
                onClick={() => setSort(s => ({ ...s, dir: s.dir === 'asc' ? 'desc' : 'asc' }))}
                className="px-4 py-3 border rounded-xl"
              >
                {sort.dir === 'asc' ? '↑' : '↓'}
              </button>

              <select
                value={perPage}
                onChange={e => { setPerPage(+e.target.value); setPage(1); }}
                className="p-3 border rounded-xl"
              >
                {perPageOptions.map(n => (
                  <option key={n} value={n}>{n} par page</option>
                ))}
              </select>
            </div>
          </div>

          {load ? (
            <p className="text-center py-12">Chargement...</p>
          ) : (
            <>
              <div className="space-y-3">
                {paginated.map(emp => (
                  <div
                    key={emp.matricule}
                    className="flex items-center justify-between p-5 border rounded-2xl hover:bg-gray-50 group"
                  >
                    <div>
                      <div className="font-medium text-lg">
                        {emp.prenom} {emp.nom}{' '}
                        <span className="text-gray-500 text-sm">({emp.matricule})</span>
                      </div>
                      <div className="text-gray-600">{emp.poste} • {emp.agence}</div>
                      {emp.telephone && <div className="text-sm text-gray-500">{emp.telephone}</div>}
                    </div>

                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                      <button
                        onClick={() => { setForm(emp); setEdit(emp); }}
                        className="px-5 py-2 text-blue-600 hover:bg-blue-50 rounded-xl"
                      >
                        ✏️ Modifier
                      </button>
                      <button
                        onClick={() => del(emp.matricule)}
                        className="px-5 py-2 text-red-600 hover:bg-red-50 rounded-xl"
                      >
                        🗑 Supprimer
                      </button>
                    </div>
                  </div>
                ))}
                {filtered.length === 0 && (
                  <p className="text-center py-12 text-gray-500">Aucun résultat trouvé</p>
                )}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-5 py-3 border rounded-xl disabled:opacity-40"
                  >
                    Précédent
                  </button>
                  <span className="px-6 py-3 font-medium">Page {page} sur {totalPages}</span>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-5 py-3 border rounded-xl disabled:opacity-40"
                  >
                    Suivant
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;