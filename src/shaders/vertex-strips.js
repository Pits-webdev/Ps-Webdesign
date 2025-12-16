export const vertexShader = `
      // ------------------------------------------------
      // UNIFORMS
      // ------------------------------------------------

      uniform float uTime;
      uniform vec2 uResolution;

      // ------------------------------------------------
      // Daten für Fragment Shader
      // ------------------------------------------------

      varying vec2 vUv; 

      void main() {
        
        vUv = uv; 
        
       gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

       
      }
`;