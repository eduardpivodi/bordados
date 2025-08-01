import { useState } from 'react';
import { FormularioBordado } from './components/FormularioBordado';
import { TablaBordados } from './components/TablaBordados';
import { Estadisticas } from './components/Estadisticas';
import { Modal } from './components/Modal';
import { Notification } from './components/Notification';
import { useBordados } from './hooks/useBordados';

function App() {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [pestañaActiva, setPestañaActiva] = useState<'pendientes' | 'completados'>('pendientes');
  
  const {
    bordados,
    isLoading,
    error,
    successMessage,
    addBordado,
    toggleCompletado,
    togglePagado,
    deleteBordado,
    clearError,
    clearSuccess
  } = useBordados();

  const handleAgregarBordado = async (nuevoBordado: any) => {
    const success = await addBordado(nuevoBordado);
    if (success) {
      setMostrarModal(false);
    }
  };

  const handleToggleCompletado = async (id: string) => {
    await toggleCompletado(id);
  };

  const handleTogglePagado = async (id: string) => {
    await togglePagado(id);
  };

  const handleDeleteBordado = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este bordado?')) {
      await deleteBordado(id);
    }
  };

  const bordadosPendientes = bordados.filter(b => !b.completado);
  const bordadosCompletados = bordados.filter(b => b.completado);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando bordados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Notificaciones */}
      <Notification
        message={error || ''}
        type="error"
        isVisible={!!error}
        onClose={clearError}
        duration={5000}
      />
      
      <Notification
        message={successMessage || ''}
        type="success"
        isVisible={!!successMessage}
        onClose={clearSuccess}
        duration={3000}
      />
           
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Administración de Bordados
          </h1>
          <p className="text-gray-600">
            Gestiona tus pedidos de bordados de manera eficiente
          </p>
        </div>

        {/* Estadísticas */}
        <Estadisticas bordados={bordados} />

        {/* Botón para abrir modal */}
        <div className="mb-6">
          <button
            onClick={() => setMostrarModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            Nuevo Bordado
          </button>
        </div>

        {/* Modal con formulario */}
        <Modal 
          isOpen={mostrarModal} 
          onClose={() => setMostrarModal(false)}
          title="Registrar Nuevo Bordado"
        >
          <FormularioBordado 
            onSubmit={handleAgregarBordado} 
            onCancel={() => setMostrarModal(false)}
          />
        </Modal>

        {/* Sistema de Pestañas */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          {/* Navegación de Pestañas */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setPestañaActiva('pendientes')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  pestañaActiva === 'pendientes'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Pedidos Pendientes
                {bordadosPendientes.length > 0 && (
                  <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                    {bordadosPendientes.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setPestañaActiva('completados')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  pestañaActiva === 'completados'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Pedidos Completados
                {bordadosCompletados.length > 0 && (
                  <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                    {bordadosCompletados.length}
                  </span>
                )}
              </button>
            </nav>
          </div>

          {/* Contenido de las Pestañas */}
          <div className="p-6">
            {pestañaActiva === 'pendientes' && (
              <TablaBordados
                bordados={bordadosPendientes}
                onToggleCompletado={handleToggleCompletado}
                onTogglePagado={handleTogglePagado}
                onDelete={handleDeleteBordado}
                titulo="Bordados Pendientes"
                mostrarCompletados={false}
              />
            )}
            
            {pestañaActiva === 'completados' && (
              <TablaBordados
                bordados={bordadosCompletados}
                onToggleCompletado={handleToggleCompletado}
                onTogglePagado={handleTogglePagado}
                onDelete={handleDeleteBordado}
                titulo="Bordados Completados"
                mostrarCompletados={true}
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm mt-12">
          <p>© 2024 Administración de Bordados - Todos los derechos reservados</p>
        </div>
      </div>
    </div>
  );
}

export default App;
