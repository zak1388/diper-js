class NodeManager {
    static #nodes = [];
    static #selectedType = null;

    static setType(nodeClass) {
        this.#selectedType = nodeClass;
    }

    static verifyNodesDisjointed(newNode) {
        for (let i = 0; i < this.#nodes.length; i++) {
            const node = this.#nodes[i];

            const x = node.x - newNode.x;
            const y = node.y - newNode.y;
            const distance = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
            const intersect = distance < (node.radius + newNode.radius)

            if (intersect) {
                throw new IntersectionError("nodes intersect", newNode, node);
            }
        }
    }

    static addNode(node) {
        if (!node instanceof Node) {
            throw new TypeError("Object is not of type node");
        } 

        this.verifyNodesDisjointed(node);

        this.#nodes.push(node);
    }

    static get selectedType() {
        return this.#selectedType;
    }

    static get nodes() {
        return [...this.#nodes];
    }
}

class IntersectionError extends Error {
    node1;
    node2;

    constructor(message, node1, node2) {
        super(message);
        this.node1 = node1;
        this.node2 = node2;
    }
}

class Node {
    x;
    y;
    transfer_speed;
    radius;
    color;
    effectiveRadius; // this is its area of effect, and it added onto its radius

    constructor(x, y, transfer_speed=1, radius=20, effectiveRadius=80, color="black") {
        if (!x instanceof Number) throw TypeError("x must be a number");
        if (!y instanceof Number) throw TypeError("y must be a number");
        if (!transfer_speed instanceof Number) throw TypeError("transfer_speed must be a number");
        if (!radius instanceof Number) throw TypeError("radius must be a number");
        if (!effectiveRadius instanceof Number) throw TypeError("effectiveRadius must be a number");

        this.x = x;
        this.y = y;
        this.transfer_speed = transfer_speed;
        this.radius = radius;
        this.color = color;
        this.effectiveRadius = effectiveRadius;
    }
}

class CommandNode extends Node {
    constructor(x, y, transfer_speed=1, radius=40, effectiveRadius=80, color="gray") {
        super(x, y, transfer_speed, radius, effectiveRadius, color)
    }
}

class CollectorNode extends Node {
    constructor(x, y, transfer_speed=1, radius=20, effectiveRadius=80, color="green") {
        super(x, y, transfer_speed, radius, effectiveRadius, color)
    }
}

class RelayNode extends Node {
    constructor(x, y, transfer_speed=2, radius=20, effectiveRadius=160, color="lightblue") {
        super(x, y, transfer_speed, radius, effectiveRadius, color)
    }
}


