precision highp float;

uniform samplerCube daySkyboxTexture;
uniform samplerCube nightSkyboxTexture;
uniform float timeOfTheDay;

varying vec2 vUv;
varying vec3 vDirection;

float adjustableSmoothstep(float x, float k) {
    float t = x - 0.5;
        float exponent = mix(1.0, 0.0, k); // k ∈ [0, 1]
        return 0.5 + sign(t) * pow(abs(2.0 * t), exponent) * 0.5;
}

void main(void){
    float shiftedtime = timeOfTheDay + 0.25;
    if(shiftedtime > 1.0){
        shiftedtime -= 1.0;
    }
    float nightFactor = abs(0.5 - shiftedtime) * 2.0;

    float easedFactor = adjustableSmoothstep(nightFactor, 0.5);

    vec4 dayColor = textureCube(daySkyboxTexture, vDirection);
    vec4 nightColor = textureCube(nightSkyboxTexture, vDirection);


    gl_FragColor = mix(dayColor, nightColor, easedFactor);

}