import * as THREE from 'three';

export interface GlassShaderUniforms {
  uTintColor: { value: THREE.Color };
  uIntensity: { value: number };
  uHoverFactor: { value: number };
  uTime: { value: number };
  uDisabled: { value: number };
}

export const glassVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const glassFragmentShader = `
  uniform vec3 uTintColor;
  uniform float uIntensity;
  uniform float uHoverFactor;
  uniform float uTime;
  uniform float uDisabled;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  
  void main() {
    vec2 center = vec2(0.5, 0.5);
    float dist = distance(vUv, center);
    
    float glassShape = 1.0 - smoothstep(0.0, 0.95, dist);
    
    if (glassShape < 0.001) {
      discard;
    }
    
    vec3 viewDir = normalize(-vPosition);
    float fresnelFactor = pow(1.0 - max(dot(normalize(vNormal), viewDir), 0.0), 5.0);
    
    // Mild refraction for liquid feel (kept subtle for readability)
    vec2 fromCenter = vUv - center;
    float centerDist = length(fromCenter);
    float lensEffect = smoothstep(0.0, 0.6, centerDist) * 0.02; // small lens strength
    float waveX = sin(vUv.x * 10.0 + uTime * 0.6) * 0.01;
    float waveY = cos(vUv.y * 9.0 + uTime * 0.5) * 0.008;
    vec2 refractionOffset = (fromCenter * lensEffect + vec2(waveX, waveY)) * uIntensity * (0.7 + 0.3 * uHoverFactor);
    
    // Highlights to complement CSS blur
    vec3 glassColor = vec3(0.0);
    vec3 lightDir = normalize(vec3(0.0, 1.0, 0.5));
    vec3 halfVector = normalize(lightDir + viewDir);
    float specular = pow(max(dot(normalize(vNormal), halfVector), 0.0), 900.0);
    glassColor += vec3(specular * 0.25);
    glassColor += vec3(fresnelFactor * 0.08);
    glassColor += mix(vec3(0.0), uTintColor, fresnelFactor * 0.035);
    glassColor += vec3(uHoverFactor * 0.05);
    
    if (uDisabled > 0.5) {
      glassColor *= 0.3;
    }
    
    float refractionStrength = length(refractionOffset) * 6.0;
    float alpha = (fresnelFactor * 0.12 + specular * 0.15 + refractionStrength) * glassShape;
    alpha = clamp(alpha, 0.02, 0.18) * glassShape; // keep subtle
    
    gl_FragColor = vec4(glassColor, alpha);
  }
`;

export const createGlassShaderMaterial = (
  tintColor: THREE.Color,
  intensity: number = 0.6,
  disabled: boolean = false
): THREE.ShaderMaterial => {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTintColor: { value: tintColor },
      uIntensity: { value: intensity },
      uHoverFactor: { value: 0.0 },
      uTime: { value: 0.0 },
      uDisabled: { value: disabled ? 1.0 : 0.0 },
    },
    vertexShader: glassVertexShader,
    fragmentShader: glassFragmentShader,
    transparent: true,
    side: THREE.DoubleSide,
    blending: THREE.NormalBlending,
    depthWrite: false,
  });
};

export const variantTints = {
  default: new THREE.Color(0.98, 0.98, 0.98),
  primary: new THREE.Color(0.95, 0.97, 1.0),
  danger: new THREE.Color(1.0, 0.95, 0.95),
  modal: new THREE.Color(0.96, 0.96, 0.98),
}; 