import { test } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'fs';

test('Diagnóstico completo de Super Slot Machine', async ({ page }) => {
  test.setTimeout(90000);
  console.log('\n🔍 INICIANDO DIAGNÓSTICO AUTOMATIZADO...\n');

  mkdirSync('diagnostic-screenshots', { recursive: true });

  await page.addInitScript(() => {
    const now = Date.now();
    const pet = {
      name: 'Pixel',
      type: 'cat',
      color: 'white',
      hunger: 80,
      happiness: 80,
      energy: 80,
      cleanliness: 90,
      health: 90,
      stage: 'baby',
      level: 1,
      exp: 0,
      isAlive: true,
      isSick: false,
      mood: 'contento',
      dangerLevel: 'normal',
      coins: 50,
      age: 0,
      lastFed: now,
      lastPlayed: now,
      lastCleaned: now,
      birthDate: now,
      lastUpdate: now,
      criticalHungerStart: null,
      criticalHealthStart: null,
      criticalComboStart: null,
      isSleeping: false,
      sleepStartTime: null,
      sleepStartEnergy: null,
    };
    const inventory = {
      food: 5,
      medicine: 2,
      treats: 1,
      soap: 3,
    };

    localStorage.setItem('tamagotchiPet', JSON.stringify(pet));
    localStorage.setItem('tamagotchiInventory', JSON.stringify(inventory));
    localStorage.setItem('tamagotchi_has_seen_hatch', 'true');
  });

  // 1. Navegar a la aplicación
  console.log('📍 Paso 1: Navegando a la aplicación');
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  
  // Screenshot inicial
  await page.screenshot({ path: 'diagnostic-screenshots/01-home.png', fullPage: true });
  console.log('✅ Screenshot de home guardado');

  const loginButton = page.getByRole('button', { name: /iniciar sesión/i });
  if (await loginButton.isVisible({ timeout: 2000 })) {
    console.log('⚠️  Login requerido. No se puede acceder a minijuegos sin autenticar.');
    await page.screenshot({ path: 'diagnostic-screenshots/01-login.png', fullPage: true });
    const loginHTML = await page.content();
    writeFileSync('diagnostic-screenshots/login-page.html', loginHTML);
    writeFileSync('diagnostic-screenshots/final-diagnosis.json', JSON.stringify({
      status: 'auth-required',
      message: 'Login requerido para continuar el diagnóstico.'
    }, null, 2));
    return;
  }

  // 2. Verificar qué versión de la app está cargada
  const appVersion = await page.evaluate(() => {
    return {
      hasResultPanel: !!document.querySelector('.result-panel'),
      hasSlotMachineV2CSS: Array.from(document.styleSheets).some(sheet => {
        try {
          return Array.from(sheet.cssRules).some(rule => 
            rule.cssText?.includes('result-panel')
          );
        } catch (e) {
          return false;
        }
      }),
      loadedScripts: Array.from(document.scripts).map(s => s.src),
      loadedStyles: Array.from(document.styleSheets).map(s => s.href),
    };
  });

  console.log('\n📊 ANÁLISIS DE VERSIÓN:');
  console.log('  - result-panel en DOM:', appVersion.hasResultPanel ? '✅ SÍ' : '❌ NO');
  console.log('  - result-panel en CSS:', appVersion.hasSlotMachineV2CSS ? '✅ SÍ' : '❌ NO');
  
  // Guardar información detallada
  writeFileSync('diagnostic-screenshots/version-info.json', JSON.stringify(appVersion, null, 2));

  // 3. Intentar navegar al juego
  console.log('\n📍 Paso 2: Buscando botón de Minijuegos...');
  const playButton = page.getByRole('button', { name: /jugar/i });
  await playButton.scrollIntoViewIfNeeded();
  await playButton.click({ force: true });
  await page.getByText(/mini-juegos/i).waitFor({ timeout: 5000 });
  await page.screenshot({ path: 'diagnostic-screenshots/02-minigames.png', fullPage: true });

  // 4. Buscar Super Slot Machine
  console.log('\n📍 Paso 3: Buscando Super Slot Machine...');
  await page.getByRole('button', { name: /super slot machine/i }).click();
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'diagnostic-screenshots/03-slot-machine-screen.png', fullPage: true });

  // 5. Analizar el componente de Slot Machine cargado
  console.log('\n📊 ANÁLISIS DEL COMPONENTE SLOT MACHINE:');
  
  const slotMachineAnalysis = await page.evaluate(() => {
    return {
      // Elementos clave de SlotMachineV2
      hasResultPanel: !!document.querySelector('.result-panel'),
      hasResultContent: !!document.querySelector('.result-content'),
      hasReelsWrapper: !!document.querySelector('.reels-wrapper'),
      hasSlotMachineV2Class: !!document.querySelector('.slot-machine-v2'),
      hasSlotMachineFrame: !!document.querySelector('.slot-machine-frame'),
      
      // Elementos de la versión antigua
      hasOldSlotMachine: !!document.querySelector('.slot-machine-wrapper'),
      
      // Clases CSS detectadas
      allClasses: Array.from(document.querySelectorAll('[class*="slot"]')).map(el => el.className),
      
      // Contenido del DOM relevante
      resultPanelHTML: document.querySelector('.result-panel')?.innerHTML || 'NO ENCONTRADO',
      reelsHTML: document.querySelector('.reels-wrapper')?.outerHTML?.substring(0, 500) || 'NO ENCONTRADO',
    };
  });

  console.log('  - .result-panel:', slotMachineAnalysis.hasResultPanel ? '✅ SÍ' : '❌ NO');
  console.log('  - .result-content:', slotMachineAnalysis.hasResultContent ? '✅ SÍ' : '❌ NO');
  console.log('  - .slot-machine-v2:', slotMachineAnalysis.hasSlotMachineV2Class ? '✅ SÍ' : '❌ NO');
  console.log('  - .slot-machine-wrapper (viejo):', slotMachineAnalysis.hasOldSlotMachine ? '⚠️  SÍ (PROBLEMA)' : '✅ NO');
  
  writeFileSync('diagnostic-screenshots/slot-analysis.json', JSON.stringify(slotMachineAnalysis, null, 2));

  // 6. Intentar hacer una tirada si es posible
  console.log('\n📍 Paso 4: Intentando hacer una tirada...');
  
  const spinButtonOptions = [
    'text=GIRAR',
    '.spin-button',
    'button:has-text("GIRAR")',
    'button:has-text("Girar")',
  ];

  let spinClicked = false;
  for (const selector of spinButtonOptions) {
    try {
      const button = await page.locator(selector).first();
      if (await button.isVisible({ timeout: 1000 })) {
        console.log(`  ✅ Botón GIRAR encontrado: ${selector}`);
        await button.click();
        await page.waitForTimeout(6000); // Esperar a que termine el giro
        spinClicked = true;
        break;
      }
    } catch (e) {
      console.log(`  ⏭️  Botón no encontrado: ${selector}`);
    }
  }

  if (spinClicked) {
    await page.screenshot({ path: 'diagnostic-screenshots/04-after-spin.png', fullPage: true });
    
    // Analizar resultado después del giro
    const afterSpinAnalysis = await page.evaluate(() => {
      return {
        resultPanelVisible: !!document.querySelector('.result-panel'),
        resultContent: document.querySelector('.result-content')?.textContent || 'NO ENCONTRADO',
        resultAmount: document.querySelector('.result-amount')?.textContent || 'NO ENCONTRADO',
        hasWinningSymbols: !!document.querySelector('.reel-symbol.winning'),
      };
    });
    
    console.log('\n📊 ANÁLISIS POST-GIRO:');
    console.log('  - Panel de resultados visible:', afterSpinAnalysis.resultPanelVisible ? '✅ SÍ' : '❌ NO');
    console.log('  - Contenido resultado:', afterSpinAnalysis.resultContent);
    console.log('  - Cantidad:', afterSpinAnalysis.resultAmount);
    console.log('  - Símbolos ganadores resaltados:', afterSpinAnalysis.hasWinningSymbols ? '✅ SÍ' : '❌ NO');
    
    writeFileSync('diagnostic-screenshots/after-spin-analysis.json', JSON.stringify(afterSpinAnalysis, null, 2));
  }

  // 7. Capturar HTML completo para análisis
  const fullHTML = await page.content();
  writeFileSync('diagnostic-screenshots/full-page.html', fullHTML);

  // 8. Resumen final
  console.log('\n' + '='.repeat(60));
  console.log('📋 RESUMEN DEL DIAGNÓSTICO');
  console.log('='.repeat(60));
  
  const diagnosis = {
    version: slotMachineAnalysis.hasSlotMachineV2Class ? 'SlotMachineV2 ✅' : 
             slotMachineAnalysis.hasOldSlotMachine ? 'SlotMachine OLD ❌' : 'DESCONOCIDO ⚠️',
    hasNewFeatures: {
      resultPanel: slotMachineAnalysis.hasResultPanel,
      resultContent: slotMachineAnalysis.hasResultContent,
    },
    recommendation: !slotMachineAnalysis.hasResultPanel ? 
      'PROBLEMA: SlotMachineV2 no está cargando correctamente' :
      'TODO OK: SlotMachineV2 está funcionando'
  };

  console.log('\n🔍 Versión detectada:', diagnosis.version);
  console.log('📊 Características nuevas:');
  console.log('   - Panel de resultados:', diagnosis.hasNewFeatures.resultPanel ? '✅' : '❌');
  console.log('   - Contenido de resultados:', diagnosis.hasNewFeatures.resultContent ? '✅' : '❌');
  console.log('\n💡 Recomendación:', diagnosis.recommendation);
  console.log('\n📸 Screenshots guardados en: diagnostic-screenshots/');
  console.log('📄 Análisis JSON guardados en: diagnostic-screenshots/*.json');
  console.log('='.repeat(60) + '\n');

  writeFileSync('diagnostic-screenshots/final-diagnosis.json', JSON.stringify(diagnosis, null, 2));
});
