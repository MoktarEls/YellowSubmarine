precision highp float;

attribute vec3 position;
attribute vec2 uv;
attribute vec3 normal;

uniform mat4 world;
uniform mat4 view;
uniform mat4 projection;

uniform sampler2D surfaceNoise;
uniform vec4 surfaceNoiseST;
uniform sampler2D surfaceDistortion;
uniform vec4 surfaceDistortionST;

varying vec4 vVertex;
varying vec2 vNoiseUV;
varying vec2 vDistortUV;
varying vec4 vScreenPosition;
varying vec3 vViewNormal;
varying vec2 vUv;


vec4 computeScreenPos(vec4 clipPos) {
    // 1) On applique la même première étape que ComputeNonStereoScreenPos
    //    o = clipPos * 0.5f
    vec4 o = clipPos * 0.5;

    // 2) On remappe XY pour passer de [-w,w] à [0,w]
    //    o.xy = o.xy + clipPos.w
    o.xy += clipPos.w;

    // 3) On conserve zw pour l'échantillonnage projectif
    o.zw = clipPos.zw;

    return o;
}

vec2 transform_tex(vec2 uvs, vec4 st){
    return uvs * st.xy + st.zw;
}

void main(void) {
    vUv = uv;
    vVertex = projection * view * world * vec4(position, 1.0);
    vScreenPosition = computeScreenPos(vVertex);
//     vScreenPosition = vVertex;
    vDistortUV = transform_tex(uv, surfaceDistortionST);
    vNoiseUV = transform_tex(uv, surfaceNoiseST);

    mat3 normalMatrix = transpose(inverse(mat3(world)));
    vec3 worldNormal = normalize(normalMatrix * normal);
    vec3 viewNormal = normalize(view * vec4(worldNormal, 0.0)).xyz;
    vViewNormal = viewNormal;

    gl_Position = vVertex;
}