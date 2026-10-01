# PLAN DE PRUEBAS DE VALIDACIÓN DE SOFTWARE / SW VALIDATION TEST PLAN (7.0)

**Proyecto:** IBM Onboarding Assistant - Multi-Tenant Edition  
**Módulo / Nivel:** 7.0 SW Validation (Pruebas de Validación / Nivel Sistema / E2E)  
**Autor / Tester:** CARLOS ALBERTO GUZMAN MONTES  
**Fecha de Creación:** 2025-02-18  
**Versión del Software:** 2.0.0  
**Estado General:** Aprobado / Ejecutado  

---

## 1. Información General del Nivel de Prueba
- **Objetivo:** Validar que el sistema completo satisface los requerimientos del usuario de negocio, garantizando flujos de trabajo End-to-End (E2E), la experiencia de usuario en la interfaz gráfica (UI), el soporte multi-inquilino sin fricciones y la asistencia inteligente de IA en condiciones reales de operación.
- **Técnicas Empleadas:** Pruebas de Caja Negra, Pruebas de Flujo de Usuario E2E, Pruebas de Aceptación de Usuario (UAT), Pruebas de Concurrencia y Resiliencia.
- **Entorno de Prueba:** Navegador Web Moderno (Google Chrome / Edge) + Backend Node.js en localhost:3000 + Frontend Vite en localhost:5173 + Ollama LLM Service.

---

## 2. Especificación Detallada de Casos de Prueba (10 Casos)

### Caso de Prueba 1: TC-VAL-001
| Campo | Detalle |
| :--- | :--- |
| **ID del Caso de Prueba** | `TC-VAL-001` |
| **Nombre del Caso de Prueba** | Flujo E2E - Registro de Administrador y Creación Inicial de Workspace |
| **Nivel de Prueba** | 7.0 SW Validation (Nivel Sistema / E2E) |
| **Tipo de Prueba** | Funcional / Extremo a Extremo (E2E) / Caja Negra |
| **Módulos / Vistas Involucradas** | `WorkspaceSetup.tsx` -> `Setup.tsx` -> `Dashboard.tsx` -> Backend REST |
| **Requerimiento Asociado** | `REQ-F-001` (Creación y Aprovisionamiento de Espacio de Trabajo) |
| **Precondiciones** | 1. Aplicación frontend y backend levantadas e interconectadas.<br>2. Usuario navega por primera vez sin sesión previa (`localStorage` limpio). |
| **Datos de Entrada** | - Nombre del Equipo: "DevOps Core Team"<br>- Descripción: "Equipo de infraestructura y automatización CI/CD"<br>- Datos Admin: "Carlos Guzman", "carlos.guzman@ibm.com" |
| **Procedimiento / Pasos de Ejecución** | 1. Abrir la URL `http://localhost:5173` en el navegador.<br>2. El sistema redirige automáticamente a la pantalla `/workspace-setup`.<br>3. Seleccionar la opción "Crear Nuevo Workspace".<br>4. Llenar los campos requeridos con los datos de entrada.<br>5. Presionar el botón "Crear y Continuar".<br>6. Validar que la interfaz muestre el modal de confirmación con el código generado (ej. `devo-8f92a1`) y redirija al `Dashboard`. |
| **Resultado Esperado** | 1. Redirección exitosa al Dashboard principal.<br>2. Nombre del equipo y rol de "Admin" reflejados en el encabezado superior.<br>3. Código de workspace almacenado en estado local y copiable al portapapeles. |
| **Resultado Obtenido** | Flujo completado en menos de 10 segundos, interfaz fluida y código generado correctamente. |
| **Criterio de Aceptación** | Usuario administrador plenamente autenticado y con acceso a la configuración total del workspace. |
| **Estado (Status)** | PASS |
| **Defectos Asociados** | NA |
| **Comentarios / Observaciones** | NA |

---

### Caso de Prueba 2: TC-VAL-002
| Campo | Detalle |
| :--- | :--- |
| **ID del Caso de Prueba** | `TC-VAL-002` |
| **Nombre del Caso de Prueba** | Flujo E2E - Incorporación de Nuevo Empleado (New Hire) Mediante Código |
| **Nivel de Prueba** | 7.0 SW Validation (Nivel Sistema / E2E) |
| **Tipo de Prueba** | Funcional / Experiencia de Usuario (UX) / Caja Negra |
| **Módulos / Vistas Involucradas** | `WorkspaceSetup.tsx` -> `AuthContext.tsx` -> `Dashboard.tsx` |
| **Requerimiento Asociado** | `REQ-F-004` (Onboarding Rápido de Nuevo Ingreso) |
| **Precondiciones** | 1. Workspace "DevOps Core Team" creado previamente con código `devo-8f92a1`.<br>2. Nuevo empleado accede desde un navegador independiente. |
| **Datos de Entrada** | - Código de Workspace: `devo-8f92a1`<br>- Nombre: "Ana Torres"<br>- Email: "ana.torres@ibm.com"<br>- Rol deseado: "Cloud Engineer" |
| **Procedimiento / Pasos de Ejecución** | 1. Acceder a `http://localhost:5173/workspace-setup`.<br>2. Seleccionar la pestaña "Unirme a un Workspace Existente".<br>3. Introducir el código `devo-8f92a1` y los datos de identificación.<br>4. Hacer clic en "Ingresar al Espacio de Trabajo".<br>5. Observar la carga del Dashboard de bienvenida personalizado. |
| **Resultado Esperado** | 1. Acceso inmediato sin requerir configuración administrativa adicional.<br>2. Visualización de los proyectos, herramientas y roadmap correspondientes a DevOps.<br>3. Permisos asignados como miembro regular (sin acceso a edición de Setup). |
| **Resultado Obtenido** | El nuevo colaborador ingresa en un solo paso y visualiza todo el contexto de su equipo. |
| **Criterio de Aceptación** | Tiempo total de incorporación < 30 segundos; asignación correcta del rol `member`. |
| **Estado (Status)** | PASS |
| **Defectos Asociados** | NA |
| **Comentarios / Observaciones** | NA |

---

### Caso de Prueba 3: TC-VAL-003
| Campo | Detalle |
| :--- | :--- |
| **ID del Caso de Prueba** | `TC-VAL-003` |
| **Nombre del Caso de Prueba** | Validación E2E de Aislamiento de Datos Multi-Tenant entre Dos Equipos |
| **Nivel de Prueba** | 7.0 SW Validation (Nivel Sistema / E2E) |
| **Tipo de Prueba** | Seguridad / Integridad de Datos / Multitenencia |
| **Módulos / Vistas Involucradas** | `Team.tsx`, `Projects.tsx`, `Tools.tsx`, `Dashboard.tsx` |
| **Requerimiento Asociado** | `REQ-NF-004` (Aislamiento Estricto entre Inquilinos) |
| **Precondiciones** | 1. Equipo A ("Frontend Team") con proyectos "React Redesign" y "Design System".<br>2. Equipo B ("Backend Team") con proyectos "Microservices Migration" y "DB Partitioning". |
| **Datos de Entrada** | - Sesión 1: Navegador en pestaña normal logueado en Equipo A.<br>- Sesión 2: Navegador en modo incógnito logueado en Equipo B. |
| **Procedimiento / Pasos de Ejecución** | 1. En Sesión 1 (Equipo A), navegar a `/projects`, `/team` y `/tools`. Documentar listas.<br>2. En Sesión 2 (Equipo B), navegar a las mismas rutas. Documentar listas.<br>3. Realizar una búsqueda en el directorio del Equipo A buscando miembros del Equipo B.<br>4. Intentar forzar la consulta mediante URL o parámetros manipulados. |
| **Resultado Esperado** | 1. Sesión 1 solo visualiza información de "Frontend Team".<br>2. Sesión 2 solo visualiza información de "Backend Team".<br>3. Cero visibilidad cruzada de miembros, proyectos, tareas o conversaciones. |
| **Resultado Obtenido** | Aislamiento 100% verificado tanto en UI como en las respuestas de los endpoints REST. |
| **Criterio de Aceptación** | Cero fugas de información (*Zero data leakage*) garantizado entre inquilinos. |
| **Estado (Status)** | PASS |
| **Defectos Asociados** | NA |
| **Comentarios / Observaciones** | NA |

---

### Caso de Prueba 4: TC-VAL-004
| Campo | Detalle |
| :--- | :--- |
| **ID del Caso de Prueba** | `TC-VAL-004` |
| **Nombre del Caso de Prueba** | Flujo E2E - Consulta al Asistente IA con Contexto de Proyecto Específico |
| **Nivel de Prueba** | 7.0 SW Validation (Nivel Sistema / E2E) |
| **Tipo de Prueba** | Funcional / Inteligencia Artificial / Interacción Conversacional |
| **Módulos / Vistas Involucradas** | `Chat.tsx` -> `ollamaService.js` -> `Granite 4.1:3b` |
| **Requerimiento Asociado** | `REQ-F-003` (Asistente IA Contextualizado por Equipo) |
| **Precondiciones** | 1. Servidor Ollama ejecutándose localmente con el modelo Granite.<br>2. Usuario logueado en workspace con proyectos de arquitectura definidos. |
| **Datos de Entrada** | Prompt de usuario: "¿Quién es el líder técnico de este equipo y qué stack tecnológico usamos en el proyecto principal?" |
| **Procedimiento / Pasos de Ejecución** | 1. Navegar a la página `/chat` desde el menú lateral.<br>2. Escribir el prompt en el campo de texto y presionar Enter o clic en botón "Enviar".<br>3. Observar el indicador de carga / pensamiento del modelo.<br>4. Analizar el contenido de la respuesta generada por el Asistente IA. |
| **Resultado Esperado** | 1. Respuesta generada en < 3 segundos.<br>2. El texto menciona explícitamente los líderes del equipo y tecnologías cargadas en el setup del workspace.<br>3. Formato markdown limpio con viñetas y enlaces de soporte. |
| **Resultado Obtenido** | La IA respondió con precisión indicando nombres reales de los miembros del equipo y herramientas configuradas. |
| **Criterio de Aceptación** | La respuesta de IA utiliza el contexto inyectado del equipo sin alucinaciones de proyectos ajenos. |
| **Estado (Status)** | PASS |
| **Defectos Asociados** | NA |
| **Comentarios / Observaciones** | NA |

---

### Caso de Prueba 5: TC-VAL-005
| Campo | Detalle |
| :--- | :--- |
| **ID del Caso de Prueba** | `TC-VAL-005` |
| **Nombre del Caso de Prueba** | Flujo E2E - Avance en el Roadmap de Onboarding (12 Semanas) y Validación de Progreso |
| **Nivel de Prueba** | 7.0 SW Validation (Nivel Sistema / E2E) |
| **Tipo de Prueba** | Funcional / Flujo de Usuario Principal / Gamificación |
| **Módulos / Vistas Involucradas** | `Onboarding.tsx` -> `TaskList.tsx` -> `Dashboard.tsx` |
| **Requerimiento Asociado** | `REQ-F-002` (Roadmap Estructurado de Aprendizaje) |
| **Precondiciones** | 1. Usuario nuevo con progreso inicial en 0% en la Fase 1 ("Semana 1: Bienvenida e Instalación"). |
| **Datos de Entrada** | Marcado de checks en 3 tareas consecutivas: "Instalar Git & Node", "Configurar VPN IBM", "Revisar Arquitectura". |
| **Procedimiento / Pasos de Ejecución** | 1. Navegar a `/onboarding`.<br>2. Desplegar el acordeón de la Fase 1.<br>3. Marcar las 3 casillas de verificación de las tareas completadas.<br>4. Validar la transición visual de las tarjetas a estado completado (estilo tachado/verde).<br>5. Regresar a la vista `/dashboard` y comprobar el indicador circular de progreso general. |
| **Resultado Esperado** | 1. Tareas persisten su estado como completadas inmediatamente.<br>2. Barra de progreso de la Fase 1 avanza proporcionalmente.<br>3. El widget de estadísticas del Dashboard se actualiza en tiempo real reflejando el nuevo porcentaje. |
| **Resultado Obtenido** | Actualización reactiva instantánea; el porcentaje pasó de 0% a 25% de forma congruente. |
| **Criterio de Aceptación** | Sincronización perfecta de estado entre vistas sin necesidad de recargar la página (`F5`). |
| **Estado (Status)** | PASS |
| **Defectos Asociados** | NA |
| **Comentarios / Observaciones** | NA |

---

### Caso de Prueba 6: TC-VAL-006
| Campo | Detalle |
| :--- | :--- |
| **ID del Caso de Prueba** | `TC-VAL-006` |
| **Nombre del Caso de Prueba** | Flujo E2E - Carga Masiva de Configuración de Equipo vía Archivo ZIP en Setup |
| **Nivel de Prueba** | 7.0 SW Validation (Nivel Sistema / E2E) |
| **Tipo de Prueba** | Funcional / Carga de Archivos / Procesamiento Batch |
| **Módulos / Vistas Involucradas** | `Setup.tsx` -> `FileUploadForm.tsx` -> Backend Ingestion Engine |
| **Requerimiento Asociado** | `REQ-F-007` (Importación de Configuración vía Archivo ZIP) |
| **Precondiciones** | 1. Usuario con rol Administrador en vista `/setup`.<br>2. Archivo `team-onboarding-data.zip` preparado con estructura de miembros y proyectos. |
| **Datos de Entrada** | Archivo `.zip` con manifiesto JSON y archivos Markdown descriptivos. |
| **Procedimiento / Pasos de Ejecución** | 1. Ingresar a `/setup`.<br>2. Seleccionar el método "Carga de Archivo (ZIP)".<br>3. Arrastrar y soltar el archivo `team-onboarding-data.zip` en la zona de drop.<br>4. Hacer clic en "Subir y Procesar".<br>5. Esperar la barra de progreso de ingestión y el mensaje de confirmación.<br>6. Verificar la actualización en las pestañas `/team` y `/projects`. |
| **Resultado Esperado** | 1. Notificación flotante de éxito (Toast) "Configuración importada exitosamente".<br>2. Aparición inmediata de los nuevos miembros y proyectos en sus respectivas pantallas. |
| **Resultado Obtenido** | Carga y descompresión completadas en 1.8 segundos; datos visibles en toda la plataforma. |
| **Criterio de Aceptación** | Procesamiento sin errores de formato y feedback visual claro en caso de archivo corrupto. |
| **Estado (Status)** | PASS |
| **Defectos Asociados** | NA |
| **Comentarios / Observaciones** | NA |

---

### Caso de Prueba 7: TC-VAL-007
| Campo | Detalle |
| :--- | :--- |
| **ID del Caso de Prueba** | `TC-VAL-007` |
| **Nombre del Caso de Prueba** | Validación E2E de Resiliencia ante Desconexión o Indisponibilidad de Ollama |
| **Nivel de Prueba** | 7.0 SW Validation (Nivel Sistema / E2E) |
| **Tipo de Prueba** | No Funcional / Tolerancia a Fallos y Manejo de Errores |
| **Módulos / Vistas Involucradas** | `Chat.tsx` -> `NotificationContainer.tsx` -> Backend Error Handler |
| **Requerimiento Asociado** | `REQ-NF-002` (Tolerancia a Fallos y Disponibilidad de IA) |
| **Precondiciones** | 1. Detener deliberadamente el servicio Ollama (`killall ollama` o puerto inaccesible). |
| **Datos de Entrada** | Mensaje de chat: "¿Qué debo hacer en mi primera semana?" |
| **Procedimiento / Pasos de Ejecución** | 1. Navegar a `/chat`.<br>2. Escribir y enviar el mensaje.<br>3. Observar la reacción de la interfaz ante el fallo de conexión con el backend/Ollama.<br>4. Verificar que el resto de la aplicación (Dashboard, Roadmap, Equipo) siga funcionando con normalidad. |
| **Resultado Esperado** | 1. Mostrar un mensaje informativo en el chat: "El asistente IA no se encuentra disponible momentáneamente. Por favor revisa el Roadmap o contacta a tu mentor."<br>2. Ninguna pantalla blanca (Crash) en React.<br>3. El resto de módulos operativos al 100%. |
| **Resultado Obtenido** | Error capturado por el ErrorBoundary y notificado elegantemente sin degradar la aplicación. |
| **Criterio de Aceptación** | Degradación elegante (*Graceful degradation*) sin afectación a módulos independientes. |
| **Estado (Status)** | PASS |
| **Defectos Asociados** | NA |
| **Comentarios / Observaciones** | NA |

---

### Caso de Prueba 8: TC-VAL-008
| Campo | Detalle |
| :--- | :--- |
| **ID del Caso de Prueba** | `TC-VAL-008` |
| **Nombre del Caso de Prueba** | Flujo E2E - Directorio de Equipo, Filtrado por Rol y Contacto con Mentores |
| **Nivel de Prueba** | 7.0 SW Validation (Nivel Sistema / E2E) |
| **Tipo de Prueba** | Funcional / Usabilidad / Navegabilidad |
| **Módulos / Vistas Involucradas** | `Team.tsx` -> `Header.tsx` |
| **Requerimiento Asociado** | `REQ-F-009` (Directorio Visual y Asignación de Mentores) |
| **Precondiciones** | 1. Workspace con 8 integrantes cargados (con roles: Developer, Lead, Mentor, Architect). |
| **Datos de Entrada** | Criterio de búsqueda en barra de filtro: "Mentor". |
| **Procedimiento / Pasos de Ejecución** | 1. Acceder a la ruta `/team`.<br>2. Revisar la cuadrícula de tarjetas de miembros con avatares, nombres, habilidades y estado de disponibilidad.<br>3. Escribir "Mentor" en el cuadro de filtro rápido.<br>4. Verificar que se filtren únicamente los miembros con la insignia de Mentor.<br>5. Hacer clic en el botón "Contactar" de una tarjeta y validar la apertura del cliente de mensajería/email. |
| **Resultado Esperado** | 1. Tarjetas renderizadas con diseño responsivo y claro.<br>2. Filtrado dinámico instantáneo sin parpadeo de pantalla.<br>3. Enlace `mailto:` generado con el correo del mentor seleccionado. |
| **Resultado Obtenido** | Filtrado fluido y renderizado de tarjetas con datos completos de contacto. |
| **Criterio de Aceptación** | Información de contacto 100% visible y accionable para el nuevo colaborador. |
| **Estado (Status)** | PASS |
| **Defectos Asociados** | NA |
| **Comentarios / Observaciones** | NA |

---

### Caso de Prueba 9: TC-VAL-009
| Campo | Detalle |
| :--- | :--- |
| **ID del Caso de Prueba** | `TC-VAL-009` |
| **Nombre del Caso de Prueba** | Flujo E2E - Generación de Enlace de Invitación y Compartición de Workspace |
| **Nivel de Prueba** | 7.0 SW Validation (Nivel Sistema / E2E) |
| **Tipo de Prueba** | Funcional / Flujo Administrativo |
| **Módulos / Vistas Involucradas** | `Header.tsx` -> Modal de Invitación -> Portapapeles del Sistema |
| **Requerimiento Asociado** | `REQ-F-010` (Sistema de Invitación Rápida a Colaboradores) |
| **Precondiciones** | 1. Usuario con permisos de Administrador activo en el sistema. |
| **Datos de Entrada** | Clic en botón "Invitar Miembros" en la barra superior. |
| **Procedimiento / Pasos de Ejecución** | 1. Presionar el botón "Invitar" en la esquina superior derecha.<br>2. Se despliega el modal con el código del workspace y el enlace directo `http://localhost:5173/join?code=devo-8f92a1`.<br>3. Hacer clic en "Copiar Enlace".<br>4. Pegar en una nueva ventana del navegador y comprobar que el formulario de ingreso ya tenga el código pre-llenado. |
| **Resultado Esperado** | 1. Modal interactivo con copiado al portapapeles en 1 clic.<br>2. Notificación Toast "Enlace copiado al portapapeles".<br>3. Apertura de la URL con pre-carga automática del código de workspace. |
| **Resultado Obtenido** | Enlace generado, copiado y validado en ventana externa con carga automática del código. |
| **Criterio de Aceptación** | Cero errores de sintaxis en el URL generado y retención del código en query param. |
| **Estado (Status)** | PASS |
| **Defectos Asociados** | NA |
| **Comentarios / Observaciones** | NA |

---

### Caso de Prueba 10: TC-VAL-010
| Campo | Detalle |
| :--- | :--- |
| **ID del Caso de Prueba** | `TC-VAL-010` |
| **Nombre del Caso de Prueba** | Validación E2E de Control de Acceso Basado en Roles (RBAC: Admin vs Member) |
| **Nivel de Prueba** | 7.0 SW Validation (Nivel Sistema / E2E) |
| **Tipo de Prueba** | Seguridad / Autorización y Control de Acceso (RBAC) |
| **Módulos / Vistas Involucradas** | `Sidebar.tsx` -> `Setup.tsx` -> React Router Protected Routes |
| **Requerimiento Asociado** | `REQ-NF-005` (Control de Acceso y Privilegios por Rol) |
| **Precondiciones** | 1. Usuario A autenticado como `admin`.<br>2. Usuario B autenticado como `member`. |
| **Datos de Entrada** | Intento de navegación a la ruta protegida `/setup`. |
| **Procedimiento / Pasos de Ejecución** | 1. Con el Usuario A (Admin), verificar que el menú lateral muestre la opción "Configuración / Setup" y permita el acceso.<br>2. Cerrar sesión y acceder como Usuario B (Member).<br>3. Verificar que la opción "Configuración" no esté visible en la barra lateral.<br>4. Escribir manualmente en la barra de direcciones del navegador `http://localhost:5173/setup`.<br>5. Observar la respuesta del guardián de rutas de React Router. |
| **Resultado Esperado** | 1. La interfaz adapta las opciones visibles según los privilegios del rol.<br>2. Ante acceso manual no autorizado, el sistema bloquea el paso y redirige a `/dashboard` con alerta de "Acceso Denegado". |
| **Resultado Obtenido** | Bloqueo exitoso de rutas administrativas para usuarios regulares. |
| **Criterio de Aceptación** | Ningún usuario con rol `member` puede acceder ni ejecutar operaciones de configuración. |
| **Estado (Status)** | PASS |
| **Defectos Asociados** | NA |
| **Comentarios / Observaciones** | NA |
