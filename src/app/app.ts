import { SystemMessageBody } from "../message/types";
import { Command, createCommand } from "../scene/command";
import { Scene, SceneResponsesMap } from "../scene/scene";
import { SceneStep } from "../scene/step";

export interface AppConfig {
    serverPort?: number;
}

export class App {
    private commands: Map<string, Command> = new Map()
    private scenes: Map<string, Scene<any>> = new Map()
    
    constructor(private readonly config?: AppConfig) {}

    addScene<Steps extends readonly SceneStep<any, any>[]>(command: Command, scene: {
        steps: [...Steps];
        handler: (responses: SceneResponsesMap<Steps>) => Promise<SystemMessageBody>;
    }) {
        const cmd = createCommand(command)
        this.commands.set(cmd.value, cmd)
        this.scenes.set(cmd.value, scene)
    }

    start() {}
}

