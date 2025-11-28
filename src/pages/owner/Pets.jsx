import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import SearchableDropdown from '../../components/SearchableDropdown';
import { petApi, speciesApi } from '../../api/services';

const OwnerPets = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    speciesId: '',
    breedId: '',
    age: '',
    weight: '',
    sex: '',
  });
  const [feedback, setFeedback] = useState(null);
  const [species, setSpecies] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [loadingBreeds, setLoadingBreeds] = useState(false);

  const sexOptions = useMemo(() => ([
    { value: 'M', label: 'Macho' },
    { value: 'F', label: 'Hembra' },
  ]), []);

  const navigation = [
    { path: '/owner/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { path: '/owner/pets', icon: 'pets', label: 'Mis Mascotas' },
    { path: '/owner/appointments', icon: 'event', label: 'Mis Citas' },
    { path: '/owner/history', icon: 'history', label: 'Historial Médico' },
    { path: '/productos', icon: 'store', label: 'Productos' },
    { path: '/owner/cart', icon: 'shopping_cart', label: 'Carrito' },
    { path: '/owner/purchases', icon: 'receipt_long', label: 'Mis Compras' },
    { path: '/profile', icon: 'account_circle', label: 'Mi Perfil' },
  ];

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
    try {
      const response = await petApi.getAll();
      // Filtrar solo mascotas activas
      const activePets = (response.data || []).filter(pet => pet.active !== false);
      
      // Cargar información completa de especies y razas para cada mascota
      const petsWithDetails = await Promise.all(
        activePets.map(async (pet) => {
          try {
            // Si ya tiene los objetos completos, no hacer nada
            if (pet.species?.name && pet.breed?.name) {
              return pet;
            }
            
            // Si solo tiene IDs, cargar los nombres
            const [speciesResponse, breedResponse] = await Promise.all([
              pet.speciesId ? speciesApi.getAll().then(res => res.data.find(s => s.id === pet.speciesId)) : null,
              pet.breedId ? speciesApi.getBreeds(pet.speciesId).then(res => res.data.find(b => b.id === pet.breedId)) : null
            ]);
            
            return {
              ...pet,
              species: speciesResponse || pet.species,
              breed: breedResponse || pet.breed
            };
          } catch (error) {
            console.error('Error cargando detalles de mascota:', error);
            return pet;
          }
        })
      );
      
      setPets(petsWithDetails);
    } catch (error) {
      console.error('Error cargando mascotas:', error);
      setFeedback({ type: 'error', message: 'Error al cargar las mascotas' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name.trim(),
        speciesId: parseInt(formData.speciesId, 10),
        breedId: parseInt(formData.breedId, 10),
        age: parseInt(formData.age, 10),
        weight: parseFloat(formData.weight),
        sex: formData.sex === 'M' ? 'Macho' : 'Hembra'
      };
      
      if (editingPet) {
        await petApi.update(editingPet.id, payload);
        setFeedback({ type: 'success', message: 'Mascota actualizada exitosamente' });
      } else {
        await petApi.create(payload);
        setFeedback({ type: 'success', message: 'Mascota registrada exitosamente' });
      }
      setShowModal(false);
      setEditingPet(null);
      setFormData({ name: '', speciesId: '', breedId: '', age: '', weight: '', sex: '' });
      loadPets();
    } catch (error) {
      console.error('Error al guardar:', error);
      setFeedback({ type: 'error', message: error.response?.data?.message || 'Error al guardar' });
    }
  };

  const handleEdit = (pet) => {
    setEditingPet(pet);
    setFormData({
      name: pet.name,
      speciesId: pet.species?.id || pet.speciesId || '',
      breedId: pet.breed?.id || pet.breedId || '',
      age: pet.age,
      weight: pet.weight,
      sex: pet.sex === 'Macho' ? 'M' : pet.sex === 'Hembra' ? 'F' : 'M',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar esta mascota?')) return;
    try {
      await petApi.remove(id);
      setFeedback({ type: 'success', message: 'Mascota eliminada' });
      loadPets();
    } catch (error) {
      console.error('Error al eliminar mascota:', error);
      const errorMsg = error.response?.data?.message || error.response?.data?.error || 'Error al eliminar';
      setFeedback({ type: 'error', message: errorMsg });
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="flex items-center gap-3">
              <span className="material-icons text-teal text-4xl" aria-hidden="true">pets</span>
              <h1 className="text-3xl font-bold text-gray-800">Mis Mascotas</h1>
            </div>
            <p className="text-gray-600 mt-2">Gestiona la información de tus mascotas</p>
          </div>
          <button
            onClick={() => {
              setEditingPet(null);
              setFormData({ name: '', speciesId: '', breedId: '', age: '', weight: '', sex: '' });
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-teal text-white rounded-lg shadow-teal-sm hover:shadow-teal-lg transition-shadow"
          >
            <span className="material-icons">add</span>
            <span>Nueva Mascota</span>
          </button>
        </div>

        {feedback && (
          <div className={`mb-6 text-sm rounded-md px-4 py-3 ${feedback.type === 'success' ? 'bg-teal/10 text-teal' : 'bg-red-100 text-red-600'}`}>
            {feedback.message}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal"></div>
          </div>
        ) : pets.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <span className="material-icons text-gray-300 text-6xl mb-4">pets</span>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No tienes mascotas registradas</h3>
            <p className="text-gray-600 mb-6">Comienza registrando tu primera mascota</p>
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-2 bg-teal text-white rounded-lg"
            >
              Registrar Mascota
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pets.map((pet) => (
              <div key={pet.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-teal/10 rounded-full flex items-center justify-center">
                    <span className="material-icons text-teal text-2xl">pets</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(pet)} className="px-3 py-1.5 text-teal hover:bg-teal/10 rounded-md">Editar</button>
                    <button onClick={() => handleDelete(pet.id)} className="px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-md">Eliminar</button>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{pet.name}</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><span className="font-medium">Especie:</span> {pet.species?.name || pet.species || 'N/A'}</p>
                  <p><span className="font-medium">Raza:</span> {pet.breed?.name || pet.breed || 'N/A'}</p>
                  <p><span className="font-medium">Sexo:</span> {pet.sex}</p>
                  <p><span className="font-medium">Edad:</span> {pet.age} años</p>
                  <p><span className="font-medium">Peso:</span> {pet.weight} kg</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                {editingPet ? 'Editar Mascota' : 'Registrar Mascota'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal"
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
                  <SearchableDropdown
                    options={sexOptions}
                    value={formData.sex}
                    onChange={(val) => setFormData({ ...formData, sex: val || '' })}
                    placeholder="Seleccionar sexo"
                    required
                    valueKey="value"
                    getOptionLabel={(opt) => opt.label}
                    sort={false}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Edad (años)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Peso (kg)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.1"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal"
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-teal text-white rounded-lg shadow-teal-sm hover:shadow-teal-lg"
                  >
                    {editingPet ? 'Actualizar' : 'Registrar'}
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

export default OwnerPets;
