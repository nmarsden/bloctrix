uniform vec3 uColor;
uniform float uOpacity;
uniform vec3 uTargetPosition;
uniform float uDistanceThreshold;
uniform float uAlphaFalloff;
uniform vec3 uBorderColor;
uniform float uBorderWidth;

varying vec2 vUv;
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

  float distToEdgeX = min(vUv.x, 1.0 - vUv.x);
  float distToEdgeY = min(vUv.y, 1.0 - vUv.y);
  float distToEdge = min(distToEdgeX, distToEdgeY);

  if (distToEdge < uBorderWidth) {
      gl_FragColor = vec4(uBorderColor, alpha);
  } else {
      gl_FragColor = vec4(uColor, alpha);
  }
}
