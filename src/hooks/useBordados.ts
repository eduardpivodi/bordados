import { useState, useEffect } from 'react';
import type { Bordado } from '../types/Bordado';
import { bordadoService } from '../services/bordadoService';

export const useBordados = () => {
  const [bordados, setBordados] = useState<Bordado[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [, setSubscription] = useState<(() => void) | null>(null);

  useEffect(() => {
    let isMounted = true;

    const subscription = bordadoService.subscribeToChanges((bordadosActualizados) => {
      if (isMounted) {
        setBordados(bordadosActualizados);
        setIsLoading(false);
        setError(null);
      }
    });

    setSubscription(() => subscription.unsubscribe.bind(subscription));

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [setSubscription]);

  const addBordado = async (nuevoBordado: Omit<Bordado, 'id' | 'fechaCreacion' | 'completado' | 'pagado'>) => {
    try {
      setError(null);
      await bordadoService.addBordado(nuevoBordado);
      setTimeout(() => setSuccessMessage(null), 3000);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al agregar bordado';
      setError(errorMessage);
      return false;
    }
  };

  const toggleCompletado = async (id: string) => {
    try {
      setError(null);
      
      // Actualizar el estado local inmediatamente para mejor UX
      setBordados(prevBordados => 
        prevBordados.map(bordado => 
          bordado.id === id 
            ? { ...bordado, completado: !bordado.completado }
            : bordado
        )
      );
      
      // Luego actualizar en la base de datos
      await bordadoService.toggleCompletado(id);
      
      setTimeout(() => setSuccessMessage(null), 3000);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar bordado';
      setError(errorMessage);
      return false;
    }
  };

  const togglePagado = async (id: string) => {
    try {
      setError(null);
      
      // Actualizar el estado local inmediatamente para mejor UX
      setBordados(prevBordados => 
        prevBordados.map(bordado => 
          bordado.id === id 
            ? { ...bordado, pagado: !bordado.pagado }
            : bordado
        )
      );
      
      // Luego actualizar en la base de datos
      await bordadoService.togglePagado(id);
      
      setTimeout(() => setSuccessMessage(null), 3000);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar pago';
      setError(errorMessage);
      return false;
    }
  };

  const deleteBordado = async (id: string) => {
    try {
      setError(null);
      await bordadoService.deleteBordado(id);
      setTimeout(() => setSuccessMessage(null), 3000);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar bordado';
      setError(errorMessage);
      return false;
    }
  };

  const clearError = () => setError(null);
  const clearSuccess = () => setSuccessMessage(null);

  return {
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
  };
}; 