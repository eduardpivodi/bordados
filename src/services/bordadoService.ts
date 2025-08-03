import type { Bordado } from '../types/Bordado';
import { supabase } from '../lib/supabase';

export const bordadoService = {
  // Obtener todos los bordados
  getBordados: async (): Promise<Bordado[]> => {
    if (!supabase) {
      throw new Error('No se pudo conectar con la base de datos.');
    }

    try {
      const { data, error } = await supabase
        .from('bordados')
        .select('*')
        .order('fechaCreacion', { ascending: false });

      if (error) {
        console.error('Error al cargar bordados:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error al cargar bordados:', error);
      throw error;
    }
  },

  // Agregar nuevo bordado
  addBordado: async (bordado: Omit<Bordado, 'id' | 'fechaCreacion' | 'completado' | 'pagado'>): Promise<Bordado> => {
    if (!supabase) {
      throw new Error('No se pudo conectar con la base de datos.');
    }

    try {
      const nuevoBordado: Omit<Bordado, 'id'> = {
        ...bordado,
        fechaCreacion: new Date().toISOString(),
        completado: false,
        pagado: false,
      };

      const { data, error } = await supabase
        .from('bordados')
        .insert([nuevoBordado])
        .select()
        .single();

      if (error) {
        console.error('Error al agregar bordado:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error al agregar bordado:', error);
      throw error;
    }
  },

  // Marcar bordado como completado
  toggleCompletado: async (id: string): Promise<void> => {
    if (!supabase) {
      throw new Error('No se pudo conectar con la base de datos.');
    }

    try {
      // Primero obtener el bordado actual
      const { data: bordado, error: fetchError } = await supabase
        .from('bordados')
        .select('completado')
        .eq('id', id)
        .single();

      if (fetchError) {
        console.error('Error al obtener bordado:', fetchError);
        throw fetchError;
      }

      // Actualizar el estado
      const { error } = await supabase
        .from('bordados')
        .update({ completado: !bordado.completado })
        .eq('id', id);

      if (error) {
        console.error('Error al actualizar bordado:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error al actualizar bordado:', error);
      throw error;
    }
  },

  // Marcar bordado como pagado
  togglePagado: async (id: string): Promise<void> => {
    if (!supabase) {
      throw new Error('No se pudo conectar con la base de datos.');
    }

    try {
      // Primero obtener el bordado actual
      const { data: bordado, error: fetchError } = await supabase
        .from('bordados')
        .select('pagado')
        .eq('id', id)
        .single();

      if (fetchError) {
        console.error('Error al obtener bordado:', fetchError);
        throw fetchError;
      }

      // Actualizar el estado
      const { error } = await supabase
        .from('bordados')
        .update({ pagado: !bordado.pagado })
        .eq('id', id);

      if (error) {
        console.error('Error al actualizar estado de pago:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error al actualizar estado de pago:', error);
      throw error;
    }
  },

  // Eliminar bordado
  deleteBordado: async (id: string): Promise<void> => {
    if (!supabase) {
      throw new Error('No se pudo conectar con la base de datos.');
    }

    try {
      const { error } = await supabase
        .from('bordados')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error al eliminar bordado:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error al eliminar bordado:', error);
      throw error;
    }
  },

  // Suscribirse a cambios en tiempo real con manejo optimizado
  subscribeToChanges: (callback: (bordados: Bordado[]) => void) => {
    if (!supabase) {
      console.warn('No se pueden suscribir cambios en tiempo real');
      return {
        unsubscribe: () => {}
      };
    }

    let currentBordados: Bordado[] = [];
    let isInitialized = false;

    const channel = supabase
      .channel('bordados-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bordados'
        },
        async (payload) => {
          
          try {
            // Actualizar la lista local según el tipo de cambio
            if (payload.eventType === 'INSERT') {
              const nuevoBordado = payload.new as Bordado;
              currentBordados = [nuevoBordado, ...currentBordados];
            } else if (payload.eventType === 'UPDATE') {
              const bordadoActualizado = payload.new as Bordado;
              currentBordados = currentBordados.map(b => 
                b.id === bordadoActualizado.id ? bordadoActualizado : b
              );
            } else if (payload.eventType === 'DELETE') {
              const bordadoEliminado = payload.old as Bordado;
              currentBordados = currentBordados.filter(b => b.id !== bordadoEliminado.id);
            }
            
            // Ordenar por fecha de creación (más recientes primero)
            currentBordados.sort((a, b) => 
              new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime()
            );
            
            callback(currentBordados);
          } catch (error) {
            console.error('Error al procesar cambio en tiempo real:', error);
            // En caso de error, recargar datos completos
            if (isInitialized) {
              try {
                const bordadosCompletos = await bordadoService.getBordados();
                currentBordados = bordadosCompletos;
                callback(bordadosCompletos);
              } catch (reloadError) {
                console.error('Error al recargar datos:', reloadError);
              }
            }
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED' && !isInitialized) {
          // Cargar datos iniciales cuando la suscripción esté activa
          bordadoService.getBordados()
            .then(bordados => {
              currentBordados = bordados;
              isInitialized = true;
              callback(bordados);
            })
            .catch(error => {
              console.error('Error al cargar datos iniciales:', error);
              callback([]);
            });
        }
      });

    return {
      unsubscribe: () => {
        channel.unsubscribe();
      }
    };
  },

  // Método para verificar el estado de la conexión
  checkConnection: async (): Promise<boolean> => {
    if (!supabase) {
      return false;
    }

    try {
      const { error } = await supabase
        .from('bordados')
        .select('count')
        .limit(1);
      
      return !error;
    } catch {
      return false;
    }
  }
}; 