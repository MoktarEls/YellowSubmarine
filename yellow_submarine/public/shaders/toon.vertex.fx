precision highp float;

attribute vec3 position;
attribute vec3 normal;

uniform mat4 world;
uniform mat4 view;
uniform mat4 projection;
uniform vec3 cameraPosition;

varying vec4 vWorldPosition;
varying vec3 vWorldNormal;

void main() {
    vWorldPosition = world * vec4(position, 1.0);
    vWorldNormal = normalize(mat3(world) * normal);

}
