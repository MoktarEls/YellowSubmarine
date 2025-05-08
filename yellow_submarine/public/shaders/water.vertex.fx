precision highp float;

attribute vec3 position;
attribute vec2 uv;

uniform mat4 worldViewProjection;

varying vec4 vScreenPosition;
varying vec2 vUv;

void main(void) {
    vScreenPosition = worldViewProjection * vec4(position, 1.0);
    gl_Position = vScreenPosition;
    vUv = uv;
}