import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import { speciesApi, breedApi } from '../../api/services';

const BreedForm = ({ breed, species, onSubmit, onCancel }) => {
  const [form, setForm] = useState({ name: '', speciesId: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (breed) {
      setForm({
        name: breed.name || '',
        speciesId: breed.speciesId || breed.species?.id || ''
      });
    } else {
      setForm({ name: '', speciesId: '' });
    }
  }, [breed]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(form);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Especie <span className="text-red-500">*</span>
        </label>
        <select
          name="speciesId"
          value={form.speciesId}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal/40"
        >
          <option value="">Seleccionar especie</option>
          {species.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombre <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          maxLength={50}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal/40"
          placeholder="Ej: Labrador, Persa, etc."
        />
      </div>
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-4 py-2 bg-teal text-white rounded-lg hover:bg-teal-dark disabled:opacity-50"
        >
          {loading ? 'Guardando...' : breed ? 'Actualizar' : 'Crear'}
        </button>
      </div>
    </form>
  );
};

const Breeds = () => {
  const navigate = useNavigate();
  const [breeds, setBreeds] = useState([]);
  const [species, setSpecies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [query, setQuery] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const speciesRes = await speciesApi.getAll();
      const speciesList = speciesRes.data || [];
      setSpecies(speciesList);
      
      // Obtener todas las razas de todas las especies
      const allBreeds = [];
      for (const sp of speciesList) {
        try {
          const breedsRes = await speciesApi.getBreeds(sp.id);
          const speciesBreeds = (breedsRes.data || []).map(breed => ({
            ...breed,
            speciesId: sp.id,
            speciesName: sp.name
          }));
          allBreeds.push(...speciesBreeds);
        } catch (err) {
          console.error(`Error cargando razas de ${sp.name}:`, err);
        }
      }
      setBreeds(allBreeds);
    } catch (err) {
      setError('Error cargando datos');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (formData) => {
    try {
      await breedApi.create(formData);
      setShowForm(false);
      setEditing(null);
      await loadData();
    } catch (err) {
      alert('Error creando raza');
      console.error('Error:', err);
    }
  };

  const handleUpdate = async (formData) => {
    try {
      await breedApi.update(editing.id, formData);
      setShowForm(false);
      setEditing(null);
      await loadData();
    } catch (err) {
      alert('Error actualizando raza');
      console.error('Error:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta raza?')) return;
    try {
      await breedApi.delete(id);
      await loadData();
    } catch (err) {
      alert('Error eliminando raza');
      console.error('Error:', err);
    }
  };

  const openEdit = (breed) => {
    setEditing(breed);
    setShowForm(true);
  };

  const openNew = () => {
    setEditing(null);
    setShowForm(true);
  };

  const filteredBreeds = breeds.filter((b) => {
    const matchText = query
      ? b.name?.toLowerCase().includes(query.toLowerCase())
      : true;
    const matchSpecies = speciesFilter
      ? String(b.speciesId || b.species?.id) === String(speciesFilter)
      : true;
    return matchText && matchSpecies;
  });

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => navigate('/admin/especies')}
              className="text-gray-500 hover:text-gray-700"
            >
              <span className="material-icons">arrow_back</span>
            </button>
            <span className="material-icons text-teal text-4xl">category</span>
            <h1 className="text-3xl font-bold text-gray-800">Gestión de Razas</h1>
          </div>
          <p className="text-gray-600 ml-14">Administra las razas por especie</p>
        </div>

        {error && <p className="text-red-600 bg-red-50 p-4 rounded-lg mb-4">{error}</p>}

        {!showForm && (
          <>
            <div className="flex flex-wrap justify-between items-center mb-4 gap-3">
              <button
                onClick={openNew}
                className="flex items-center gap-2 bg-teal hover:bg-teal-dark text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <span className="material-icons">add_circle</span>
                Agregar Raza
              </button>
              <button
                onClick={loadData}
                className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="material-icons">refresh</span>
                Refrescar
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <input
                    type="text"
                    placeholder="Buscar por nombre..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal/40"
                  />
                </div>
                <div className="min-w-[200px]">
                  <select
                    value={speciesFilter}
                    onChange={(e) => setSpeciesFilter(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal/40"
                  >
                    <option value="">Todas las especies</option>
                    {species.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal"></div>
          </div>
        ) : showForm ? (
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="material-icons text-teal">{editing ? 'edit' : 'add_box'}</span>
              {editing ? 'Editar Raza' : 'Nueva Raza'}
            </h3>
            <BreedForm
              breed={editing}
              species={species}
              onSubmit={editing ? handleUpdate : handleCreate}
              onCancel={() => {
                setShowForm(false);
                setEditing(null);
              }}
            />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {filteredBreeds.length === 0 ? (
              <div className="text-center py-12">
                <span className="material-icons text-6xl text-gray-300 mb-2">category</span>
                <p className="text-gray-500">No hay razas registradas</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nombre
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Especie
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredBreeds.map((breed) => (
                      <tr key={breed.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{breed.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-gray-500">
                            {breed.speciesName || breed.species?.name || '—'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex gap-2 justify-end">
                            <button onClick={() => openEdit(breed)} className="px-3 py-1.5 text-teal hover:bg-teal/10 rounded-md">
                              Editar
                            </button>
                            <button onClick={() => handleDelete(breed.id)} className="px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-md">
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Total: {filteredBreeds.length} {filteredBreeds.length === 1 ? 'raza' : 'razas'}
              </p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Breeds;
