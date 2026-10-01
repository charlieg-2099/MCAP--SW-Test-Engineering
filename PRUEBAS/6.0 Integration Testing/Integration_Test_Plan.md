# PLAN DE PRUEBAS DE INTEGRACIÓN / INTEGRATION TEST PLAN (6.0)

**Proyecto:** IBM Onboarding Assistant - Multi-Tenant Edition  
**Módulo / Nivel:** 6.0 Integration Testing (Pruebas de Integración)  
**Autor / Tester:** CARLOS ALBERTO GUZMAN MONTES  
**Fecha de Creación:** 2026-10-01  
**Versión del Software:** 2.0.0  
**Estado General:** Aprobado / Ejecutado  

---

## 1. Información General del Nivel de Prueba
- **Objetivo:** Verificar la correcta interacción, paso de mensajes, persistencia y protocolos de comunicación entre los distintos módulos: Controladores REST, Capa de Servicios, Base de Datos SQLite, Middleware de Seguridad/Multi-Tenant, Ingestión de Datos y Motor Ollama AI.
- **Técnicas Empleadas:** Integración Bottom-Up / Top-Down, Pruebas de Interfaces de API (REST/JSON), Verificación de Transacciones de Base de Datos.
- **Herramientas de Soporte:** Supertest, SQLite3 Driver, Mock Server / Ollama Instance.

---

## 2. Especificación Detallada de Casos de Prueba (10 Casos)

### Caso de Prueba 1: TC-IT-001
| Campo | Detalle |
| :--- | :--- |
| **ID del Caso de Prueba** | `TC-IT-001` |
| **Nombre del Caso de Prueba** | Integración Creación de Workspace (REST API -> Service -> SQLite) |
| **Nivel de Prueba** | 6.0 Integration Testing |
| **Tipo de Prueba** | Integración de Datos y Transaccionalidad |
| **Módulos / Componentes Integrados** | `routes/workspaces.js` <--> `services/workspaceService.js` <--> `db/database.js (SQLite)` |
| **Requerimiento Asociado** | `REQ-F-001` (Creación de Espacios de Trabajo Aislados) |
| **Precondiciones** | 1. Servidor Express activo.<br>2. Base de datos SQLite inicializada con `multi-tenant-schema.sql`. |
| **Datos de Entrada** | Request `POST /api/workspaces` con Body: `{"name": "Frontend Guild", "description": "UI Core Developers"}` y Header: `X-User-Id: user-admin-01`. |
| **Procedimiento / Pasos de Ejecución** | 1. Enviar petición HTTP POST a `/api/workspaces`.<br>2. El router intercepta y delega a `workspaceService.createWorkspace()`.<br>3. El servicio genera código único y ejecuta inserción `INSERT INTO workspaces ...`.<br>4. Ejecutar consulta directa `SELECT * FROM workspaces WHERE code = ?` para verificar persistencia física en disco. |
| **Resultado Esperado** | 1. Código HTTP 201 Created devuelto al cliente.<br>2. Respuesta JSON con `workspaceId`, `workspaceCode` (ej. "fron-xxxxxx") y `createdAt`.<br>3. Registro idéntico almacenado en la tabla `workspaces` de SQLite. |
| **Resultado Obtenido** | HTTP 201 recibido, ID autoincremental generado y registro persistido en la base de datos sin errores de integridad. |
| **Criterio de Aceptación** | Tiempo de respuesta < 200ms y persistencia 100% verificada en DB. |
| **Estado (Status)** | PASS |
| **Defectos Asociados** | NA |
| **Comentarios / Observaciones** | NA |

---

### Caso de Prueba 2: TC-IT-002
| Campo | Detalle |
| :--- | :--- |
| **ID del Caso de Prueba** | `TC-IT-002` |
| **Nombre del Caso de Prueba** | Integración Unirse a Workspace con Código (REST API -> Validación DB -> Creación de Miembro) |
| **Nivel de Prueba** | 6.0 Integration Testing |
| **Tipo de Prueba** | Integración de Flujo de Negocio y Relaciones Relacionales |
| **Módulos / Componentes Integrados** | `routes/workspaces.js` <--> `db/database.js (Tablas workspaces & workspace_members)` |
| **Requerimiento Asociado** | `REQ-F-004` (Acceso a Espacio de Trabajo por Código) |
| **Precondiciones** | 1. Workspace existente con código activo `test-123456`.<br>2. Usuario registrado `user-newhire-99`. |
| **Datos de Entrada** | Request `POST /api/workspaces/join` con Body: `{"workspaceCode": "test-123456", "userInfo": {"email": "newhire@ibm.com", "firstName": "Carlos", "lastName": "Guzman"}}`. |
| **Procedimiento / Pasos de Ejecución** | 1. Enviar petición POST de unión a `/api/workspaces/join`.<br>2. El sistema valida la existencia y estado activo del código en `workspaces`.<br>3. Inserta relación en tabla `workspace_members` con rol `member`.<br>4. Verifica que una segunda llamada con el mismo usuario retorne conflicto 409 (Idempotencia). |
| **Resultado Esperado** | 1. Código HTTP 200 OK con payload `{ joined: true, workspaceId: "...", role: "member" }`.<br>2. Creación efectiva de la tupla relacional en `workspace_members`.<br>3. Prevención de registros duplicados en DB. |
| **Resultado Obtenido** | Asociación creada exitosamente y validación de duplicados funcionando adecuadamente. |
| **Criterio de Aceptación** | Asociación correcta de claves foráneas `workspace_id` y `user_id`. |
| **Estado (Status)** | PASS |
| **Defectos Asociados** | NA |
| **Comentarios / Observaciones** | NA |

---

### Caso de Prueba 3: TC-IT-003
| Campo | Detalle |
| :--- | :--- |
| **ID del Caso de Prueba** | `TC-IT-003` |
| **Nombre del Caso de Prueba** | Integración Consulta Agregada del Dashboard (REST API -> Multiconsulta SQLite) |
| **Nivel de Prueba** | 6.0 Integration Testing |
| **Tipo de Prueba** | Integración de Agregación de Datos |
| **Módulos / Componentes Integrados** | `routes/dashboard.js` <--> `db/database.js (Tablas tasks, team_members, projects)` |
| **Requerimiento Asociado** | `REQ-F-005` (Dashboard General de Métricas) |
| **Precondiciones** | 1. Base de datos con datos precargados para el workspace `ws-101`: 5 miembros, 3 proyectos, 20 tareas (10 completadas). |
| **Datos de Entrada** | Request `GET /api/dashboard/stats` con Header: `X-Workspace-Id: ws-101`. |
| **Procedimiento / Pasos de Ejecución** | 1. Realizar petición HTTP GET a `/api/dashboard/stats`.<br>2. Interceptar las 3 consultas concurrentes ejecutadas (`Promise.all`) contra las tablas correspondientes.<br>3. Consolidar el objeto de respuesta.<br>4. Verificar que solo se agreguen los datos pertenecientes al `workspace_id = ws-101`. |
| **Resultado Esperado** | 1. Código HTTP 200 OK.<br>2. Payload `{ teamCount: 5, activeProjects: 3, totalTasks: 20, completedTasks: 10, overallProgress: 50 }`.<br>3. Cero fuga de métricas de otros workspaces existentes en la base de datos. |
| **Resultado Obtenido** | Métricas consolidadas en un único payload JSON con integridad y aislamiento multi-tenant. |
| **Criterio de Aceptación** | Precisión matemática exacta entre las tuplas en DB y el JSON devuelto. |
| **Estado (Status)** | PASS |
| **Defectos Asociados** | NA |
| **Comentarios / Observaciones** | NA |

---

### Caso de Prueba 4: TC-IT-004
| Campo | Detalle |
| :--- | :--- |
| **ID del Caso de Prueba** | `TC-IT-004` |
| **Nombre del Caso de Prueba** | Integración Chat Asistente IA (Chat Controller -> Context Service -> Ollama Client) |
| **Nivel de Prueba** | 6.0 Integration Testing |
| **Tipo de Prueba** | Integración de Servicios Externos e Inyección de Dependencias |
| **Módulos / Componentes Integrados** | `routes/chat.js` <--> `services/contextService.js` <--> `services/ollamaService.js` |
| **Requerimiento Asociado** | `REQ-F-003` (Asistente IA Contextualizado por Equipo) |
| **Precondiciones** | 1. Instancia local de Ollama en ejecución (`http://localhost:11434`) con modelo `granite4.1:3b`.<br>2. Workspace activo con contexto de proyectos cargado. |
| **Datos de Entrada** | Request `POST /api/chat/message` con Body: `{"sessionId": "sess-01", "message": "¿Cuál es la arquitectura del proyecto?"}` y Header `X-Workspace-Id: ws-101`. |
| **Procedimiento / Pasos de Ejecución** | 1. Enviar mensaje de chat vía POST.<br>2. `chat.js` invoca `contextService` para recuperar información del workspace.<br>3. Ensambla el system prompt enriquecido y despacha petición HTTP hacia la API de Ollama.<br>4. Recibir stream o buffer de respuesta y formatear JSON de salida. |
| **Resultado Esperado** | 1. Código HTTP 200 OK.<br>2. Payload `{ role: "assistant", content: "...", timestamp: "..." }`.<br>3. Respuesta generada contiene referencias explícitas al contexto inyectado del workspace. |
| **Resultado Obtenido** | Flujo completo ejecutado en < 1.5s, respuesta de IA enriquecida con los metadatos del proyecto. |
| **Criterio de Aceptación** | Comunicación bidireccional exitosa con Ollama y persistencia de mensaje en historial. |
| **Estado (Status)** | PASS |
| **Defectos Asociados** | NA |
| **Comentarios / Observaciones** | NA |

---

### Caso de Prueba 5: TC-IT-005
| Campo | Detalle |
| :--- | :--- |
| **ID del Caso de Prueba** | `TC-IT-005` |
| **Nombre del Caso de Prueba** | Integración Ingestión de Datos GitHub (GitHub Extractor -> Validator -> DB Persistence) |
| **Nivel de Prueba** | 6.0 Integration Testing |
| **Tipo de Prueba** | Integración de Procesamiento de Datos Asíncrono |
| **Módulos / Componentes Integrados** | `routes/config.js` <--> `services/dataIngestion/githubExtractor.js` <--> `services/dataIngestion/validatorService.js` <--> `db/database.js` |
| **Requerimiento Asociado** | `REQ-F-006` (Configuración Automática desde Repositorios) |
| **Precondiciones** | 1. Mock de GitHub API respondiendo con árbol de archivos y `package.json` / `README.md`. |
| **Datos de Entrada** | Request `POST /api/config/setup/github` con Body: `{"repoUrl": "https://github.com/sample/onboarding-repo", "token": "ghp_mockToken"}`. |
| **Procedimiento / Pasos de Ejecución** | 1. Invocar endpoint de setup de GitHub.<br>2. `githubExtractor` descarga metadatos del repositorio.<br>3. `validatorService` valida estructura y tipos de datos extraídos.<br>4. `jsonWriter` / DB persiste la configuración del workspace. |
| **Resultado Esperado** | 1. Código HTTP 200 OK con resumen de elementos importados (módulos, herramientas, dependencias).<br>2. Inserción de los proyectos correspondientes en la tabla `projects`. |
| **Resultado Obtenido** | Pipeline de extracción, validación y persistencia ejecutado sin discrepancias de esquema. |
| **Criterio de Aceptación** | Validación de esquema al 100% antes de permitir la persistencia en DB. |
| **Estado (Status)** | PASS |
| **Defectos Asociados** | NA |
| **Comentarios / Observaciones** | NA |

---

### Caso de Prueba 6: TC-IT-006
| Campo | Detalle |
| :--- | :--- |
| **ID del Caso de Prueba** | `TC-IT-006` |
| **Nombre del Caso de Prueba** | Integración Carga y Extracción de Archivo ZIP (File Extractor -> Cleanup Service) |
| **Nivel de Prueba** | 6.0 Integration Testing |
| **Tipo de Prueba** | Manejo de Archivos / I/O de Sistema / Limpieza Automática |
| **Módulos / Componentes Integrados** | `routes/config.js` (Multer) <--> `services/dataIngestion/fileExtractor.js` <--> `services/dataIngestion/cleanupService.js` |
| **Requerimiento Asociado** | `REQ-F-007` (Importación de Configuración vía Archivo ZIP) |
| **Precondiciones** | 1. Archivo ZIP de prueba válido estructurado (`test-project.zip` con archivos .json y .md).<br>2. Directorio temporal de carga con permisos de escritura. |
| **Datos de Entrada** | Multipart Form Data `POST /api/config/setup/file` conteniendo archivo `test-project.zip` (tamaño: 2.5 MB). |
| **Procedimiento / Pasos de Ejecución** | 1. Enviar archivo ZIP mediante petición multipart.<br>2. Middleware `multer` guarda temporalmente en `/tmp/uploads`.<br>3. `fileExtractor` descomprime en memoria/directorio temporal y analiza archivos clave.<br>4. Invocar `cleanupService` y verificar purga de archivos residuales. |
| **Resultado Esperado** | 1. HTTP 200 OK con confirmación de extracción exitosa.<br>2. Archivos temporales eliminados del sistema de archivos tras el procesamiento. |
| **Resultado Obtenido** | Descompresión procesada y remoción total de archivos temporales confirmada por `cleanupService`. |
| **Criterio de Aceptación** | Cero residuos de archivos huérfanos en disco tras finalizar la extracción. |
| **Estado (Status)** | PASS |
| **Defectos Asociados** | NA |
| **Comentarios / Observaciones** | NA |

---

### Caso de Prueba 7: TC-IT-007
| Campo | Detalle |
| :--- | :--- |
| **ID del Caso de Prueba** | `TC-IT-007` |
| **Nombre del Caso de Prueba** | Integración Frontend Context y Propagación de Headers Multi-Tenant en API Client |
| **Nivel de Prueba** | 6.0 Integration Testing |
| **Tipo de Prueba** | Integración Frontend-Backend / Middleware de Red |
| **Módulos / Componentes Integrados** | `front2/src/context/AuthContext.tsx` <--> `front2/src/services/api.service.ts` <--> `backend/src/server.js` (CORS & Headers) |
| **Requerimiento Asociado** | `REQ-NF-003` (Seguridad en Transmisión de Contexto de Sesión) |
| **Precondiciones** | 1. Cliente React montado con `AuthContext` conteniendo sesión activa de `workspaceId: "ws-999"`. |
| **Datos de Entrada** | Llamada a servicio `apiService.get('/api/tasks')`. |
| **Procedimiento / Pasos de Ejecución** | 1. Disparar petición desde el cliente frontend.<br>2. El interceptor de Axios/Fetch inyecta los headers `X-Workspace-Id: ws-999` y `X-User-Id: usr-123`.<br>3. Backend recibe la petición y el middleware valida la presencia de los encabezados.<br>4. Verificar recepción y respuesta en el hook del cliente `useOnboarding`. |
| **Resultado Esperado** | 1. Petición HTTP contiene los headers requeridos sin manipulación manual en cada llamada.<br>2. Backend autoriza y filtra la consulta según el header recibido. |
| **Resultado Obtenido** | Interceptor inyecta los headers automáticamente en todas las peticiones salientes. |
| **Criterio de Aceptación** | 100% de las peticiones salientes autenticadas llevan el `X-Workspace-Id` correspondiente. |
| **Estado (Status)** | PASS |
| **Defectos Asociados** | NA |
| **Comentarios / Observaciones** | NA |

---

### Caso de Prueba 8: TC-IT-008
| Campo | Detalle |
| :--- | :--- |
| **ID del Caso de Prueba** | `TC-IT-008` |
| **Nombre del Caso de Prueba** | Integración Actualización de Estado de Tareas y Recálculo de Progreso |
| **Nivel de Prueba** | 6.0 Integration Testing |
| **Tipo de Prueba** | Integración de Estado y Efectos Cascada en DB |
| **Módulos / Componentes Integrados** | `routes/tasks.js` <--> `db/database.js` <--> `routes/dashboard.js` |
| **Requerimiento Asociado** | `REQ-F-002` (Monitoreo de Avance en Roadmap) |
| **Precondiciones** | 1. Tarea `task-55` en estado `pending` en base de datos. |
| **Datos de Entrada** | Request `PUT /api/tasks/task-55` con Body: `{"status": "completed", "completedAt": "2026-10-01T10:00:00Z"}`. |
| **Procedimiento / Pasos de Ejecución** | 1. Enviar actualización de tarea vía PUT.<br>2. Verificar ejecución de query `UPDATE tasks SET status = 'completed' WHERE id = 'task-55'`.<br>3. Consultar inmediatamente `GET /api/dashboard/stats`.<br>4. Comprobar incremento numérico en `completedTasks` y nuevo porcentaje. |
| **Resultado Esperado** | 1. HTTP 200 OK en actualización.<br>2. Estadísticas del dashboard reflejan el nuevo estado de forma síncrona y consistente. |
| **Resultado Obtenido** | Tarea marcada como completada y reflejo inmediato en el cálculo global del dashboard. |
| **Criterio de Aceptación** | Consistencia de lectura tras escritura (Read-after-write consistency) inmediata. |
| **Estado (Status)** | PASS |
| **Defectos Asociados** | NA |
| **Comentarios / Observaciones** | NA |

---

### Caso de Prueba 9: TC-IT-009
| Campo | Detalle |
| :--- | :--- |
| **ID del Caso de Prueba** | `TC-IT-009` |
| **Nombre del Caso de Prueba** | Integración Middleware de Aislamiento Multi-Tenant contra Consultas Cruzadas |
| **Nivel de Prueba** | 6.0 Integration Testing |
| **Tipo de Prueba** | Seguridad / Integración de Control de Acceso y Persistencia |
| **Módulos / Componentes Integrados** | `server.js (Middleware Tenant Filter)` <--> `routes/dashboard.js` <--> `db/database.js` |
| **Requerimiento Asociado** | `REQ-NF-004` (Aislamiento Estricto de Datos entre Inquilinos) |
| **Precondiciones** | 1. Workspace A (`ws-alpha`) con 10 proyectos.<br>2. Workspace B (`ws-beta`) con 3 proyectos. |
| **Datos de Entrada** | Request `GET /api/projects` con Header `X-Workspace-Id: ws-beta`. |
| **Procedimiento / Pasos de Ejecución** | 1. Realizar llamada GET con credenciales del Workspace B.<br>2. Middleware valida token/header y anexa cláusula obligatoria `WHERE workspace_id = 'ws-beta'` a la consulta SQL.<br>3. Evaluar el array de respuesta devuelto.<br>4. Verificar que ningún proyecto perteneciente a `ws-alpha` figure en el resultado. |
| **Resultado Esperado** | 1. Retorno de exactamente los 3 proyectos de `ws-beta`.<br>2. Cero registros filtrados o mezclados de otros inquilinos. |
| **Resultado Obtenido** | Aislamiento verificado; las consultas SQL están debidamente parametrizadas por Workspace. |
| **Criterio de Aceptación** | Prohibición absoluta de fuga de información entre diferentes IDs de workspace. |
| **Estado (Status)** | PASS |
| **Defectos Asociados** | NA |
| **Comentarios / Observaciones** | NA |

---

### Caso de Prueba 10: TC-IT-010
| Campo | Detalle |
| :--- | :--- |
| **ID del Caso de Prueba** | `TC-IT-010` |
| **Nombre del Caso de Prueba** | Integración Persistencia y Recuperación del Historial de Sesiones de Chat |
| **Nivel de Prueba** | 6.0 Integration Testing |
| **Tipo de Prueba** | Integración de Flujo Histórico y Serialización JSON |
| **Módulos / Componentes Integrados** | `routes/chat.js` <--> `routes/history.js` <--> `db/database.js (Tabla chat_messages)` |
| **Requerimiento Asociado** | `REQ-F-008` (Historial Persistente de Consultas IA) |
| **Precondiciones** | 1. Sesión de chat creada `session-xyz` asociada a `user-01`. |
| **Datos de Entrada** | 1. `POST /api/chat/message` con mensaje "Hola".<br>2. `GET /api/history/session-xyz`. |
| **Procedimiento / Pasos de Ejecución** | 1. Enviar mensaje de usuario y esperar respuesta del asistente.<br>2. Verificar inserción de ambos mensajes (rol `user` y rol `assistant`) en la tabla `chat_messages`.<br>3. Invocar endpoint de recuperación de historial `/api/history/session-xyz`.<br>4. Validar orden cronológico ascendente por timestamp. |
| **Resultado Esperado** | 1. Historial devuelto como un array ordenado de objetos de mensaje con roles, texto y marcas de tiempo.<br>2. Persistencia inmutable de la conversación. |
| **Resultado Obtenido** | Mensajes guardados y recuperados en el orden cronológico exacto de la interacción. |
| **Criterio de Aceptación** | Recuperación íntegra de la conversación sin truncamiento de caracteres ni desorden temporal. |
| **Estado (Status)** | PASS |
| **Defectos Asociados** | NA |
| **Comentarios / Observaciones** | NA |
