precision highp float;

uniform vec4 depthShallowColor;
uniform vec4 depthDeepColor;
uniform float depthMaximumDistance;

uniform sampler2D linearDepthTexture;
uniform sampler2D surfaceNoiseTexture;
uniform sampler2D surfaceDistortionTexture;
uniform sampler2D cameraNormalTexture;
uniform samplerCube reflectionSampler;

uniform float surfaceNoiseCutoff;
uniform float foamMaxDistance;
uniform float foamMinDistance;
uniform float time;
uniform float surfaceDistortionAmount;

uniform vec2 surfaceNoiseScroll;

varying vec4 vScreenPosition;
varying vec2 vUv;
varying vec2 vNoiseUV;
varying vec2 vDistortUV;
varying vec3 vViewNormal;

varying vec3 vWorldPos;
varying vec3 vWorldNormal;
varying vec3 vCameraPosition;

float remap(float value, float inMin, float inMax, float outMin, float outMax) {
    return outMin + (value - inMin) * (outMax - outMin) / (inMax - inMin);
}

void main(void){
    vec2 screenUv = (vScreenPosition.xy / vScreenPosition.w) * 0.5 + 0.5;
    float existingDepthLinear = texture2D(linearDepthTexture, screenUv).r;
    float depthDifference = existingDepthLinear - vScreenPosition.w;
    float waterDepthDifference01 = clamp( depthDifference / depthMaximumDistance ,0.0, 1.0);
    vec4 waterColor = mix(depthShallowColor, depthDeepColor, waterDepthDifference01);

    vec2 distortSample = (texture2D(surfaceDistortionTexture, vDistortUV).xy * 2.0 - 1.0) * surfaceDistortionAmount;

    vec2 noiseUV = vec2(
        (vNoiseUV.x + time + surfaceNoiseScroll.x) + distortSample.x,
        (vNoiseUV.xy + time + surfaceNoiseScroll.y) + distortSample.y
    );
    float surfaceNoiseSample = texture2D(surfaceNoiseTexture, noiseUV).r;

    vec3 existingNormal = texture2D(cameraNormalTexture, screenUv).rgb;
    vec3 normalDot = vec3(clamp(dot(existingNormal, vViewNormal), 0.0, 1.0));

    float foamDistance = mix(foamMaxDistance, foamMinDistance, normalDot.r);
    float foamDepthDifference01 = clamp(depthDifference / foamDistance, 0.0, 1.0);
    float l_surfaceNoiseCutoff = foamDepthDifference01 * surfaceNoiseCutoff;
    float surfaceNoise = surfaceNoiseSample > l_surfaceNoiseCutoff ? 1.0 : 0.0;

    vec3 viewDir = normalize(vCameraPosition - vWorldPos);
    vec3 reflectDir = reflect(-viewDir, normalize(vWorldNormal));

    vec4 reflectColor = textureCube(reflectionSampler, reflectDir);

    vec4 toonColor = waterColor + surfaceNoise;

    float reflectionNormalDot = 1.0 - abs(dot(vViewNormal, vec3(0.0,0.0,1.0) ) );

    float reflectionFactor = remap(reflectionNormalDot,0.0, 1.0, 0.0, 0.4);

    gl_FragColor = mix(toonColor, reflectColor, reflectionFactor);
}