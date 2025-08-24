varying vec2 vUv;

uniform vec3 uColor;
uniform float uAlphaFactor;
uniform float uProgressOffset;
uniform float uTime;
uniform float uDebug;

void main() {
  float len = 0.15;
  float falloff = 0.1;

  float p = mod(uTime + uProgressOffset, 1.0);
  float alpha = smoothstep(len, len - falloff, abs(vUv.x - p));
  float width = smoothstep(len * 2.0, 0.0, abs(vUv.x - p)) * 0.5;
  alpha *= smoothstep(width, width - 0.3, abs(vUv.y - 0.5));

  alpha *= smoothstep(0.5, 0.3, abs(p - 0.5) * (1.0 + len));

  alpha *= uAlphaFactor;

  gl_FragColor.rgb = uColor;
  gl_FragColor.a = mix(alpha, alpha + 0.1, uDebug);
}