import React, { useState } from 'react';
import type { Bordado } from '../types/Bordado';

interface FormularioBordadoProps {
  onSubmit: (bordado: Omit<Bordado, 'id' | 'fechaCreacion' | 'completado' | 'pagado'>) => Promise<void>;
  onCancel?: () => void;
}

export const FormularioBordado: React.FC<FormularioBordadoProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    nombreCliente: '',
    numeroContacto: '',
    descripcion: '',
    cantidad: 1,
    precio: 0,
    fechaEntrega: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'cantidad' || name === 'precio' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const precioTotal = formData.cantidad * formData.precio;
    
    // Si no se proporciona fecha de entrega, establecer para mañana
    let fechaEntrega = formData.fechaEntrega;
    if (!fechaEntrega) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 2);
      fechaEntrega = tomorrow.toISOString().split('T')[0];
    }
    
    onSubmit({
      ...formData,
      fechaEntrega,
      precioTotal
    });

    // Reset form
    setFormData({
      nombreCliente: '',
      numeroContacto: '',
      descripcion: '',
      cantidad: 1,
      precio: 0,
      fechaEntrega: ''
    });
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Cliente
            </label>
            <input
              type="text"
              name="nombreCliente"
              value={formData.nombreCliente}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ingrese el nombre del cliente"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Número de Contacto
            </label>
            <input
              type="tel"
              name="numeroContacto"
              value={formData.numeroContacto}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej: 3123456789 (opcional)"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción del Bordado
          </label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
            placeholder="Describe el bordado a realizar"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cantidad
            </label>
            <input
              type="number"
              name="cantidad"
              value={formData.cantidad}
              onChange={handleChange}
              required
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Precio Unitario
            </label>
            <input
              type="number"
              name="precio"
              value={formData.precio}
              onChange={handleChange}
              required
              min="0"
              step="100"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de Entrega
            </label>
            <input
              type="date"
              name="fechaEntrega"
              value={formData.fechaEntrega}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Si no se especifica, será para mañana"
            />
            {!formData.fechaEntrega && (
              <p className="text-xs text-gray-500 mt-1">
                Si no se especifica, se establecerá para mañana automáticamente
              </p>
            )}
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-md">
          <p className="text-sm text-blue-800">
            <span className="font-medium">Precio Total:</span> ${(formData.cantidad * formData.precio).toFixed(2)}
          </p>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Registrar Bordado
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}; 