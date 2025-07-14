uniform vec3 uColor;
uniform float uOpacity;
uniform vec3 uTargetPosition;
uniform float uFadeInnerWidth;
uniform float uFadeOuterWidth;
uniform vec3 uBorderColor;
uniform float uBorderWidth;

varying vec2 vUv;
varying vec3 vWorldPosition;

void main() {
  // -- Hide when in line with camera & target --
  // 2D points in the XZ plane
  vec2 P = vWorldPosition.xz; // Now taking XZ components
  vec2 A = cameraPosition.xz;
  vec2 B = uTargetPosition.xz;

  // Vector representing the line (from A to B)
  vec2 AB = B - A;
  float lineLengthSq = dot(AB, AB); // Squared length of AB

  float perpendicularDistance;

  // Handle the case where camera and target are at the same XZ point (line has zero length)
  if (lineLengthSq < 0.0001) { // If A and B are very close in the XZ plane
      // If line is a point, calculate distance to that point
      perpendicularDistance = length(P - A);
  } else {
      // Vector from A to P
      vec2 AP = P - A;

      // Calculate perpendicular distance from P to the line AB in the XZ plane
      // Formula: |(AP_x * AB_z) - (AP_x * AB_y)| / length(AB)
      // Here, AP.x refers to AP's x-component, and AP.y refers to AP's z-component in our vec2(x,z) space
      perpendicularDistance = abs(AP.x * AB.y - AP.y * AB.x) / sqrt(lineLengthSq);
  }

  // Use smoothstep to control the alpha based on perpendicular distance.
  // We want transparency (alpha 0) when distance is small (inside fadeInnerWidth)
  // and opacity (alpha 1) when distance is large (beyond fadeOuterWidth).
  float alpha = uOpacity * smoothstep(uFadeInnerWidth, uFadeOuterWidth, perpendicularDistance);

  // -- Border: Calculate color according distance to edge --
  float distToEdgeX = min(vUv.x, 1.0 - vUv.x);
  float distToEdgeY = min(vUv.y, 1.0 - vUv.y);
  float distToEdge = min(distToEdgeX, distToEdgeY);
  vec3 finalColor = uColor;
  if (distToEdge < uBorderWidth) {
      finalColor = uBorderColor;
  }

  gl_FragColor = vec4(finalColor, alpha);
}
