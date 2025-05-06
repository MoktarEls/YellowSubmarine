precision highp float;

uniform float time;
uniform sampler2D noiseTexture;
uniform vec3 lightDirection; // doit être normalisé
uniform vec3 lightColor;
uniform vec3 ambientColor;

varying vec2 vUV;
varying float vWave;
varying vec3 vNormal;

void main() {

    vec2 scrollUV = vUV + vec2(time * 0.03, time * 0.015);
    float noise = texture2D(noiseTexture, scrollUV).r;

    vec3 shallow = vec3(0.3, 0.8, 1.0);
    vec3 deep = vec3(0.0, 0.4, 0.8);

    float factor = vUV.y + vWave * 0.5 + noise * 0.1;
    vec3 baseColor = mix(shallow, deep, factor);

    float diffuse = max(dot(normalize(vNormal), normalize(lightDirection)), 0.0);
    vec3 color = baseColor * (ambientColor + lightColor * diffuse);

    float alpha = 0.9;

    gl_FragColor = vec4(color, alpha);
}
