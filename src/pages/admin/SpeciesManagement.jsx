import React, { useCallback, useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import { speciesApi } from '../../api/services';

const SpeciesManagement = () => {
  const [species, setSpecies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [filters, setFilters] = useState({
    text: '',
    activeOnly: true,
  });
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [formData, setFormData] = useState({ name: '' });
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await speciesApi.getAll();
      setSpecies(response.data || []);
    } catch (e) {
      setError('Error cargando especies');
      console.error('Error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await speciesApi.create(formData);
      setShowForm(false);
      setEditing(null);
      setFormData({ name: '' });
      await load();
    } catch (e) {
      alert('Error creando especie');
      console.error('Error:', e);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await speciesApi.update(editing.id, formData);
      setShowForm(false);
      setEditing(null);
      setFormData({ name: '' });
      await load();
    } catch (e) {
      alert('Error actualizando especie');
      console.error('Error:', e);
    }
  };

  const handleDelete = (speciesItem) => {
    setDeleteConfirm(speciesItem);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await speciesApi.delete(deleteConfirm.id);
      setDeleteConfirm(null);
      await load();
    } catch (e) {
      alert('Error eliminando especie');
      console.error('Error:', e);
    }
  };

  const handleToggleActive = async (speciesItem) => {
    try {
      if (speciesItem.active) {
        await speciesApi.deactivate(speciesItem.id);
      } else {
        await speciesApi.activate(speciesItem.id);
      }
      await load();
    } catch (e) {
      alert(speciesItem.active ? 'Error desactivando' : 'Error activando');
      console.error('Error:', e);
    }
  };

  const onEdit = (s) => {
    setEditing(s);
    setFormData({
      name: s.name || ''
    });
    setShowForm(true);
  };

  const openNew = () => {
    setEditing(null);
    setFormData({ name: '' });
    setShowForm(true);
  };

  const filteredSpecies = species.filter((s) => {
    const matchText = filters.text
      ? s.name?.toLowerCase().includes(filters.text.toLowerCase())
      : true;
    const matchActive = filters.activeOnly ? s.active !== false : true;
    return matchText && matchActive;
  });

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-icons text-teal text-4xl">pets</span>
            <h1 className="text-3xl font-bold text-gray-800">Gestión de Especies</h1>
          </div>
          <p className="text-gray-600">Administra las especies de mascotas</p>
        </div>
        
        {error && <p className="text-red-600 bg-red-50 p-4 rounded-lg mb-4">{error}</p>}
        
        <div className="flex flex-wrap justify-between items-center mb-4 gap-3">
          <div className="flex gap-2">
            <button onClick={openNew} className="flex items-center gap-2 bg-teal hover:bg-teal-dark text-white px-4 py-2 rounded-lg font-medium transition-colors">
              <span className="material-icons">add_circle</span>
              Agregar Especie
            </button>
            <button onClick={() => navigate('/admin/razas')} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              <span className="material-icons">category</span>
              Gestionar Razas
            </button>
          </div>
          <button onClick={load} className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            <span className="material-icons">refresh</span>
            Refrescar
          </button>
        </div>
        
        {!showForm && (
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <input
                  type="text"
                  placeholder="Buscar por nombre..."
                  value={filters.text}
                  onChange={(e) => setFilters({ ...filters, text: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-teal"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="activeOnly"
                  checked={filters.activeOnly}
                  onChange={(e) => setFilters({ ...filters, activeOnly: e.target.checked })}
                  className="rounded border-gray-300 text-teal focus:ring-teal"
                />
                <label htmlFor="activeOnly" className="text-sm text-gray-700">Solo activas</label>
              </div>
            </div>
          </div>
        )}
        
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal"></div>
          </div>
        )}
        
        {!showForm && !loading && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSpecies.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                      <span className="material-icons text-6xl text-gray-300 mb-2">pets</span>
                      <p>No hay especies registradas</p>
                    </td>
                  </tr>
                ) : (
                  filteredSpecies.map((s) => (
                    <tr key={s.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{s.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          s.active !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {s.active !== false ? 'Activa' : 'Inactiva'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex gap-2 justify-end">
                          <button onClick={() => onEdit(s)} className="px-3 py-1.5 text-teal hover:bg-teal/10 rounded-md">
                            Editar
                          </button>
                          <button 
                            onClick={() => handleToggleActive(s)} 
                            className={`px-3 py-1.5 rounded-md ${
                              s.active !== false 
                                ? 'text-yellow-700 hover:bg-yellow-50' 
                                : 'text-green-700 hover:bg-green-50'
                            }`}
                          >
                            {s.active !== false ? 'Desactivar' : 'Activar'}
                          </button>
                          <button onClick={() => handleDelete(s)} className="px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-md">
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
        
        {showForm && (
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="material-icons text-teal">{editing ? 'edit' : 'add_box'}</span>
              {editing ? 'Editar Especie' : 'Nueva Especie'}
            </h3>
            <form onSubmit={editing ? handleUpdate : handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-teal"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditing(null);
                    setFormData({ name: '' });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-teal text-white rounded-lg hover:bg-teal-dark"
                >
                  {editing ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        )}

        {deleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-2">Confirmar eliminación</h2>
              <p className="text-gray-600 mb-6">
                ¿Estás seguro de que deseas eliminar la especie{' '}
                <span className="font-semibold">"{deleteConfirm.name}"</span>? Esta acción no se puede deshacer.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SpeciesManagement;
