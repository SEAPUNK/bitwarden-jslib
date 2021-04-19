import { globalShortcut } from "electron";
import { StorageService } from "../../abstractions";
import { ElectronConstants } from "../electronConstants";

export type GlobalShortcuts = {
    [shortcutName: string]: string | undefined;
};

type ShortcutHandler = () => unknown;

export class ElectronGlobalShortcutsService {
    private shortcutHandlers: { [shortcutName: string]: ShortcutHandler } = {};

    constructor(private storageService: StorageService) {}

    async registerShortcuts(globalShortcuts: GlobalShortcuts) {
        globalShortcut.unregisterAll();

        for (let shortcutName of Object.keys(globalShortcuts)) {
            let accelerator = globalShortcuts[shortcutName];
            globalShortcut.register(accelerator, () =>
                this.handleShortcut(shortcutName)
            );
        }

        await this.storageService.save(
            ElectronConstants.globalShortcuts,
            globalShortcuts
        );
    }

    assignShortcut(shortcut: string, handler: ShortcutHandler) {
        this.shortcutHandlers[shortcut] = handler;
    }

    private handleShortcut(shortcut: string) {
        let handler = this.shortcutHandlers[shortcut];
        if (handler != null) handler();
    }
}
