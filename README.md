# Administración de Bordados

Una aplicación web moderna para gestionar pedidos de bordados con actualización automática en tiempo real.

## ✨ Características Principales

### 🔄 Actualización Automática en Tiempo Real
- **Sincronización automática**: Las tablas se actualizan automáticamente cuando se realizan cambios
- **Indicador de conexión**: Muestra el estado de conexión en tiempo real
- **Notificaciones**: Avisos visuales cuando los datos se actualizan
- **Timestamp de última actualización**: Muestra cuándo fue la última sincronización

### 📊 Gestión de Pedidos
- **Registro de nuevos bordados**: Formulario completo con validación
- **Marcado de completado**: Cambiar estado de pendiente a completado
- **Eliminación de pedidos**: Con confirmación de seguridad
- **Filtrado por estado**: Pestañas separadas para pendientes y completados

### 📈 Estadísticas en Tiempo Real
- **Contador de pedidos**: Pendientes y completados
- **Ingresos totales**: Cálculo automático de ganancias
- **Estado de conexión**: Indicador visual del estado de sincronización
- **Última actualización**: Timestamp de la última sincronización

### 🎨 Interfaz Moderna
- **Diseño responsivo**: Funciona en dispositivos móviles y desktop
- **Indicadores visuales**: Estados de carga, éxito y error
- **Animaciones suaves**: Transiciones fluidas entre estados
- **Iconografía clara**: Iconos intuitivos para cada acción

## 🚀 Tecnologías Utilizadas

- **Frontend**: React 18 + TypeScript
- **Base de datos**: Supabase (PostgreSQL)
- **Tiempo real**: Supabase Realtime
- **Estilos**: Tailwind CSS
- **Build**: Vite

## 📋 Funcionalidades de Actualización Automática

### 1. Sincronización en Tiempo Real
- Los cambios se reflejan automáticamente en todas las pestañas
- No es necesario recargar la página
- Optimizado para cambios incrementales

### 2. Indicadores de Estado
- **Conectado** (verde): Sincronización activa
- **Desconectado** (rojo): Problemas de conexión
- **Última actualización**: Timestamp en tiempo real

### 3. Notificaciones Automáticas
- Avisos cuando los datos se actualizan
- Confirmaciones de acciones exitosas
- Indicadores de acciones en progreso

### 4. Prevención de Conflictos
- Botones deshabilitados durante acciones
- Confirmaciones para acciones destructivas
- Manejo de errores con reintentos

## 🛠️ Instalación y Configuración

1. **Clonar el repositorio**
   ```bash
   git clone [url-del-repositorio]
   cd bordados-admin
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar Supabase**
   - Crear proyecto en [Supabase](https://supabase.com)
   - Configurar las variables de entorno en `.env`
   - Ejecutar el script de configuración de la base de datos

4. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

## 📱 Uso de la Aplicación

### Agregar Nuevo Bordado
1. Hacer clic en "Nuevo Bordado"
2. Completar el formulario con los datos del cliente
3. Los datos se sincronizan automáticamente

### Marcar como Completado
1. En la tabla de pendientes, hacer clic en "Completar"
2. Confirmar la acción
3. El pedido se mueve automáticamente a la pestaña de completados

### Eliminar Pedido
1. Hacer clic en "Eliminar"
2. Confirmar la eliminación
3. El pedido se elimina de todas las tablas automáticamente

## 🔧 Configuración de Supabase

Ver el archivo `SUPABASE_SETUP.md` para instrucciones detalladas de configuración.

## 📊 Estructura de la Base de Datos

```sql
CREATE TABLE bordados (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombreCliente TEXT NOT NULL,
  numeroContacto TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  cantidad INTEGER NOT NULL,
  precio DECIMAL(10,2) NOT NULL,
  precioTotal DECIMAL(10,2) NOT NULL,
  fechaEntrega DATE NOT NULL,
  fechaCreacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completado BOOLEAN DEFAULT FALSE
);
```

## 🎯 Características de Actualización Automática

### Optimizaciones Implementadas
- **Cambios incrementales**: Solo se actualizan los datos modificados
- **Suscripción eficiente**: Una sola suscripción para todos los cambios
- **Manejo de desconexión**: Reconexión automática
- **Verificación periódica**: Estado de conexión cada 30 segundos

### Beneficios para el Usuario
- **Experiencia fluida**: Sin interrupciones por recargas
- **Datos siempre actualizados**: Sincronización en tiempo real
- **Feedback visual**: Indicadores claros del estado
- **Prevención de pérdida de datos**: Confirmaciones y validaciones

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🆘 Soporte

Para soporte técnico o preguntas sobre la configuración, crear un issue en el repositorio.
