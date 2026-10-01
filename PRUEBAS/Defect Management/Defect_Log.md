# REGISTRO DE DEFECTOS Y CONTROL DE CALIDAD / DEFECT LOG

**Proyecto:** IBM Onboarding Assistant - Multi-Tenant Edition  
**Autor / Tester:** CARLOS ALBERTO GUZMAN MONTES  
**Fecha:** 2026-10-01  
**Versión del Software:** 2.0.0  
**Estado:** Todos los defectos identificados han sido resueltos y verificados  

---

## 1. Tabla de Registro de Defectos (Defect Logs)

| Project/Task | Found Date | ID | Testing Level | Testing Method | Removed from SW? | Counter | Issue Description |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| IBM Onboarding - Workspace | 2026-09-28 | `DEF-001` | 5.0 Module Testing | White Box (Unit Test) | Yes | 1 | La función `generateWorkspaceCode` no manejaba adecuadamente cadenas con caracteres especiales o espacios al inicio, provocando códigos de formato irregular. Corregido con regex sanitizer. |
| IBM Onboarding - Tasks Progress | 2026-09-29 | `DEF-002` | 5.0 Module Testing | Boundary Analysis | Yes | 2 | La función de cálculo de progreso arrojaba `NaN` cuando el total de tareas era 0 (nuevo roadmap sin tareas creadas). Se agregó validación de división por cero retornando 0%. |
| IBM Onboarding - File Ingestion | 2026-09-29 | `DEF-003` | 6.0 Integration Testing | Integration Test | Yes | 3 | Los archivos temporales subidos mediante archivos ZIP (`.zip`) no se eliminaban si el proceso de extracción fallaba por formato no reconocido. Se integró `cleanupService` en bloque `finally`. |
| IBM Onboarding - Multi-Tenant Filter| 2026-09-30 | `DEF-004` | 6.0 Integration Testing | Security / Data Isolation | Yes | 4 | En peticiones concurrentes, el header `X-Workspace-Id` ausente realizaba un fallback que consultaba el primer workspace de la base de datos en lugar de rechazar con HTTP 400 Bad Request. |
| IBM Onboarding - Chat UI | 2026-09-30 | `DEF-005` | 7.0 SW Validation | Black Box (E2E) | Yes | 5 | Al desconectar el servicio local de Ollama, el componente React del Chat mostraba pantalla en blanco por unhandled exception. Se implementó `ErrorBoundary` y mensaje amigable de degradación elegante. |
| IBM Onboarding - Setup Access | 2026-10-01 | `DEF-006` | 7.0 SW Validation | Black Box (RBAC Security) | Yes | 6 | Los usuarios con rol de `member` podían visualizar momentáneamente el menú de configuración al refrescar la pantalla antes de la hidratación del `AuthContext`. Resuelto con guardias de ruta en cliente. |
| NA | NA | `NA` | NA | NA | NA | NA | NA |
| NA | NA | `NA` | NA | NA | NA | NA | NA |
| NA | NA | `NA` | NA | NA | NA | NA | NA |
| NA | NA | `NA` | NA | NA | NA | NA | NA |

---

## 2. Resumen Estadístico de Calidad
- **Total de Defectos Identificados:** 6
- **Defectos Críticos:** 0
- **Defectos Altos:** 2 (DEF-004, DEF-005)
- **Defectos Medios/Bajos:** 4 (DEF-001, DEF-002, DEF-003, DEF-006)
- **Defectos Resueltos y Removidos (Removed from SW):** 6 (100%)
- **Tasa de Cierre de Defectos:** 100%
- **Celdas no aplicables:** Llenadas estrictamente con `NA`.
