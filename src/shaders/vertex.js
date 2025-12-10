export const vertexShader = `
      // ------------------------------------------------
      // 1. DEFINITIONEN & UNIFORMS
      // ------------------------------------------------
      uniform float uTime;
      uniform float uProgress;
      
      // Ripple Settings (Plane)
      uniform float uFrequency;
      uniform float uAmplitude;
      uniform float uSpeed;
      uniform float uRotation; 

      uniform float uBoxShiftX;
      uniform float uBoxScale;

      uniform float uPlaneScaleX;

      // Daten für Fragment Shader
      varying vec3 vPos; 
      
      // Attribute von Three.js
      attribute vec3 aBoxPosition; 
      attribute vec3 aSpherePosition;
      attribute float aRandom;
      
      // Helper: Rotations-Matrix
      mat2 rotate2d(float _angle){
          return mat2(cos(_angle),-sin(_angle),
                      sin(_angle),cos(_angle));
      }

      void main() {
        // Wir laden die Start-Positionen in bearbeitbare Variablen
        vec3 posBox    = aBoxPosition;
        vec3 posSphere = aSpherePosition;
        vec3 posPlane  = position;


        // ------------------------------------------------
        // 2. LOGIK: BOX (Der Würfel)
        // ------------------------------------------------
        // Effekt: Einfache Drehung um die eigene Achse

         posBox *= uBoxScale;
        
        float boxRotSpeed = uTime * 0.3;
        posBox.xz = rotate2d(boxRotSpeed) * posBox.xz;

        // B. NEU: Verschiebung nach rechts/links
        // Wir addieren den Wert einfach auf die X-Achse
        posBox.x += uBoxShiftX;

        // ------------------------------------------------
        // 3. LOGIK: SPHERE (Die Kugel)
        // ------------------------------------------------
        // Effekt: Organischer "Wobble" (Wackeln)
         
        float waveY = sin(posSphere.y * 10.0 + uTime * 3.0);
        float waveZ = sin(posSphere.y * 5.0 + uTime * 0.6);
        
        posSphere.y += waveY * 0.2;
        posSphere.z += waveZ * 0.2;
        
        // Kugel dreht sich auch leicht
        posSphere.xz = rotate2d(uTime * 0.2) * posSphere.xz; 


        // ------------------------------------------------
        // 4. LOGIK: PLANE (Die Fläche)
        // ------------------------------------------------
        // Effekt: Wasser-Ripple (Wellen) von der Mitte aus
         // A. NEU: In die Breite ziehen (X-Achse skalieren)
        posPlane.x *= uPlaneScaleX;
        
        float distSquared = posPlane.x * posPlane.x + posPlane.y * posPlane.y;
        
        float ripple = sin(distSquared * uFrequency - uTime * uSpeed) * uAmplitude;

        // Welle auf Z anwenden
        posPlane.z += ripple;
        
        // WICHTIG: Drehung um 90 Grad (Wand -> Boden)
        // Wir tauschen Y und Z, damit die Wellen nach oben zeigen
        //float tempY = posPlane.y; 
        //posPlane.y = posPlane.z;  
        //posPlane.z = -tempY;    
        posPlane.z += ripple;  

        posPlane.yz = rotate2d(uRotation) * posPlane.yz;


        // ------------------------------------------------
        // 5. MORPHING (Der Übergang)
        // ------------------------------------------------
        // Hier entscheiden wir, welche zwei Formen gemischt werden
        
        float phase = floor(uProgress); // 0, 1 oder 2
        float t     = fract(uProgress); // 0.0 bis 0.99...

        vec3 startPos;
        vec3 endPos;
        
        // Reihenfolge: Box -> Sphere -> Plane -> Box
        if (phase < 0.5) { 
            startPos = posBox;
            endPos   = posSphere;
        } else if (phase < 1.5) { 
            startPos = posSphere;
            endPos   = posPlane;
        } else { 
            startPos = posPlane;
            endPos   = posBox; 
        }

        // Weicher Übergang mit Verzögerung durch aRandom
        float localProgress = smoothstep(0.0, 1.0, (t - aRandom * 0.2) / 0.8);
        
        // Der eigentliche Mix
        vec3 morphedPos = mix(startPos, endPos, localProgress);


        // ------------------------------------------------
        // 6. GLOBALE EFFEKTE (Auf alle Formen)
        // ------------------------------------------------
        
        // Effekt A: Implosion (Kleiner werden beim Fliegen)
        float movementArch = sin(localProgress * 3.14159);
        float scale = 1.0 - (movementArch * 0.6); 

        // Effekt B: Noise (Wackeln beim Fliegen)
        morphedPos.x += sin(uTime * 5.0 + aRandom * 10.0) * 0.05 * movementArch;
        morphedPos.y += cos(uTime * 3.0 + aRandom * 10.0) * 0.05 * movementArch;


        // ------------------------------------------------
        // 7. OUTPUT (Das Ergebnis)
        // ------------------------------------------------

        // Position für Fragment Shader speichern (Farbverlauf)
        vPos = morphedPos; 

        // Position auf Bildschirm projizieren
        vec4 mvPosition = modelViewMatrix * vec4(morphedPos, 1.0);
        gl_Position = projectionMatrix * mvPosition;

        // Punktgröße setzen (mit Scale verrechnet)
        gl_PointSize = 35.0 * scale * (1.0 / -mvPosition.z);
      }
`;