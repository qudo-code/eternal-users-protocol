import { type PublicKey } from "@solana/web3.js";
import type { Item } from "./types";
import { sleep } from "./util";

export async function save(data: Item, publicKey: PublicKey) {

}

export async function fetchItems(publicKey: PublicKey): Promise<Item[]> {
    await sleep(2000);
    return [
        {
            id: "1",
            name: "test",
            image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
            id: "2",
            name: "another",
            image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
    ]
}

// Look up user and their items
export async function resolve(publicKey: PublicKey): Promise<{
    user: Item,
    items: Item[]
}> {
    // Look up user
    await sleep(2000);

    const items = await fetchItems(publicKey);

    return {
        user: {
            id: "320dfsagf9e8q98fqh8",
            name: "qudo",
            image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        items
    }
}

export async function addItem(data: Item, publicKey: PublicKey) {
    
}
