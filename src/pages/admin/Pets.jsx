import React, { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import SearchableDropdown from '../../components/SearchableDropdown';
import { petApi, speciesApi } from '../../api/services';

const AdminPets = () => {
  const [loading, setLoading] = useState(true);
  const [pets, setPets] = useState([]);
  const [query, setQuery] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    speciesId: '',
    breedId: '',
    age: '',
    weight: '',
    sex: ''
  });
  const [species, setSpecies] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [loadingBreeds, setLoadingBreeds] = useState(false);

  useEffect(() => {
    loadPets();
    loadSpecies();
  }, []);

  useEffect(() => {
    if (formData.speciesId) {
      loadBreeds(formData.speciesId);
    } else {
      setBreeds([]);
      setFormData(prev => ({ ...prev, breedId: '' }));
    }
  }, [formData.speciesId]);

  const loadSpecies = async () => {
    try {
      const response = await speciesApi.getAll();
      setSpecies(response.data || []);
    } catch (error) {
      console.error('Error cargando especies:', error);
    }
  };

  const loadBreeds = async (speciesId) => {
    setLoadingBreeds(true);
    try {
      const response = await speciesApi.getBreeds(speciesId);
      setBreeds(response.data || []);
    } catch (error) {
      console.error('Error cargando razas:', error);
      setBreeds([]);
    } finally {
      setLoadingBreeds(false);
    }
  };

  const loadPets = async () => {
    setLoading(true);
    try {
      const res = await petApi.getAll();
      setPets(res.data || []);
    } catch (error) {
      console.error('Error al cargar mascotas:', error);
      setFeedback({ type: 'error', message: 'No se pudieron cargar las mascotas' });
    } finally {
      setLoading(false);
    }
  };

  const filteredPets = useMemo(() => {
    if (!query) return pets;
    const q = query.toLowerCase();
    return pets.filter((pet) =>
      [
        pet.name, 
        pet.speciesName, 
        pet.species?.name, 
        pet.species, 
        pet.breedName, 
        pet.breed?.name, 
        pet.breed, 
        pet.owner?.name, 
        pet.owner?.email
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(q))
    );
  }, [pets, query]);

  const buildPetPayload = (pet, overrides = {}) => ({
    name: overrides.name ?? pet.name ?? '',
    speciesId: overrides.speciesId ?? pet.speciesId ?? null,
    breedId: overrides.breedId ?? pet.breedId ?? null,
    age: overrides.age ?? pet.age ?? 1,
    weight: overrides.weight ?? pet.weight ?? 1,
    sex: overrides.sex ?? pet.sex ?? 'M',
    ownerId: pet.owner?.id ?? pet.ownerId ?? null,
  });

  const openEdit = (pet) => {
    setEditingPet(pet);
    console.log('Pet a editar:', pet);
    setFormData({
      name: pet.name || '',
      speciesId: pet.species?.id || pet.speciesId || '',
      breedId: pet.breed?.id || pet.breedId || '',
      age: pet.age || '',
      weight: pet.weight || '',
      sex: pet.sex === 'Macho' ? 'M' : pet.sex === 'Hembra' ? 'F' : 'M'
    });
    setShowModal(true);
    setFeedback(null);
  };

  const handleActivate = async (id) => {
    if (!confirm('¿Activar esta mascota?')) return;
    try {
      await petApi.activate(id);
      setFeedback({ type: 'success', message: 'Mascota activada correctamente' });
      loadPets();
    } catch (error) {
      console.error('Error activando mascota:', error);
      setFeedback({ type: 'error', message: error.response?.data?.message || 'Error al activar la mascota' });
    }
  };

  const handleDeactivate = async (id) => {
    if (!confirm('¿Desactivar esta mascota?')) return;
    try {
      await petApi.deactivate(id);
      setFeedback({ type: 'success', message: 'Mascota desactivada correctamente' });
      loadPets();
    } catch (error) {
      console.error('Error desactivando mascota:', error);
      setFeedback({ type: 'error', message: error.response?.data?.message || 'Error al desactivar la mascota' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editingPet) return;

    try {
      const payload = {
        name: formData.name.trim(),
        speciesId: parseInt(formData.speciesId, 10),
        breedId: parseInt(formData.breedId, 10),
        age: parseInt(formData.age, 10),
        weight: parseFloat(formData.weight),
        sex: formData.sex === 'M' ? 'Macho' : 'Hembra',
        ownerId: editingPet.owner?.id || editingPet.ownerId
      };
      
      console.log('Payload a enviar:', payload);
      await petApi.update(editingPet.id, payload);
      setFeedback({ type: 'success', message: 'Mascota actualizada correctamente' });
      setShowModal(false);
      setEditingPet(null);
      setFormData({ name: '', speciesId: '', breedId: '', age: '', weight: '', sex: '' });
      loadPets();
    } catch (error) {
      console.error('Error actualizando mascota:', error);
      console.error('Detalle del error:', error.response?.data);
      setFeedback({ type: 'error', message: error.response?.data?.message || 'No se pudo actualizar la mascota' });
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="material-icons text-teal text-4xl" aria-hidden="true">pets</span>
              <h1 className="text-3xl font-bold text-gray-800">Gestión de Mascotas</h1>
            </div>
            <p className="text-gray-600 mt-2">Consulta y administra la información de las mascotas registradas</p>
          </div>
        </div>

        {feedback && (
          <div
            className={`mb-4 text-sm rounded-md px-4 py-3 ${
              feedback.type === 'success' ? 'bg-teal/10 text-teal' : 'bg-red-100 text-red-600'
            }`}
          >
            {feedback.message}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="w-full sm:w-96">
            <div className="relative">
              <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-md border border-gray-300 pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal"
                placeholder="Buscar por nombre, raza o dueño..."
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal" />
          </div>
        ) : filteredPets.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <span className="material-icons text-gray-300 text-6xl mb-4">pets</span>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No hay mascotas registradas</h3>
            <p className="text-gray-600">Cuando se registren mascotas aparecerán aquí.</p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600 border-b">
                  <th className="px-4 py-3">
                    <span className="material-icons inline align-middle text-base mr-2">pets</span>
                    Nombre
                  </th>
                  <th className="px-4 py-3">
                    <span className="material-icons inline align-middle text-base mr-2">category</span>
                    Especie
                  </th>
                  <th className="px-4 py-3">
                    <span className="material-icons inline align-middle text-base mr-2">style</span>
                    Raza
                  </th>
                  <th className="px-4 py-3">
                    <span className="material-icons inline align-middle text-base mr-2">wc</span>
                    Sexo
                  </th>
                  <th className="px-4 py-3">
                    <span className="material-icons inline align-middle text-base mr-2">hourglass_empty</span>
                    Edad
                  </th>
                  <th className="px-4 py-3">
                    <span className="material-icons inline align-middle text-base mr-2">person</span>
                    Dueño
                  </th>
                  <th className="px-4 py-3">
                    <span className="material-icons inline align-middle text-base mr-2">toggle_on</span>
                    Estado
                  </th>
                  <th className="px-4 py-3 text-right">
                    <span className="material-icons inline align-middle text-base mr-2">tune</span>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPets.map((pet) => (
                  <tr key={pet.id} className="border-b last:border-0">
                    <td className="px-4 py-3 font-medium text-gray-800">{pet.name}</td>
                    <td className="px-4 py-3">{pet.speciesName || pet.species?.name || pet.species || '—'}</td>
                    <td className="px-4 py-3">{pet.breedName || pet.breed?.name || pet.breed || '—'}</td>
                    <td className="px-4 py-3">{pet.sex || '—'}</td>
                    <td className="px-4 py-3">{pet.age}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="font-medium">{pet.owner?.name || '—'}</span>
                        <span className="text-xs text-gray-500">{pet.owner?.email || ''}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${pet.active !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        <span className="material-icons text-xs">{pet.active !== false ? 'check_circle' : 'cancel'}</span>
                        {pet.active !== false ? 'Activa' : 'Inactiva'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => openEdit(pet)} className="px-3 py-1.5 text-teal hover:bg-teal/10 rounded-md">Editar</button>
                        {pet.active !== false ? (
                          <button onClick={() => handleDeactivate(pet.id)} className="px-3 py-1.5 text-yellow-700 hover:bg-yellow-50 rounded-md">Desactivar</button>
                        ) : (
                          <button onClick={() => handleActivate(pet.id)} className="px-3 py-1.5 text-green-700 hover:bg-green-50 rounded-md">Activar</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showModal && editingPet && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Editar Mascota</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-teal"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Especie</label>
                  <SearchableDropdown
                    options={species}
                    value={formData.speciesId}
                    onChange={(val) => setFormData({ ...formData, speciesId: val || '', breedId: '' })}
                    placeholder="Seleccionar especie"
                    required
                    valueKey="id"
                    getOptionLabel={(opt) => opt.name}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Raza</label>
                  <SearchableDropdown
                    options={breeds}
                    value={formData.breedId}
                    onChange={(val) => setFormData({ ...formData, breedId: val || '' })}
                    placeholder={loadingBreeds ? "Cargando razas..." : formData.speciesId ? "Seleccionar raza" : "Primero selecciona una especie"}
                    required
                    disabled={!formData.speciesId || loadingBreeds}
                    valueKey="id"
                    getOptionLabel={(opt) => opt.name}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sexo</label>
                  <select
                    value={formData.sex}
                    onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
                    required
                    className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-teal"
                  >
                    <option value="M">Macho</option>
                    <option value="F">Hembra</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Edad (años)</label>
                    <input
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      required
                      min="0"
                      className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-teal"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Peso (kg)</label>
                    <input
                      type="number"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      required
                      min="0"
                      step="0.1"
                      className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-teal"
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingPet(null);
                      setFormData({ name: '', species: '', breed: '', age: '', weight: '', sex: '' });
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-teal text-white rounded-lg shadow-teal-sm hover:shadow-teal-lg"
                  >
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminPets;

