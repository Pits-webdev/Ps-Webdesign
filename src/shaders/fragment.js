export const fragmentShader = `
   // Wir brauchen nur die Position für den Verlauf
   varying vec3 vPos;

   // Deine zwei Farben aus den Uniforms
   uniform vec3 uColorBottom;
   uniform vec3 uColorTop;

   void main() {
       // 1. KREIS FORMEN (Runde Partikel)
       // Berechnet den Abstand zur Mitte des Punktes
       float d = distance(gl_PointCoord, vec2(0.5));
       
       // Schneidet Ecken ab -> Kreis
       if(d > 0.5) discard; 
       
       // Weicher Rand (Antialiasing für den Kreis)
       float alpha = 1.0 - smoothstep(0.3, 0.5, d);


       // 2. GRADIENT BERECHNEN (Der "Clean Look")
       // Wir nehmen die Höhe (y) und normieren sie auf 0 bis 1.
       // Deine Scene ist ca. 7 Einheiten hoch (-3.5 bis +3.5).
       float gradientMix = (vPos.y + 3.5) / 7.0;
       
       // Begrenzen, damit nichts kaputt geht
       gradientMix = clamp(gradientMix, 0.0, 1.0);

       // 3. FARBE MISCHEN
       vec3 finalColor = mix(uColorBottom, uColorTop, gradientMix);

       // 4. AUSGABE
       // Optional: 'alpha * 0.8' macht die Punkte etwas transparenter/glasiger
       gl_FragColor = vec4(finalColor, alpha);
   }
`;