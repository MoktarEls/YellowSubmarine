precision highp float;

uniform sampler2D reflexion;
uniform vec2 screensize;

varying vec2 vScreenUv;

void main(void) {
        gl_FragColor = 0.5 + 0.5 * texture(reflexion, gl_FragCoord.xy/screensize);
}