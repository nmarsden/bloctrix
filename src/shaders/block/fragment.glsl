uniform sampler2D uTexture;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uOpacity;
uniform vec3 uTargetPosition;
uniform float uDistanceThreshold;
uniform float uAlphaFalloff;
uniform vec3 uBorderColor;
uniform float uBorderWidth;
uniform float uBorderSmoothness;

varying vec2 vUv;
varying vec3 vWorldPosition;

void main() {
  // -- Hide when in line with camera & target --
  float alpha = uOpacity;
  
  if (uDistanceThreshold > 0.0) { 
    vec3 toCamera = normalize(cameraPosition - uTargetPosition);
    vec3 toFragment = vWorldPosition - uTargetPosition;

    float projection = dot(toFragment, toCamera);
    vec3 projectedPoint = uTargetPosition + toCamera * projection;
    float distance = length(vWorldPosition - projectedPoint);

    if (distance < uDistanceThreshold) {
        alpha = uOpacity - smoothstep(distance, distance + uAlphaFalloff, uDistanceThreshold);
    }
  }

  // -- Color
  float intensity = texture2D(uTexture, vUv).r;
  vec3 finalColor = mix(uColorA, uColorB, intensity);

  // -- Border: Calculate color according distance to edge --
  float distToEdgeX = min(vUv.x, 1.0 - vUv.x);
  float distToEdgeY = min(vUv.y, 1.0 - vUv.y);
  float distToEdge = min(distToEdgeX, distToEdgeY);

  // Use smoothstep for anti-aliased border
  // uBorderWidth defines the *start* of the border fade
  // uBorderWidth + uBorderSmoothness defines the *end* of the border fade
  float borderMixFactor = smoothstep(uBorderWidth, uBorderWidth + uBorderSmoothness, distToEdge);
  finalColor = mix(uBorderColor, finalColor, borderMixFactor);

  gl_FragColor = vec4(finalColor, alpha);

  #include <colorspace_fragment>
}
