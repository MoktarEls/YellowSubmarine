precision highp float;

attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

uniform mat4 world;
uniform mat4 view;
uniform mat4 projection;

uniform vec4 surfaceNoiseST;
uniform vec4 surfaceDistortionST;

varying vec4 vScreenPosition;
varying vec2 vUv;
varying vec2 vNoiseUV;
varying vec2 vDistortUV;
varying vec3 vViewNormal;

void main(void){
    vScreenPosition = projection * view * world * vec4(position,1.0);
    vUv = uv;
    vNoiseUV = vUv * surfaceNoiseST.xy + surfaceNoiseST.zw;
    vDistortUV = vUv * surfaceDistortionST.xy + surfaceDistortionST.zw;

    mat3 normalMatrix = transpose(inverse(mat3(world)));
    vec3 worldNormal = normalize(normalMatrix * normal);
    vViewNormal = normalize(view * vec4(worldNormal, 0.0)).xyz;

    gl_Position = vScreenPosition;
}