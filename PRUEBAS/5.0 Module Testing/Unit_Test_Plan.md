# PLAN DE PRUEBAS DE MÓDULO / UNIT TEST PLAN (5.0)

**Proyecto:** IBM Onboarding Assistant - Multi-Tenant Edition  
**Módulo / Nivel:** 5.0 Module Testing (Pruebas Unitarias)  
**Autor / Tester:** CARLOS ALBERTO GUZMAN MONTES  
**Fecha de Creación:** 2026-10-01  
**Versión del Software:** 2.0.0  
**Estado General:** Aprobado / Ejecutado  

---

## 1. Información General del Nivel de Prueba
- **Objetivo:** Verificar a nivel unitario la lógica de control, algoritmos de cálculo, sanitización de entradas, formateo de contexto para IA y manejo de excepciones en las funciones individuales del sistema de Onboarding.
- **Técnicas Empleadas:** Caja Blanca, Análisis de Valores Límite, Partición de Equivalencias.
- **Herramientas de Soporte:** Node.js Test Runner / Jest / Mocking de dependencias.

---

## 2. Especificación Detallada de Casos de Prueba (5 Casos)

### Caso de Prueba 1: TC-UT-001
| Campo | Detalle |
| :--- | :--- |
| **ID del Caso de Prueba** | `TC-UT-001` |
| **Nombre del Caso de Prueba** | Validación de Generación y Formato de Código Único de Workspace |
| **Nivel de Prueba** | 5.0 Module Testing (Unit Testing) |
| **Tipo de Prueba** | Funcional / Caja Blanca / Lógica de Algoritmo |
| **Módulo / Función Evaluada** | `backend/src/services/workspaceService.js` -> `generateWorkspaceCode(name)` |
| **Requerimiento Asociado** | `REQ-F-001` (Creación de Espacios de Trabajo Aislados) |
| **Precondiciones** | 1. Módulo `workspaceService.js` cargado en entorno de pruebas.<br>2. Generador de números/caracteres pseudoaleatorios disponible. |
| **Datos de Entrada** | - Entrada 1: `name = "Engineering Team"`<br>- Entrada 2: `name = "QA"`<br>- Entrada 3: `name = ""` (Cadena vacía)<br>- Entrada 4: `name = null` |
| **Procedimiento / Pasos de Ejecución** | 1. Invocar `generateWorkspaceCode("Engineering Team")`.<br>2. Validar que la cadena devuelta comience con los primeros 4 caracteres limpios ("engi") seguidos de guión y un hash alfanumérico de 6 caracteres.<br>3. Verificar longitud total exacta igual a 11 caracteres.<br>4. Invocar con "QA" y verificar relleno de caracteres por defecto.<br>5. Invocar con `""` y `null`, verificando el manejo de fallback seguro ("work-xxxxxx"). |
| **Resultado Esperado** | 1. Retorna formato regex `^[a-z0-9]{4}-[a-z0-9]{6}$`.<br>2. Manejo de entradas inválidas sin lanzar excepciones no controladas.<br>3. Caracteres especiales y espacios eliminados automáticamente. |
| **Resultado Obtenido** | Código generado cumple con la estructura regex `engi-xxxxxx` y sanitización estricta. |
| **Criterio de Aceptación** | Cumplimiento del 100% de los patrones alfanuméricos y unicidad en 10,000 iteraciones consecutivas. |
| **Estado (Status)** | PASS |
| **Defectos Asociados** | NA |
| **Comentarios / Observaciones** | NA |

---

### Caso de Prueba 2: TC-UT-002
| Campo | Detalle |
| :--- | :--- |
| **ID del Caso de Prueba** | `TC-UT-002` |
| **Nombre del Caso de Prueba** | Cálculo Matemático del Porcentaje de Progreso de Onboarding por Usuario |
| **Nivel de Prueba** | 5.0 Module Testing (Unit Testing) |
| **Tipo de Prueba** | Funcional / Lógica Aritmética / Valores Límite |
| **Módulo / Función Evaluada** | `backend/src/routes/tasks.js` -> `calculateUserProgress(completedTasks, totalTasks)` |
| **Requerimiento Asociado** | `REQ-F-002` (Monitoreo de Avance en Roadmap) |
| **Precondiciones** | 1. Función aritmética pura disponible sin dependencia de base de datos. |
| **Datos de Entrada** | - Caso Límite Inferior: `completedTasks = 0, totalTasks = 24`<br>- Caso Intermedio: `completedTasks = 12, totalTasks = 24`<br>- Caso Límite Superior: `completedTasks = 24, totalTasks = 24`<br>- Caso Borde (División entre Cero): `completedTasks = 0, totalTasks = 0`<br>- Caso Anomalía: `completedTasks = 30, totalTasks = 24` |
| **Procedimiento / Pasos de Ejecución** | 1. Ejecutar función con 0/24 y verificar resultado numérico.<br>2. Ejecutar con 12/24 y verificar 50%.<br>3. Ejecutar con 24/24 y verificar 100%.<br>4. Ejecutar con 0/0 y verificar que retorne 0 en lugar de `NaN` o `Infinity`.<br>5. Ejecutar con 30/24 y verificar truncado máximo a 100. |
| **Resultado Esperado** | 1. Retorno de valores enteros en rango [0, 100].<br>2. Retorno de `0` ante `totalTasks = 0`.<br>3. Retorno de `100` ante desbordamiento superior (`completed > total`). |
| **Resultado Obtenido** | Cálculo exacto de porcentajes y neutralización de división por cero. |
| **Criterio de Aceptación** | Sin errores de `NaN` ni valores flotantes no redondeados. |
| **Estado (Status)** | PASS |
| **Defectos Asociados** | NA |
| **Comentarios / Observaciones** | NA |

---

### Caso de Prueba 3: TC-UT-003
| Campo | Detalle |
| :--- | :--- |
| **ID del Caso de Prueba** | `TC-UT-003` |
| **Nombre del Caso de Prueba** | Sanitización y Validación de Payload de Registro de Usuario |
| **Nivel de Prueba** | 5.0 Module Testing (Unit Testing) |
| **Tipo de Prueba** | Seguridad / Validación de Entradas / Caja Blanca |
| **Módulo / Función Evaluada** | `backend/src/routes/users.js` -> `validateUserInput(payload)` |
| **Requerimiento Asociado** | `REQ-NF-001` (Integridad y Seguridad de Datos de Usuario) |
| **Precondiciones** | 1. Esquema de validación instanciado en memoria. |
| **Datos de Entrada** | - Entrada Válida: `{ email: "carlos.guzman@ibm.com", firstName: "Carlos", lastName: "Guzman", role: "admin" }`<br>- Inyección SQL / XSS: `{ email: "<script>alert(1)</script>@test.com", firstName: "Carlos'; DROP TABLE users;--", lastName: "Guzman" }`<br>- Formato Inválido: `{ email: "correo_sin_arroba.com", firstName: "", lastName: "Guzman" }` |
| **Procedimiento / Pasos de Ejecución** | 1. Pasar payload con datos válidos y verificar objeto de respuesta `{ isValid: true, errors: [] }`.<br>2. Pasar payload con caracteres especiales de inyección XSS y SQL.<br>3. Verificar escapeo de caracteres `<, >, ', "` y normalización de email a minúsculas.<br>4. Pasar payload con email sin formato estándar y validar objeto `{ isValid: false, errors: ['Invalid email format'] }`. |
| **Resultado Esperado** | 1. Validación estricta con regex RFC 5322 para correos.<br>2. Sanitización completa de strings evitando inyecciones.<br>3. Bloqueo de registros incompletos. |
| **Resultado Obtenido** | Sanitización correcta de caracteres maliciosos y rechazo de payloads inválidos. |
| **Criterio de Aceptación** | Ningún payload no sanitizado debe pasar a la capa de persistencia. |
| **Estado (Status)** | PASS |
| **Defectos Asociados** | NA |
| **Comentarios / Observaciones** | NA |

---

### Caso de Prueba 4: TC-UT-004
| Campo | Detalle |
| :--- | :--- |
| **ID del Caso de Prueba** | `TC-UT-004` |
| **Nombre del Caso de Prueba** | Construcción e Inyección de Contexto Dinámico para Prompt de IA |
| **Nivel de Prueba** | 5.0 Module Testing (Unit Testing) |
| **Tipo de Prueba** | Funcional / Integridad de Datos / Ensamblado de Strings |
| **Módulo / Función Evaluada** | `backend/src/services/contextService.js` -> `buildPromptContext(workspaceData, userQuery)` |
| **Requerimiento Asociado** | `REQ-F-003` (Asistente IA Contextualizado por Equipo) |
| **Precondiciones** | 1. Mock de objeto `workspaceData` con lista de proyectos, miembros y herramientas. |
| **Datos de Entrada** | - `workspaceData`: `{ teamName: "Cloud DevOps", projects: ["Project Titan", "CI/CD Pipeline"], tools: ["Docker", "Kubernetes", "OpenShift"] }`<br>- `userQuery`: "¿Cuáles son las herramientas principales de mi equipo?" |
| **Procedimiento / Pasos de Ejecución** | 1. Llamar a `buildPromptContext(workspaceData, userQuery)`.<br>2. Evaluar el string de system prompt generado.<br>3. Comprobar que contenga las etiquetas de contexto del equipo, nombres de proyectos y herramientas.<br>4. Verificar que si `workspaceData` es nulo o vacío, genere un contexto neutral por defecto sin lanzar excepción. |
| **Resultado Esperado** | 1. String estructurado con delimitadores claros (ej. `[CONTEXT: Team=Cloud DevOps, Tools=Docker, Kubernetes...]`).<br>2. Inclusión íntegra de la consulta del usuario.<br>3. Fallback seguro ante metadatos incompletos. |
| **Resultado Obtenido** | Contexto generado contiene toda la metadata del equipo en el formato exacto requerido por el modelo Granite. |
| **Criterio de Aceptación** | Longitud de prompt dentro de los límites de tokens permitidos y sin campos `undefined` concatenados. |
| **Estado (Status)** | PASS |
| **Defectos Asociados** | NA |
| **Comentarios / Observaciones** | NA |

---

### Caso de Prueba 5: TC-UT-005
| Campo | Detalle |
| :--- | :--- |
| **ID del Caso de Prueba** | `TC-UT-005` |
| **Nombre del Caso de Prueba** | Normalización y Mapeo de Respuestas y Errores del Cliente Ollama |
| **Nivel de Prueba** | 5.0 Module Testing (Unit Testing) |
| **Tipo de Prueba** | Robustez / Manejo de Excepciones / Caja Blanca |
| **Módulo / Función Evaluada** | `backend/src/services/ollamaService.js` -> `normalizeOllamaResponse(rawResponse, error)` |
| **Requerimiento Asociado** | `REQ-NF-002` (Tolerancia a Fallos y Disponibilidad de IA) |
| **Precondiciones** | 1. Mocks de respuestas HTTP de Ollama (200 OK, 500 Internal Error, ECONNREFUSED Timeout). |
| **Datos de Entrada** | - Entrada 1 (Éxito): `{ message: { role: "assistant", content: "Bienvenido al equipo." } }`<br>- Entrada 2 (Fallo Conexión): `Error("connect ECONNREFUSED 127.0.0.1:11434")`<br>- Entrada 3 (Modelo no encontrado): `Error("model 'granite4.1:3b' not found")` |
| **Procedimiento / Pasos de Ejecución** | 1. Ejecutar función con Entrada 1 y validar formato estandarizado `{ success: true, text: "Bienvenido al equipo.", error: null }`.<br>2. Ejecutar con Entrada 2 y verificar mensaje amigable `{ success: false, text: "Servicio de IA temporalmente no disponible.", error: "CONNECTION_REFUSED" }`.<br>3. Ejecutar con Entrada 3 y verificar código de error tipificado. |
| **Resultado Esperado** | 1. Objeto de retorno normalizado con interfaz homogénea para el resto del backend.<br>2. Ningún stack trace sensible expuesto hacia capas superiores.<br>3. Preservación del estado del sistema sin crashes del proceso Node.js. |
| **Resultado Obtenido** | Respuestas y errores mapeados correctamente a la interfaz estándar. |
| **Criterio de Aceptación** | 100% de las ramas de error capturadas y transformadas en respuestas amigables. |
| **Estado (Status)** | PASS |
| **Defectos Asociados** | NA |
| **Comentarios / Observaciones** | NA |
