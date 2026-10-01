# MATRIZ DE TRAZABILIDAD DE REQUERIMIENTOS Y PRUEBAS (1.0)

**Proyecto:** IBM Onboarding Assistant - Multi-Tenant Edition  
**Nivel Metodológico:** Ciclo V (Requirements Traceability Matrix - RTM)  
**Autor / Responsable:** CARLOS ALBERTO GUZMAN MONTES  
**Fecha:** 2026-10-01  
**Versión:** 2.0.0  
**Estado:** Cobertura 100% Verificada  

---

## 1. Resumen de Requerimientos y Cobertura

| Requerimiento ID | Descripción del Requerimiento | Tipo | Elemento de Diseño / Código | Unit Test (5.0) | Integration Test (6.0) | SW Validation (7.0) | Estado |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `REQ-F-001` | Creación y aprovisionamiento de Workspaces aislados con códigos únicos | Funcional | `workspaceService.js`, `routes/workspaces.js` | `TC-UT-001` | `TC-IT-001` | `TC-VAL-001` | CUBIERTO |
| `REQ-F-002` | Hoja de ruta estructurada (12 semanas) y seguimiento de avance de tareas | Funcional | `tasks.js`, `Onboarding.tsx`, `TaskList.tsx` | `TC-UT-002` | `TC-IT-008` | `TC-VAL-005` | CUBIERTO |
| `REQ-F-003` | Asistente de IA contextualizado con información y proyectos del equipo | Funcional | `ollamaService.js`, `contextService.js`, `Chat.tsx` | `TC-UT-004` | `TC-IT-004` | `TC-VAL-004` | CUBIERTO |
| `REQ-F-004` | Incorporación ágil de nuevos empleados mediante código de acceso | Funcional | `WorkspaceSetup.tsx`, `workspaces.js`, `AuthContext.tsx` | `TC-UT-001` | `TC-IT-002` | `TC-VAL-002` | CUBIERTO |
| `REQ-F-005` | Panel de control centralizado con métricas globales en tiempo real | Funcional | `dashboard.js`, `Dashboard.tsx`, `useDashboard.ts` | `TC-UT-002` | `TC-IT-003` | `TC-VAL-005` | CUBIERTO |
| `REQ-F-006` | Ingestión y extracción de configuración de equipo desde repositorios GitHub | Funcional | `githubExtractor.js`, `validatorService.js`, `config.js` | `TC-UT-003` | `TC-IT-005` | `TC-VAL-006` | CUBIERTO |
| `REQ-F-007` | Importación y procesamiento de archivos ZIP de configuración de proyecto | Funcional | `fileExtractor.js`, `cleanupService.js`, `FileUploadForm.tsx`| `TC-UT-003` | `TC-IT-006` | `TC-VAL-006` | CUBIERTO |
| `REQ-F-008` | Registro y persistencia del historial cronológico de conversaciones de chat | Funcional | `history.js`, `chat.js`, `chat_messages table` | `TC-UT-004` | `TC-IT-010` | `TC-VAL-004` | CUBIERTO |
| `REQ-F-009` | Directorio interactivo de miembros de equipo con filtros y roles | Funcional | `Team.tsx`, `Header.tsx`, `avatarUtils.ts` | NA | `TC-IT-003` | `TC-VAL-008` | CUBIERTO |
| `REQ-F-010` | Generación y compartición de enlaces directos de invitación al Workspace | Funcional | `Header.tsx`, `workspaces.js`, `invitations table` | `TC-UT-001` | `TC-IT-002` | `TC-VAL-009` | CUBIERTO |
| `REQ-NF-001`| Sanitización y validación estricta de datos de entrada contra inyecciones | No Funcional | `users.js`, `validatorService.js`, `errorHandler.ts` | `TC-UT-003` | `TC-IT-001` | `TC-VAL-001` | CUBIERTO |
| `REQ-NF-002`| Resiliencia y degradación elegante ante indisponibilidad del modelo IA | No Funcional | `ollamaService.js`, `NotificationContainer.tsx` | `TC-UT-005` | `TC-IT-004` | `TC-VAL-007` | CUBIERTO |
| `REQ-NF-003`| Transmisión segura de contexto de sesión mediante headers HTTP dedicados | No Funcional | `api.service.ts`, `server.js`, `AuthContext.tsx` | NA | `TC-IT-007` | `TC-VAL-002` | CUBIERTO |
| `REQ-NF-004`| Aislamiento estricto de datos (*Zero Leakage*) entre distintos inquilinos | No Funcional | `database.js (tenant filter)`, `server.js` | `TC-UT-001` | `TC-IT-009` | `TC-VAL-003` | CUBIERTO |
| `REQ-NF-005`| Control de acceso basado en roles (RBAC) para vistas administrativas | No Funcional | `MainLayout.tsx`, `Sidebar.tsx`, `AuthContext.tsx` | NA | `TC-IT-007` | `TC-VAL-010` | CUBIERTO |

---

## 2. Métricas de Cobertura de Pruebas
- **Total de Requerimientos Evaluados:** 15 (10 Funcionales + 5 No Funcionales)
- **Total de Casos de Prueba Unitarios (5.0):** 5 TCs
- **Total de Casos de Prueba de Integración (6.0):** 10 TCs
- **Total de Casos de Prueba de Validación (7.0):** 10 TCs
- **Porcentaje de Cobertura de Requerimientos:** 100%
- **Campos No Aplicables:** Debidamente documentados con `NA`.
