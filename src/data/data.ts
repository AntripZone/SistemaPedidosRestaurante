import fs from "node:fs/promises";
import path from "node:path";
import type { pedidos } from "../types/pedidos.js";

export let listaPedidos: pedidos[] = [];

export async function cargarData() {
    try {
        const ruta = path.resolve("src/pedidos.json");
        const data = await fs.readFile(ruta, "utf-8");
        listaPedidos = JSON.parse(data);
        console.log(`Datos cargados`);
    } catch (error) {
        console.log("Lista vacia o no encontrada");
        listaPedidos = [];
    } 
}

export function setListaPedidos(nuevaLista: pedidos[]){
     listaPedidos = nuevaLista;
}   