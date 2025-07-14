uniform vec3 uColor;
uniform float uOpacity;
uniform vec3 uTargetPosition;
uniform float uDistanceThreshold;
uniform float uAlphaFalloff;

varying vec3 vWorldPosition;

void main() {
  vec3 toCamera = normalize(cameraPosition - uTargetPosition);
  vec3 toFragment = vWorldPosition - uTargetPosition;

  float projection = dot(toFragment, toCamera);
  vec3 projectedPoint = uTargetPosition + toCamera * projection;
  float distance = length(vWorldPosition - projectedPoint);

  float alpha = uOpacity;
  if (distance < uDistanceThreshold) {
    alpha = uOpacity - smoothstep(distance, distance + uAlphaFalloff, uDistanceThreshold);
  }

  gl_FragColor = vec4(uColor, alpha);
}
