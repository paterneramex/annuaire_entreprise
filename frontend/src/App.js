import React, { useEffect, useState, useCallback } from 'react';
import api from './api';

const initialData = { matricule:'', nom:'', prenom:'', poste:'', agence:'', telephone:'' };

const fields = ['matricule','nom','prenom','poste','agence','telephone'];

function App() {
  const [employes, setEmployes] = useState([]);
  const [form, setForm] = useState(initialData);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState({type:'', text:''});

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('employes/');
      setEmployes(data);
    } catch (e) {
      setMsg({type:'error', text:'Erreur de chargement'});
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, telephone: form.telephone.trim() || null };

    try {
      if (editing) {
        await api.put(`employes/${editing.matricule}/`, payload);
        setEmployes(prev => prev.map(emp => emp.matricule === editing.matricule ? {...payload} : emp));
        setMsg({type:'success', text:'Employé modifié !'});
      } else {
        const { data } = await api.post('employes/', payload);
        setEmployes(prev => [...prev, data]);
        setMsg({type:'success', text:'Employé créé !'});
      }
      setForm(initialData);
      setEditing(null);
    } catch (err) {
      setMsg({type:'error', text: err.response?.data?.telephone ? 'Téléphone invalide' : 'Erreur lors de l\'opération'});
    }
  };

  const handleEdit = (emp) => {
    setForm(emp);
    setEditing(emp);
  };

  const handleDelete = async (matricule) => {
    if (!window.confirm('Supprimer cet employé ?')) return;
    try {
      await api.delete(`employes/${matricule}/`);
      setEmployes(prev => prev.filter(e => e.matricule !== matricule));
      setMsg({type:'success', text:'Employé supprimé'});
    } catch {
      setMsg({type:'error', text:'Erreur de suppression'});
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-600 mb-8">Gestion Employés</h1>

        {/* Formulaire */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">{editing ? 'Modifier' : 'Ajouter'} un employé</h2>
          
          {msg.text && (
            <div className={`p-3 mb-4 rounded-lg ${msg.type==='success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {msg.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map(f => (
              <input
                key={f}
                name={f}
                placeholder={f === 'telephone' ? '+261 34 XX XXX XX' : f.charAt(0).toUpperCase() + f.slice(1)}
                value={form[f] || ''}
                onChange={e => setForm(prev => ({...prev, [e.target.name]: e.target.value}))}
                required={f !== 'telephone'}
                className="p-3 border rounded-lg focus:border-blue-500 outline-none"
              />
            ))}
            <div className="md:col-span-2 flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
              >
                {editing ? 'Mettre à jour' : 'Créer'}
              </button>
              {editing && (
                <button type="button" onClick={() => {setForm(initialData); setEditing(null);}} 
                  className="flex-1 bg-gray-500 text-white py-3 rounded-lg font-semibold">
                  Annuler
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Liste */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between mb-6">
            <h2>Liste des employés ({employes.length})</h2>
            <button onClick={fetchData} className="text-blue-600 hover:underline">Rafraîchir</button>
          </div>

          {loading ? <p className="text-center py-10">Chargement...</p> : (
            <div className="space-y-3">
              {employes.map(emp => (
                <div key={emp.matricule} className="flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50">
                  <div>
                    <div className="font-medium">
                      {emp.prenom} {emp.nom} <span className="text-gray-500 text-sm">({emp.matricule})</span>
                    </div>
                    <div className="text-gray-600 text-sm">{emp.poste} • {emp.agence}</div>
                    {emp.telephone && <div className="text-gray-500 text-sm">{emp.telephone}</div>}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(emp)} className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg">Modifier</button>
                    <button onClick={() => handleDelete(emp.matricule)} className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg">Supprimer</button>
                  </div>
                </div>
              ))}
              {employes.length === 0 && <p className="text-center py-10 text-gray-500">Aucun employé</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;