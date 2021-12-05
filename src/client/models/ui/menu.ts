import { Submenu } from "./submenu";
import { MenuManager } from "../../managers/ui/menu";

export class Menu {
    public name: string;
    public resource: string;
    public position: string;
    public manager: MenuManager;
    public handle: string;

    constructor(menuName: string, menuResource: string, menuPosition: string = "top-left") {
        this.name = menuName;
        this.resource = menuResource;
        if (menuPosition) {
            this.position = menuPosition;
        }
        this.manager = new MenuManager();
        this.handle = this.manager.AddMenu(menuName, menuResource, menuPosition);
    }

    // Methods
    public async IsAnyMenuOpen(): Promise<boolean> {
        return this.manager.IsAnyMenuOpen();
    }

    public async Open(): Promise<void> {
        this.manager.OpenMenu(this.handle);
    }

    public async Close(): Promise<void> {
        this.manager.CloseMenu();
    }

    public async BindSubmenu(menuName: string): Promise<Submenu> {
        const newHandle = this.manager.AddSubmenu(menuName, this.handle, this.resource, this.position)
        return new Submenu(menuName, this.resource, newHandle, this.position);
    }

    public async BindButton(menuName: string, callback: any): Promise<string> {
        return this.manager.AddButton(menuName, this.handle, callback, this.resource);
    }

    public async BindCheckbox(menuName: string, checkState: boolean, callback: any): Promise<string> {
        return this.manager.AddCheckbox(menuName, this.handle, checkState, callback, this.resource)
    }

    public async BindList(menuName: string, menuList: Record<number, any>, callback: any): Promise<string> {
        return this.manager.AddList(menuName, this.handle, menuList, callback, this.resource);
    }

    public async Clear(): Promise<void> {
        this.manager.ClearMenu(this.handle);
    }
}