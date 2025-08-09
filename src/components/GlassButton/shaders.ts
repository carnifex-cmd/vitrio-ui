export const refractionVertexShader = `
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

export const refractionFragmentShader = `
  uniform sampler2D uBackgroundTexture;
  uniform vec3 uTintColor;
  uniform float uIntensity;
  uniform float uHoverFactor;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform float uDisabled;
  
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  
  // Generate glass normal map for refraction distortion
  vec3 generateGlassNormal(vec2 uv, float time, float hoverIntensity) {
    // Create curved glass surface using radial distance
    vec2 center = vec2(0.5, 0.5);
    float dist = distance(uv, center);
    
    // Base curvature - stronger at edges
    float curvature = smoothstep(0.0, 0.5, dist) * 0.3;
    
    // Add subtle time-based ripples for living glass effect
    float ripple = sin(dist * 20.0 - time * 2.0) * 0.02 * (1.0 - dist);
    
    // Enhance curvature on hover
    float hoverCurvature = hoverIntensity * 0.15 * (1.0 - dist * dist);
    
    // Calculate normal distortion
    float nx = (uv.x - center.x) * (curvature + ripple + hoverCurvature);
    float ny = (uv.y - center.y) * (curvature + ripple + hoverCurvature);
    
    return normalize(vec3(nx, ny, 1.0));
  }
  
  // Fresnel effect for realistic glass reflectance
  float fresnel(vec3 normal, vec3 viewDir, float power) {
    float facing = dot(normal, viewDir);
    return pow(1.0 - facing, power);
  }
  
  // Generate specular highlights
  vec3 calculateSpecular(vec3 normal, vec3 viewDir, vec3 lightDir, float shininess) {
    vec3 halfVector = normalize(lightDir + viewDir);
    float specularIntensity = pow(max(dot(normal, halfVector), 0.0), shininess);
    return vec3(specularIntensity);
  }
  
  void main() {
    vec2 screenUv = gl_FragCoord.xy / uResolution;
    
    // Generate glass surface normal with curvature
    vec3 glassNormal = generateGlassNormal(vUv, uTime, uHoverFactor);
    
    // Calculate refraction displacement
    float refractionStrength = uIntensity * (1.0 + uHoverFactor * 0.3);
    vec2 refractionOffset = glassNormal.xy * refractionStrength * 0.05;
    
    // Sample background with refraction distortion
    vec2 distortedUv = screenUv + refractionOffset;
    distortedUv = clamp(distortedUv, 0.0, 1.0); // Prevent edge artifacts
    vec4 refractiveSample = texture2D(uBackgroundTexture, distortedUv);
    
    // View direction for fresnel and specular
    vec3 viewDir = normalize(-vPosition);
    
    // Calculate fresnel for edge brightness
    float fresnelFactor = fresnel(glassNormal, viewDir, 2.0);
    
    // Multiple light directions for realistic specular highlights
    vec3 lightDir1 = normalize(vec3(0.5, 1.0, 0.5));
    vec3 lightDir2 = normalize(vec3(-0.3, 0.8, 0.6));
    
    vec3 specular1 = calculateSpecular(glassNormal, viewDir, lightDir1, 64.0);
    vec3 specular2 = calculateSpecular(glassNormal, viewDir, lightDir2, 32.0) * 0.5;
    vec3 totalSpecular = specular1 + specular2;
    
    // Glass tint with variant-specific coloring
    vec3 glassTint = mix(vec3(1.0), uTintColor, 0.15);
    
    // Combine refracted background with glass properties
    vec3 refractionColor = refractiveSample.rgb * glassTint;
    
    // Add fresnel-based rim lighting
    vec3 rimLight = vec3(1.0) * fresnelFactor * 0.4;
    
    // Combine all lighting components
    vec3 finalColor = refractionColor + rimLight + totalSpecular * 0.6;
    
    // Glass transparency with fresnel variation
    float glassAlpha = 0.85 + fresnelFactor * 0.15;
    
    // Hover effect enhances brightness and specular
    finalColor += vec3(uHoverFactor * 0.1);
    
    // Disabled state desaturates and dims
    if (uDisabled > 0.5) {
      float gray = dot(finalColor, vec3(0.299, 0.587, 0.114));
      finalColor = mix(finalColor, vec3(gray), 0.6) * 0.6;
      glassAlpha *= 0.7;
    }
    
    gl_FragColor = vec4(finalColor, glassAlpha);
  }
`; 