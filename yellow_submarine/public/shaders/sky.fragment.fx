#version 300 es
#define WEBGL2

precision highp float;

uniform vec3 sunDirection;
uniform vec3 dayTopColor;
uniform vec3 dayBottomColor;
uniform vec3 sunsetColor;
uniform float horizonPower;
uniform float sunElevation;
uniform vec3 nightColor;

out vec4 glFragColor;

in vec3 vDirection;

void main(void) {
    float viewY = clamp(vDirection.y, -1.0, 1.0);
    float t = (viewY + 1.0) / 2.0;

    // Dégradés jour et nuit
    vec3 gradientDay = mix(dayBottomColor, dayTopColor, t);
    vec3 gradientSunset = mix(sunsetColor, dayTopColor, t);
    vec3 gradientNight = nightColor;

    float horizon = abs(viewY);
    vec3 skyColor = mix(gradientSunset, gradientDay, smoothstep(0.0, horizonPower, horizon));

    // Influence du coucher/lever du soleil
    float sunsetIntensity = 1.0 - clamp(sunElevation * 4.0, 0.0, 1.0); // Plus progressif
    skyColor = mix(skyColor, sunsetColor, sunsetIntensity * 0.3); // Plus subtil

    // Transition vers la nuit
    float nightFactor = clamp(-sunElevation * 3.0, 0.0, 1.0); // Passe à 1 quand le soleil est bien sous l'horizon
    vec3 finalColor = mix(skyColor, gradientNight, nightFactor);

    glFragColor = vec4(finalColor, 1.0);
}

