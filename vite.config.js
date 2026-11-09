import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        chemicalBonding: 'chemical-bonding.html',
        neutralizationExothermic: 'neutralization-exothermic.html',
        titration: 'titration.html',
        saltQuiz: 'salt-page.html',
        hotGuidingSaltPrepReactingMass: 'HOT_guiding_saltprep_reactingmass.html',
        insolubleLayer: 'insoluble-layer.html',
        electronDiagram: 'electron-diagram.html',
        ionForge: 'ion-forge.html',
        collisionTheory: 'collision-theory.html',
        rateReactionWithSyringe: 'rate-reaction-with-syringe.html',
      },
    },
  },
});
