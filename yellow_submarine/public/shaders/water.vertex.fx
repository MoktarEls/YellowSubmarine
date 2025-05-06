precision highp float;

attribute vec3 position;
attribute vec2 uv;
attribute vec3 normal;

uniform mat4 worldViewProjection;
uniform mat4 world;
uniform float time;

varying vec2 vUV;
varying float vWave;
varying vec3 vNormal;

void main() {
    vUV = uv;

    float waveX = sin(position.x * 1.5 + time * 1.0);
    float waveZ = cos(position.z * 1.5 + time * 1.2);
    vWave = (waveX + waveZ) * 0.01;

    vec3 displacedPosition = position + vec3(0.0, vWave, 0.0);

    vNormal = mat3(world) * normal;

    gl_Position = worldViewProjection * vec4(displacedPosition, 1.0);
}
