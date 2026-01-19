import { useState, useEffect, useCallback, useRef } from 'react';
import { Poop } from '../types';

export const usePetSleep = () => {
  const [isSleeping, setIsSleeping] = useState(false);
  const sleepTimeoutRef = useRef<number | null>(null);
  const sleepIntervalRef = useRef<number | null>(null);
  const sleepStartEnergyRef = useRef(0);
  const sleepStartTimeRef = useRef(0);

  const startSleep = useCallback((currentEnergy: number, setPet: any) => {
    if (isSleeping) return;

    const sleepStart = Date.now();
    sleepStartEnergyRef.current = currentEnergy;
    sleepStartTimeRef.current = sleepStart;

    setIsSleeping(true);

    setPet(prev => ({
      ...prev,
      isSleeping: true,
      sleepStartTime: sleepStart,
      sleepStartEnergy: currentEnergy
    }));

    // Limpiar intervals anteriores
    if (sleepTimeoutRef.current) {
      clearTimeout(sleepTimeoutRef.current);
    }
    if (sleepIntervalRef.current) {
      clearInterval(sleepIntervalRef.current);
    }

    // Recuperación gradual de energía
    const totalSleepTime = 300000; // 5 minutos
    const updateInterval = 1000;

    sleepIntervalRef.current = window.setInterval(() => {
      const timeSlept = Date.now() - sleepStartTimeRef.current;
      const sleepProgress = Math.min(timeSlept / totalSleepTime, 1);
      const energyToRecover = 100 - sleepStartEnergyRef.current;
      const newEnergy = Math.min(100, sleepStartEnergyRef.current + (energyToRecover * sleepProgress));

      setPet(prev => ({ ...prev, energy: newEnergy }));
    }, updateInterval);

    // Completar recuperación
    sleepTimeoutRef.current = window.setTimeout(() => {
      if (sleepIntervalRef.current) {
        clearInterval(sleepIntervalRef.current);
        sleepIntervalRef.current = null;
      }

      setPet(prev => ({
        ...prev,
        energy: 100,
        happiness: Math.min(100, prev.happiness + 10)
      }));

      sleepTimeoutRef.current = null;
    }, totalSleepTime);
  }, [isSleeping]);

  const wakeUp = useCallback((setPet: any) => {
    if (sleepTimeoutRef.current) {
      clearTimeout(sleepTimeoutRef.current);
      sleepTimeoutRef.current = null;
    }
    if (sleepIntervalRef.current) {
      clearInterval(sleepIntervalRef.current);
      sleepIntervalRef.current = null;
    }

    if (isSleeping) {
      setIsSleeping(false);

      setPet(prev => ({
        ...prev,
        isSleeping: false,
        sleepStartTime: null,
        sleepStartEnergy: null
      }));
    }
  }, [isSleeping]);

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      if (sleepTimeoutRef.current) {
        clearTimeout(sleepTimeoutRef.current);
      }
      if (sleepIntervalRef.current) {
        clearInterval(sleepIntervalRef.current);
      }
    };
  }, []);

  return {
    isSleeping,
    startSleep,
    wakeUp
  };
};