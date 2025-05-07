precision highp float;

// Attributes
attribute vec3 position;
attribute vec2 uv;

// Uniforms
uniform mat4 worldViewProjection;
uniform float time;

// Varying
varying vec3 vPosition;
varying vec4 vClipSpace;

void main(void) {
    float scale = 1.0;
    // calc new position
    float newY = (sin(position.x * 1.0 / scale + time * 1.0));
    // new model position
    vec3 newPositionM = vec3(position.x, newY, position.z);
    gl_Position = worldViewProjection * vec4(newPositionM, 1.0);
    // grab vertex position in world space
    vPosition = position;
    // grab vertex position in view space
    vClipSpace = gl_Position;
}
