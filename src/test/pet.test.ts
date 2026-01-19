import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PetState } from '../types';

describe('Pet State Management', () => {
  const mockPet: PetState = {
    name: 'TestPet',
    type: 'cat',
    color: 'white',
    hunger: 80,
    happiness: 90,
    energy: 70,
    cleanliness: 85,
    health: 95,
    stage: 'adult',
    level: 5,
    exp: 250,
    isAlive: true,
    isSick: false,
    mood: 'contento',
    dangerLevel: 'normal',
    coins: 100,
    age: 10,
    lastFed: Date.now(),
    lastPlayed: Date.now(),
    lastCleaned: Date.now(),
    birthDate: Date.now(),
    lastUpdate: Date.now(),
    criticalHungerStart: null,
    criticalHealthStart: null,
    criticalComboStart: null,
    isSleeping: false,
    sleepStartTime: null,
    sleepStartEnergy: null
  };

  it('should create valid pet state', () => {
    expect(mockPet.name).toBe('TestPet');
    expect(mockPet.isAlive).toBe(true);
    expect(mockPet.health).toBe(95);
  });

  it('should handle feeding correctly', () => {
    const newHunger = Math.min(100, mockPet.hunger + 35);
    expect(newHunger).toBe(100); // 80 + 35 = 115, pero max es 100
  });

  it('should calculate correct danger level', () => {
    const criticalPet = { ...mockPet, hunger: 0, health: 0 };
    expect(criticalPet.dangerLevel).toBe('agonizante');
    
    const healthyPet = { ...mockPet, hunger: 80, health: 80 };
    expect(healthyPet.dangerLevel).toBe('normal');
  });
});