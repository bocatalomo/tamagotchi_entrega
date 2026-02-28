/**
 * Hook de Auto-Guardado
 * 
 * Guarda automáticamente el estado del tamagotchi en Firestore
 * cada 30 segundos si hay cambios.
 */

import { useEffect, useRef, useCallback } from 'react';
import { PetState, Inventory } from '../types';
import { saveTamagotchi } from '../services/tamagotchiService';

interface UseAutoSaveOptions {
  /** Intervalo de guardado en milisegundos (default: 30000 = 30 segundos) */
  intervalMs?: number;
  /** Callback cuando se guarda exitosamente */
  onSaveSuccess?: () => void;
  /** Callback cuando falla el guardado */
  onSaveError?: (error: Error) => void;
  /** Si está en true, no guarda automáticamente */
  disabled?: boolean;
}

export function useAutoSave(
  pet: PetState,
  inventory: Inventory,
  options: UseAutoSaveOptions = {}
): {
  saveNow: () => Promise<void>;
  isSaving: boolean;
  lastSaveTime: number | null;
} {
  const {
    intervalMs = 30000, // 30 segundos por defecto
    onSaveSuccess,
    onSaveError,
    disabled = false,
  } = options;

  const lastSaveTimeRef = useRef<number | null>(null);
  const lastSavedStateRef = useRef<string | null>(null);
  const isSavingRef = useRef(false);
  const saveIntervalRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Guarda el estado actual en Firestore
   */
  const saveNow = useCallback(async (): Promise<void> => {
    // No guardar si está deshabilitado o ya está guardando
    if (disabled || isSavingRef.current) {
      return;
    }

    // No guardar si el pet no tiene nombre (aún no fue creado)
    if (!pet.name) {
      return;
    }

    // Crear hash del estado actual para detectar cambios
    const currentStateHash = JSON.stringify({
      pet: {
        ...pet,
        lastUpdate: undefined, // Ignorar lastUpdate en comparación
      },
      inventory,
    });

    // No guardar si no hay cambios desde el último guardado
    if (currentStateHash === lastSavedStateRef.current) {
      console.log('⏭️ Auto-save: Sin cambios, omitiendo guardado');
      return;
    }

    try {
      isSavingRef.current = true;
      console.log('💾 Auto-save: Guardando estado en Firestore...');

      const success = await saveTamagotchi(pet, inventory);

      if (success) {
        lastSaveTimeRef.current = Date.now();
        lastSavedStateRef.current = currentStateHash;
        console.log('✅ Auto-save: Estado guardado exitosamente');
        onSaveSuccess?.();
      } else {
        console.warn('⚠️ Auto-save: Guardado falló (sin usuario autenticado)');
      }
    } catch (error) {
      console.error('❌ Auto-save: Error al guardar:', error);
      onSaveError?.(error as Error);
    } finally {
      isSavingRef.current = false;
    }
  }, [pet, inventory, disabled, onSaveSuccess, onSaveError]);

  /**
   * Efecto para guardado automático periódico
   */
  useEffect(() => {
    if (disabled || !pet.name) {
      return;
    }

    // Limpiar intervalo anterior si existe
    if (saveIntervalRef.current) {
      clearInterval(saveIntervalRef.current);
    }

    // Crear nuevo intervalo de guardado
    saveIntervalRef.current = setInterval(() => {
      saveNow();
    }, intervalMs);

    // Limpiar al desmontar
    return () => {
      if (saveIntervalRef.current) {
        clearInterval(saveIntervalRef.current);
        saveIntervalRef.current = null;
      }
    };
  }, [pet.name, disabled, intervalMs, saveNow]);

  /**
   * Guardar cuando el usuario cierra/recarga la página
   */
  useEffect(() => {
    if (disabled || !pet.name) {
      return;
    }

    const handleBeforeUnload = () => {
      // Guardado sincrónico antes de cerrar
      // Nota: Puede no completarse siempre, pero es mejor que nada
      if (!isSavingRef.current) {
        saveNow();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [pet.name, disabled, saveNow]);

  /**
   * Guardar cuando la app pierde el foco (usuario cambia de pestaña)
   */
  useEffect(() => {
    if (disabled || !pet.name) {
      return;
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // App oculta, guardar estado
        console.log('👁️ Auto-save: App oculta, guardando estado...');
        saveNow();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [pet.name, disabled, saveNow]);

  return {
    saveNow,
    isSaving: isSavingRef.current,
    lastSaveTime: lastSaveTimeRef.current,
  };
}

export default useAutoSave;
