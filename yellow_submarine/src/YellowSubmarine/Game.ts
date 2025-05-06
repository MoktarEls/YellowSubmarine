import {Color3, Engine, Scene, ShaderMaterial, Vector3} from "@babylonjs/core";
import {World} from "@/YellowSubmarine/World";

export class Game {

    private static _world: World;
    private static _worldScene: Scene;
    private static _engine : Engine;


    public static get worldScene(): Scene {
        return this._worldScene;
    }
    public static get engine(): Engine {
        return this._engine;
    }

    public static get world(): World {
        return this._world;
    }

    constructor(canvas: HTMLCanvasElement){
        Game._engine = new Engine(canvas, true);
        Game._worldScene = new Scene(Game.engine)
        Engine.ShadersRepository = "../shaders/";
        Game._world = new World();
        Game._world.initialize();

        const vertexSource = `
        precision highp float;
            attribute vec3 position;
            attribute vec3 normal;
            attribute vec2 uv;
            uniform mat4 world;
            uniform mat4 worldViewProjection;
            varying vec3 vPositionW;
            varying vec3 vNormalW;
            varying vec2 vUV;
            void main(void) {
                vec4 outPosition = worldViewProjection * vec4(position, 1.0);
                gl_Position = outPosition;
                vPositionW = vec3(world * vec4(position, 1.0));
                vNormalW = normalize(vec3(world * vec4(normal, 0.0)));
                vUV = uv;
            }
        `
        const fragmentSource = `
            precision highp float;
            varying vec3 vPositionW;
            varying vec3 vNormalW;
            varying vec2 vUV;
            uniform vec3 vLightPosition;
            uniform vec3 vColor;
            void main(void) {
                float ToonThresholds[2];
                ToonThresholds[0] = 0.8;
                ToonThresholds[1] = 0.2;
                float ToonBrightnessLevels[3];
                ToonBrightnessLevels[0] = 1.0;
                ToonBrightnessLevels[1] = 0.8;
                ToonBrightnessLevels[2] = 0.5;
                vec3 lightVectorW = normalize(vLightPosition - vPositionW);
                float diffuse = max(0.0, dot(vNormalW, lightVectorW));
                vec3 color = vColor;
                if (diffuse > ToonThresholds[0]) {
                color *= ToonBrightnessLevels[0];
                } else if (diffuse > ToonThresholds[1]) {
                color *= ToonBrightnessLevels[1];
                } else {
                color *= ToonBrightnessLevels[2];
                }
                gl_FragColor = vec4(color, 1.0);
            }
        `

        const shader = new ShaderMaterial('shader', Game._worldScene, { vertexSource, fragmentSource }, {
            attributes: ['position', 'normal', 'uv'],
            uniforms: ['world', 'worldView', 'worldViewProjection'],
        })

        shader.setVector3('vLightPosition', Game._world.getSun().getPosition());
        shader.setVector3('vColor', new Vector3(0.5, 0.5, 0.5));

        Game._worldScene.meshes.forEach(mesh => {
            if (!(mesh.name === "sun" || mesh.name === "sunHalo" || mesh.name === "waterPlane")) {
                mesh.material = shader;
                console.log(mesh.name);
                //shader.setTexture('textureSampler', mesh.material.diffuseTexture);
            }
        })

        Game._engine.runRenderLoop(() => {
            Game.worldScene.render();
        })
    }


}