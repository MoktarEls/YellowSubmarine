precision highp float;

uniform vec4 depthShallowColor;
uniform vec4 depthDeepColor;
uniform float depthMaximumDistance;

uniform sampler2D linearDepthTexture;
uniform sampler2D surfaceNoiseTexture;
uniform sampler2D surfaceDistortionTexture;
uniform sampler2D cameraNormalTexture;
uniform sampler2D reflectionTexture;
uniform float timeOfTheDay;

uniform float surfaceNoiseCutoff;
uniform float foamMaxDistance;
uniform float foamMinDistance;
uniform float time;
uniform float surfaceDistortionAmount;

uniform vec2 surfaceNoiseScroll;
uniform vec2 screensize;

varying vec4 vScreenPosition;
varying vec2 vUv;
varying vec2 vNoiseUV;
varying vec2 vDistortUV;
varying vec3 vViewNormal;
varying vec3 vCameraWorldPosition;

varying vec3 vWorldPos;
varying vec3 vWorldNormal;

float remap(float value, float inMin, float inMax, float outMin, float outMax) {
    return outMin + (value - inMin) * (outMax - outMin) / (inMax - inMin);
}

float adjustableSmoothstep(float x, float k) {
    float t = x - 0.5;
        float exponent = mix(1.0, 0.0, k); // k ∈ [0, 1]
        return 0.5 + sign(t) * pow(abs(2.0 * t), exponent) * 0.5;
}

void main(void){
    vec3 viewDir = normalize(vCameraWorldPosition - vWorldPos);
    vec2 screenUv = (vScreenPosition.xy / vScreenPosition.w) * 0.5 + 0.5;

    vec2 waveUVOffset = texture2D(surfaceDistortionTexture, (gl_FragCoord.xy / screensize) + 8.0 * time).xy * 2.0 - 1.0;

    float waveUVOffsetAmount = 0.02;

    float existingDepthLinear = texture2D(linearDepthTexture, (gl_FragCoord.xy / screensize) ).r;
    float depthDifference = existingDepthLinear - vScreenPosition.w;
    float waterDepthDifference01 = clamp( depthDifference / depthMaximumDistance ,0.0, 1.0);
    vec4 waterColor = mix(depthShallowColor, depthDeepColor, waterDepthDifference01);

    vec2 distortSample = (texture2D(surfaceDistortionTexture, vDistortUV).xy * 2.0 - 1.0) * surfaceDistortionAmount;

    vec2 noiseUV = vec2(
        (vNoiseUV.x + time + surfaceNoiseScroll.x) + distortSample.x,
        (vNoiseUV.y + time + surfaceNoiseScroll.y) + distortSample.y
    );
    float surfaceNoiseSample = texture2D(surfaceNoiseTexture, noiseUV).r;

    vec3 existingNormal = texture2D(cameraNormalTexture, screenUv).rgb;
    vec3 normalDot = vec3(clamp(dot(existingNormal, vViewNormal), 0.0, 1.0));

    float foamDistance = mix(foamMaxDistance, foamMinDistance, normalDot.r);
    float foamDepthDifference01 = clamp(depthDifference / foamDistance, 0.0, 1.0);
    float l_surfaceNoiseCutoff = foamDepthDifference01 * surfaceNoiseCutoff;
    float surfaceNoise = surfaceNoiseSample > l_surfaceNoiseCutoff ? 1.0 : 0.0;

    vec4 reflectionColor = texture2D(reflectionTexture, (gl_FragCoord.xy / screensize) + ( waveUVOffset * waveUVOffsetAmount ) );

    gl_FragColor = mix(waterColor, reflectionColor, 0.75) + surfaceNoise;


}