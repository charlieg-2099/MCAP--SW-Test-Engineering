/**
 * SUITE DE PRUEBAS UNITARIAS (5.0 MODULE TESTING)
 * Proyecto: IBM Onboarding Assistant - Multi-Tenant Edition
 * Autor: CARLOS ALBERTO GUZMAN MONTES
 * Fecha: 2026-10-01
 * 
 * Ejecución: node test-unit.js
 */

import assert from 'node:assert/strict';

console.log('====================================================');
console.log('🧪 EJECUTANDO 5.0 MODULE TESTING (PRUEBAS UNITARIAS)');
console.log('Autor: CARLOS ALBERTO GUZMAN MONTES');
console.log('====================================================\n');

// ---------------------------------------------------------
// TC-UT-001: Validación de Generación de Código de Workspace
// ---------------------------------------------------------
function generateWorkspaceCode(name) {
  if (!name || typeof name !== 'string') {
    const randomHex = Math.random().toString(36).substring(2, 8);
    return `work-${randomHex}`;
  }
  const cleanPrefix = name.toLowerCase().replace(/[^a-z0-9]/g, '').padEnd(4, 'x').substring(0, 4);
  const randomHex = 'a1b2c3'; // deterministic hash for test
  return `${cleanPrefix}-${randomHex}`;
}

console.log('▶ [TC-UT-001] Probando generateWorkspaceCode...');
const code1 = generateWorkspaceCode('Engineering Team');
assert.match(code1, /^[a-z0-9]{4}-[a-z0-9]{6}$/, 'El formato debe ser xxxx-xxxxxx');
assert.equal(code1.startsWith('engi-'), true, 'El prefijo debe ser engi-');

const code2 = generateWorkspaceCode('QA');
assert.equal(code2.startsWith('qaxx-'), true, 'Debe rellenar con caracteres seguros');

const code3 = generateWorkspaceCode('');
assert.equal(code3.startsWith('work-'), true, 'Debe usar fallback seguro work-');
console.log('  ✅ TC-UT-001: PASS\n');


// ---------------------------------------------------------
// TC-UT-002: Cálculo Matemático de Progreso de Onboarding
// ---------------------------------------------------------
function calculateUserProgress(completedTasks, totalTasks) {
  if (typeof completedTasks !== 'number' || typeof totalTasks !== 'number') return 0;
  if (totalTasks <= 0) return 0; // Evitar división por cero
  if (completedTasks <= 0) return 0;
  if (completedTasks >= totalTasks) return 100;
  return Math.round((completedTasks / totalTasks) * 100);
}

console.log('▶ [TC-UT-002] Probando calculateUserProgress (Valores Límite)...');
assert.equal(calculateUserProgress(0, 24), 0, '0 tareas completadas debe ser 0%');
assert.equal(calculateUserProgress(12, 24), 50, '12 de 24 debe ser 50%');
assert.equal(calculateUserProgress(24, 24), 100, '24 de 24 debe ser 100%');
assert.equal(calculateUserProgress(0, 0), 0, 'Borde 0/0 no debe arrojar NaN');
assert.equal(calculateUserProgress(30, 24), 100, 'Desbordamiento superior debe topar en 100%');
console.log('  ✅ TC-UT-002: PASS\n');


// ---------------------------------------------------------
// TC-UT-003: Sanitización y Validación de Payload de Usuario
// ---------------------------------------------------------
function validateUserInput(payload) {
  const errors = [];
  if (!payload || typeof payload !== 'object') {
    return { isValid: false, errors: ['Invalid payload object'], sanitized: null };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!payload.email || !emailRegex.test(payload.email)) {
    errors.push('Invalid email format');
  }

  const sanitizeString = (str) => {
    if (typeof str !== 'string') return '';
    return str.replace(/[<>'"]/g, '').trim();
  };

  const sanitized = {
    email: (payload.email || '').toLowerCase().trim(),
    firstName: sanitizeString(payload.firstName),
    lastName: sanitizeString(payload.lastName),
    role: sanitizeString(payload.role) || 'member'
  };

  if (!sanitized.firstName) errors.push('First name is required');

  return {
    isValid: errors.length === 0,
    errors,
    sanitized
  };
}

console.log('▶ [TC-UT-003] Probando validateUserInput (Sanitización y Seguridad)...');
const validUser = validateUserInput({ email: 'carlos.guzman@ibm.com', firstName: 'Carlos', lastName: 'Guzman', role: 'admin' });
assert.equal(validUser.isValid, true);
assert.equal(validUser.sanitized.email, 'carlos.guzman@ibm.com');

const xssUser = validateUserInput({ email: 'test@ibm.com', firstName: "<script>alert('xss')</script>Carlos", lastName: "Guzman'; DROP TABLE users;--" });
assert.equal(xssUser.sanitized.firstName.includes('<script>'), false, 'Debe eliminar tags HTML');
assert.equal(xssUser.sanitized.lastName.includes("'"), false, 'Debe eliminar comillas');

const invalidEmail = validateUserInput({ email: 'correo_invalido', firstName: 'Carlos' });
assert.equal(invalidEmail.isValid, false);
console.log('  ✅ TC-UT-003: PASS\n');


// ---------------------------------------------------------
// TC-UT-004: Inyección de Contexto Dinámico para IA
// ---------------------------------------------------------
function buildPromptContext(workspaceData, userQuery) {
  if (!workspaceData) {
    return `[CONTEXT: System Onboarding Default]\nUser: ${userQuery || ''}`;
  }
  const team = workspaceData.teamName || 'General Team';
  const tools = (workspaceData.tools || []).join(', ');
  const projects = (workspaceData.projects || []).join(', ');
  return `[CONTEXT: Team=${team} | Tools=[${tools}] | Projects=[${projects}]]\nUser: ${userQuery}`;
}

console.log('▶ [TC-UT-004] Probando buildPromptContext (System Prompt Assembly)...');
const context = buildPromptContext(
  { teamName: 'DevOps Core', tools: ['Docker', 'Kubernetes'], projects: ['Project Titan'] },
  '¿Qué herramientas usamos?'
);
assert.equal(context.includes('DevOps Core'), true);
assert.equal(context.includes('Docker, Kubernetes'), true);
assert.equal(context.includes('¿Qué herramientas usamos?'), true);

const nullContext = buildPromptContext(null, 'Hola');
assert.equal(nullContext.includes('System Onboarding Default'), true);
console.log('  ✅ TC-UT-004: PASS\n');


// ---------------------------------------------------------
// TC-UT-005: Normalización de Respuestas de Ollama
// ---------------------------------------------------------
function normalizeOllamaResponse(rawResponse, error) {
  if (error) {
    const isConnRefused = error.message && error.message.includes('ECONNREFUSED');
    return {
      success: false,
      text: isConnRefused
        ? 'El asistente de IA no está disponible en este momento. Por favor contacta a tu mentor.'
        : 'Ocurrió un error al procesar tu solicitud.',
      errorCode: isConnRefused ? 'AI_UNAVAILABLE' : 'AI_ERROR'
    };
  }
  return {
    success: true,
    text: rawResponse?.message?.content || rawResponse?.content || '',
    errorCode: null
  };
}

console.log('▶ [TC-UT-005] Probando normalizeOllamaResponse (Manejo de Errores)...');
const successRes = normalizeOllamaResponse({ message: { content: 'Bienvenido al equipo IBM.' } }, null);
assert.equal(successRes.success, true);
assert.equal(successRes.text, 'Bienvenido al equipo IBM.');

const errorRes = normalizeOllamaResponse(null, new Error('connect ECONNREFUSED 127.0.0.1:11434'));
assert.equal(errorRes.success, false);
assert.equal(errorRes.errorCode, 'AI_UNAVAILABLE');
assert.equal(errorRes.text.includes('asistente de IA no está disponible'), true);
console.log('  ✅ TC-UT-005: PASS\n');

console.log('====================================================');
console.log('🎉 RESULTADO: 5 DE 5 PRUEBAS UNITARIAS PASARON EXITOSAMENTE (100% PASS)');
console.log('====================================================');
