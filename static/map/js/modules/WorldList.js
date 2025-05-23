import { World } from "./util/World.js";
import { P } from './Squaremap.js';

class WorldList {
    constructor(json) {
        // get worlds from json
        const unorderedMap = new Map();
        for (let i = 0; i < json.length; i++) {
            const world = new World(json[i]);
            unorderedMap.set(world.name, world);
        }

        // sort worlds by order
        this.worlds = new Map([...unorderedMap].sort((a, b) => a[1].order - b[1].order));

        // set up world list link elements
        for (const [name, world] of this.worlds) {
            const link = P.createElement("a", name, this);
            link.onclick = function () {
                const curWorld = this.parent.curWorld;
                if (curWorld.name == name) {
                    P.centerOn(world.spawn.x, world.spawn.z, world.zoom.def)
                    return;
                }
                P.playerList.clearPlayerMarkers();
                this.parent.loadWorld(name, (world) => {
                    P.centerOn(world.spawn.x, world.spawn.z, world.zoom.def)
                });
            };

            const img = document.createElement("img");
            img.src = this.getIcon(world);

            link.appendChild(img);
            link.appendChild(P.createTextElement("span", world.display_name));

            P.sidebar.worlds.element.appendChild(link);
        }
    }
    getIcon(world) {
        if (world.icon != null && world.icon != "") {
            return `images/icon/${world.icon}.png`;
        }
        switch (world.type) {
            case "nether":
                return "images/icon/the-nether.png";
            case "the_end":
                return "images/icon/the-end.png";
            case "normal":
            default:
                return "images/icon/overworld.png";
        }
    }
    loadInitialWorld(json, callback) {
        let updateUrl = false
        let name = P.getUrlParam("world", null)
        if (name != null) {
            const world = this.worlds.get(name);
            if (world == null) {
                updateUrl = true
                name = null;
            }
        }
        if (name == null) {
            name = json.worlds.sort((a, b) => a.order - b.order)[0].name
        }
        this.loadWorld(name, (a) => {
            callback(a)
            if (updateUrl) {
                P.updateBrowserUrl(`?world=${this.curWorld.name}`);
            }
        })
    }
    loadWorld(name, callback) {
        // unload current world
        if (this.curWorld != null) {
            this.curWorld.unload();
        }

        // load new world
        const world = this.worlds.get(name);
        this.curWorld = world;
        world.load(callback);
    }
    showWorld(world, callback) {
        if (this.curWorld.name == world) {
            if (callback != null) {
                callback();
            }
            return;
        }
        this.loadWorld(world, callback);
        P.updateBrowserUrl(P.getUrlFromView());
    }
}

export { WorldList };
