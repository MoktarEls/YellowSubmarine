precision highp float;

uniform vec4 depthGradientShallow;
uniform vec4 depthGradientDeep;
uniform vec4 foamColor;

uniform float depthMaxDistance;
uniform float foamMaximumDistance;
uniform float foamMinimumDistance;
uniform float surfaceNoiseCutoff;
uniform float surfaceDistortionAmount;

uniform vec2 surfaceNoiseScroll;

uniform sampler2D cameraDepthTexture;
uniform sampler2D cameraNormalsTexture;

uniform float uCameraNear;
uniform float uCameraFar;

varying vec4 vVertex;
varying vec2 vNoiseUV;
varying vec2 vDistortUV;
varying vec4 vScreenPosition;
varying vec3 vViewNormal;
varying vec2 vUv;

vec4 alphaBlend(vec4 top, vec4 bottom)
{
    vec3 color = (top.rgb * top.a) + (bottom.rgb * (1.0 - top.a));
    float alpha = top.a + bottom.a * (1.0 - top.a);

    return vec4(color, alpha);
}

vec4 UNITY_PROJ_COORD_GLSL(vec4 clipPos) {
    return clipPos;
}

vec4 tex2Dproj_GLSL(sampler2D samp, vec4 projCoord) {
    vec2 uv = projCoord.xy / projCoord.w;
    return texture2D(samp, uv * 0.5 + 0.5);
}

float LinearEyeDepth(float depth01, float near, float far) {
    return (near * far) / (far - depth01 * (far - near));
}

void main(void) {
    vec2 screenUv = ( vScreenPosition.xy / vScreenPosition.w ) * 0.5 + 0.5;
    float existingDepth01 = texture2D(cameraDepthTexture, screenUv).r;

    float existingDepthLinear = LinearEyeDepth(existingDepth01, uCameraNear, uCameraFar);

    float depthDifference = existingDepthLinear - vScreenPosition.w;

    gl_FragColor = vec4(vec3(existingDepth01),1.0);

}