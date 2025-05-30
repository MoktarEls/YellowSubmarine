precision highp float;

#define MAX_LIGHTS 6

uniform vec3 cameraPosition;

varying vec4 vWorldPosition;
varying vec3 vWorldNormal;

struct Light{
    float isDirectionalLight;
    vec3 lightPos;
    vec3 lightDir;
    vec3 lightCol;
    float lightIntensity;
}

layout(std140) uniform Lights {
    Light lights[MAX_LIGHTS];
} lights;

void main(void){
    vec3 V = normalize(cameraPosition - vWorldPosition.xyz);
    vec3 N = normalize(vWorldNormal);
    vec3[MAX_LIGHTS] L;
    for (int i = 0; i < MAX_LIGHTS; i++){
        // Calcule des vecteurs directions
    }




}