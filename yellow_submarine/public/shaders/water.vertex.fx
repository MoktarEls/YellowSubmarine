precision highp float;

attribute vec3 position;
attribute vec2 uv;

uniform mat4 worldViewProjection;
uniform float time;

varying vec2 vUV;
varying float vWave;

void main() {
    vUV = uv;

    float waveX = sin(position.x * 1.5 + time * 1.0);
    float waveZ = cos(position.z * 1.5 + time * 1.2);
    vWave = (waveX + waveZ) * 0.01;

    gl_Position = worldViewProjection * vec4(position.x, position.y + vWave, position.z, 1.0);
}
