import React, { useState, useMemo } from 'react';
import type { Bordado } from '../types/Bordado';

interface TablaBordadosProps {
  bordados: Bordado[];
  onToggleCompletado: (id: string) => void;
  onTogglePagado: (id: string) => void;
  onDelete: (id: string) => void;
  titulo: string;
  mostrarCompletados?: boolean;
}

export const TablaBordados: React.FC<TablaBordadosProps> = ({
  bordados,
  onToggleCompletado,
  onTogglePagado,
  onDelete,
  titulo,
  mostrarCompletados = false
}) => {
  const [busqueda, setBusqueda] = useState('');

  // Filtrar bordados basado en la búsqueda
  const bordadosFiltrados = useMemo(() => {
    if (!busqueda.trim()) return bordados;
    
    const terminoBusqueda = busqueda.toLowerCase();
    return bordados.filter(bordado => 
      bordado.nombreCliente.toLowerCase().includes(terminoBusqueda) ||
      bordado.numeroContacto.toLowerCase().includes(terminoBusqueda) ||
      bordado.descripcion.toLowerCase().includes(terminoBusqueda)
    );
  }, [bordados, busqueda]);

  const abrirWhatsApp = (numero: string) => {
    const numeroLimpio = numero.replace(/\D/g, '');
    const url = `https://web.whatsapp.com/send?phone=+57${numeroLimpio}`;
    
    // Usar nombre de ventana específico para reutilizar
    const windowName = 'whatsapp_web_window';
    window.open(url, windowName)?.focus();
  };

  const confirmarCompletado = (bordado: Bordado) => {
    const confirmacion = window.confirm(
      `¿Confirmar que el bordado de ${bordado.nombreCliente} está completado?\n\n` +
      `Esto marcará el bordado como completado.`
    );
    
    if (confirmacion) {
      onToggleCompletado(bordado.id);
    }
  };

  const confirmarPagado = (bordado: Bordado) => {
    const confirmacion = window.confirm(
      `¿Confirmar que el bordado de ${bordado.nombreCliente} ha sido pagado?\n\n` +
      `Esto marcará el bordado como pagado.`
    );
    
    if (confirmacion) {
      onTogglePagado(bordado.id);
    }
  };

  const confirmarDesmarcarPago = (bordado: Bordado) => {
    const confirmacion = window.confirm(
      `¿Confirmar que desea desmarcar el pago del bordado de ${bordado.nombreCliente}?\n\n` +
      `Esto marcará el bordado como no pagado.`
    );
    
    if (confirmacion) {
      onTogglePagado(bordado.id);
    }
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (bordados.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">{titulo}</h2>
        <p className="text-gray-500 text-center py-8">
          {mostrarCompletados ? 'No hay bordados completados' : 'No hay bordados pendientes'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">{titulo}</h2>
      
      {/* Campo de búsqueda */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre, contacto o descripción..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        />
      </div>

      {bordadosFiltrados.length === 0 && busqueda.trim() && (
        <p className="text-gray-500 text-center py-4">
          No se encontraron bordados que coincidan con la búsqueda
        </p>
      )}
      
      {/* Contenedor responsive para la tabla */}
      <div className="overflow-x-auto">
        <div className="min-w-full inline-block align-middle">
          <div className="overflow-hidden border border-gray-200 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contacto
                  </th>
                  <th className="hidden md:table-cell px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cant.
                  </th>
                  <th className="hidden sm:table-cell px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="hidden lg:table-cell px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Entrega
                  </th>
                  <th className="hidden sm:table-cell px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="hidden md:table-cell px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pago
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bordadosFiltrados.map((bordado, index) => (
                  <tr key={bordado.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {bordado.nombreCliente}
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <button
                        onClick={() => abrirWhatsApp(bordado.numeroContacto)}
                        className="text-sm text-blue-600 hover:text-blue-800 underline bg-transparent border-none cursor-pointer"
                      >
                        {bordado.numeroContacto}
                      </button>
                    </td>
                    <td className="hidden md:table-cell px-3 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate" title={bordado.descripcion}>
                        {bordado.descripcion}
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {bordado.cantidad}
                      </div>
                    </td>
                    <td className="hidden sm:table-cell px-3 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ${bordado.precio.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ${bordado.precioTotal.toFixed(2)}
                      </div>
                    </td>
                    <td className="hidden lg:table-cell px-3 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatearFecha(bordado.fechaEntrega)}
                      </div>
                    </td>
                    <td className="hidden sm:table-cell px-3 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        bordado.completado 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {bordado.completado ? 'Completado' : 'Pendiente'}
                      </span>
                    </td>
                    <td className="hidden md:table-cell px-3 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        bordado.pagado 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {bordado.pagado ? 'Pagado' : 'Pendiente'}
                      </span>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => bordado.completado ? onToggleCompletado(bordado.id) : confirmarCompletado(bordado)}
                          className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                            bordado.completado 
                              ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                              : 'bg-green-100 text-green-800 hover:bg-green-200'
                          }`}
                        >
                          {bordado.completado ? 'Desmarcar' : 'Completar'}
                        </button>
                        <button
                          onClick={() => bordado.pagado ? confirmarDesmarcarPago(bordado) : confirmarPagado(bordado)}
                          className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                            bordado.pagado 
                              ? 'bg-red-100 text-red-800 hover:bg-red-200' 
                              : 'bg-green-100 text-green-800 hover:bg-green-200'
                          }`}
                        >
                          {bordado.pagado ? 'Desmarcar Pago' : 'Marcar Pagado'}
                        </button>
                        <button
                          onClick={() => onDelete(bordado.id)}
                          className="px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-800 hover:bg-red-200 transition-colors"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}; 