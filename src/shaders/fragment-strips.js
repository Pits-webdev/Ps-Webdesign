
export const fragmentShader = `
   uniform float uTime;
   uniform vec2 uResolution;
   
   varying vec2 vUv;

   // ------------------------------------------------
   // HELFER-FUNKTION: 2D Rotation
   // ------------------------------------------------
   mat2 rotate2d(float _angle){
       return mat2(cos(_angle),-sin(_angle),
                   sin(_angle),cos(_angle));
   }

   void main() {

        vec2 gridPosition = (vUv * 20.0) - (uTime * 0.25);

        float muster = fract(gridPosition.x) * 0.5 + 0.5;

        // Farbe: Rot basierend auf Muster
       vec3 color = vec3(muster * 0.9, 0.0, 0.0);  
       
        // ------------------------------------------------
       // 2. Der Blur-Effekt nach Außen (Die Maske)
       // ------------------------------------------------
       
       // Berechne den Abstand vom aktuellen Pixel zur Mitte (0.5, 0.5)
       //float abstandZurMitte = distance(vUv, vec2(0.5));

        vec2 centeredUv = vUv - 0.5;

        // JETZT DREHEN:
        // Wir drehen die Koordinaten um 45 Grad (ca. 0.785 Radians).
        // Ein Minus davor (-0.785) dreht es von Oben-Links nach Unten-Rechts.
        centeredUv = rotate2d( radians(-20.0) ) * centeredUv;


        centeredUv *= vec2(1.0, 2.8); // oval verändern 1.5

        float abstandZurMitte = length(centeredUv);

       // Definiere, wo es scharf sein soll und wo der Blur aufhört
       // 0.2 = Radius, bis wohin alles voll sichtbar ist (Innerer Kreis)
       // 0.5 = Radius, ab wo alles unsichtbar ist (Äußerer Rand)
       // smoothstep sorgt für den weichen Übergang dazwischen
       float alpha = 1.0 - smoothstep(0.05, 0.5, abstandZurMitte);

        // ------------------------------------------------
       // 3. Ausgabe
       // ------------------------------------------------
       
       // Wir nutzen 'alpha' als 4. Wert.
       // Wenn alpha 1 ist -> volle Farbe.
       // Wenn alpha 0 ist -> komplett durchsichtig.
       gl_FragColor = vec4(color, alpha * 0.9);
   }
`; 