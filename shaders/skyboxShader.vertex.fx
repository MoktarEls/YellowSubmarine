precision highp float;

attribute vec3 position;
attribute vec2 uv;

varying vec2 vUv;
varying vec3 vDirection;

uniform mat4 worldViewProjection;

void main(void){
    vUv = uv;
    vDirection = normalize(position);
    gl_Position = worldViewProjection * vec4(position, 1.0);

}