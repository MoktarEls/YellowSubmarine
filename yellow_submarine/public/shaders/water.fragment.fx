precision highp float;

uniform float time;
uniform sampler2D noiseTexture;

varying vec2 vUV;
varying float vWave;

void main() {
    // Ajoute un petit scrolling de bruit pour la couleur
    vec2 scrollUV = vUV + vec2(time * 0.03, time * 0.015);
    float noise = texture2D(noiseTexture, scrollUV).r;

    // Couleurs cartoon d'eau claire à foncée
    vec3 shallow = vec3(0.3, 0.8, 1.0);  // turquoise clair
    vec3 deep = vec3(0.0, 0.4, 0.8);     // bleu profond

    float factor = vUV.y + vWave * 0.5 + noise * 0.1;
    vec3 color = mix(shallow, deep, factor);

    gl_FragColor = vec4(color, 1.0);
}
