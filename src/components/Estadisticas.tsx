import React from 'react';
import type { Bordado } from '../types/Bordado';

interface EstadisticasProps {
  bordados: Bordado[];
}

export const Estadisticas: React.FC<EstadisticasProps> = ({ bordados }) => {
  const bordadosPendientes = bordados.filter(b => !b.completado);
  const bordadosCompletados = bordados.filter(b => b.completado);
  const bordadosPagados = bordados.filter(b => b.pagado);
  const bordadosPendientesPago = bordados.filter(b => !b.pagado);
  
  const totalIngresos = bordadosCompletados.reduce((sum, b) => sum + b.precioTotal, 0);
  const ingresosPagados = bordadosPagados.reduce((sum, b) => sum + b.precioTotal, 0);
  const ingresosPendientesPago = bordadosPendientesPago.reduce((sum, b) => sum + b.precioTotal, 0);
  
  const bordadosVencidos = bordadosPendientes.filter(b => 
    new Date(b.fechaEntrega) < new Date()
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">P</span>
            </div>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Pendientes</p>
            <p className="text-2xl font-bold text-gray-900">{bordadosPendientes.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">C</span>
            </div>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Completados</p>
            <p className="text-2xl font-bold text-gray-900">{bordadosCompletados.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">$</span>
            </div>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Pagados</p>
            <p className="text-2xl font-bold text-gray-900">{bordadosPagados.length}</p>
            <p className="text-xs text-gray-500">${ingresosPagados.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">!</span>
            </div>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Pendientes Pago</p>
            <p className="text-2xl font-bold text-gray-900">{bordadosPendientesPago.length}</p>
            <p className="text-xs text-gray-500">${ingresosPendientesPago.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}; 