// For Zoneless Angular 21 (Default)
import { setupZonelessTestEnv } from 'jest-preset-angular/setup-env/zoneless/index.mjs';

setupZonelessTestEnv({
  errorOnUnknownElements: true,
  errorOnUnknownProperties: true,
});

// Note: If you still use Zone.js, import from: 
// 'jest-preset-angular/setup-env/zone/index.mjs' and call setupZoneTestEnv()