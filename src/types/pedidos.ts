interface pedidos {
    id: number;
    clienteId: number;
    fecha: string;
    estado: string;
    total: number;
}

interface crearPedido{
    clienteId: number;
    total: number;
}

interface actualizarPedido{
    estado: string;
}

interface pedidosFiltrados{
    clienteId?: number;
    estado?: string;
    fecha?: string;
    total?: number;
}

interface idParam {
    id: string;
}
export type{
    pedidos,
    crearPedido,
    actualizarPedido,
    pedidosFiltrados,
    idParam
};