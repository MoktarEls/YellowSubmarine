precision highp float;

attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

uniform mat4 world;
uniform mat4 view;
uniform mat4 projection;

varying vec4 vScreenPosition;

void main(void){
    vScreenPosition = projection * view * world * vec4(position,1.0);
    gl_Position = vScreenPosition;
}