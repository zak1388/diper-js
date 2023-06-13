const CANVAS = document.querySelector("canvas");
const EFFECTIVE_DISTANCE_CHECKBOX = document.querySelector("#effective-distance-checkbox");

function changeCanvasSize() {
    CANVAS.height = CANVAS.clientHeight;
    CANVAS.width = CANVAS.clientWidth;

    redrawCanvas();
}

function generateNodeSelectors() {
    const nodeDiv = document.querySelector("#node-type-div");

    const nodeClasses = [CommandNode, RelayNode, CollectorNode];

    nodeClasses.forEach((nodeClass) => {
        const selectorDiv = document.createElement("div");

        const radioButton = document.createElement("input");
        radioButton.type = "radio";
        radioButton.addEventListener("input", () => NodeManager.setType(nodeClass));
        radioButton.name = "nodeType";
        selectorDiv.appendChild(radioButton);

        const buttonLabel = document.createElement("label");
        buttonLabel.textContent = nodeClass.name;
        selectorDiv.appendChild(buttonLabel);

        nodeDiv.appendChild(selectorDiv);
    });
}

function redrawCanvas() {
    const context = CANVAS.getContext("2d");

    context.reset();

    NodeManager.nodes.forEach((node) => {
        context.fillStyle = node.color;
        context.beginPath();
        context.ellipse(node.x, node.y, node.radius, node.radius, 0, 0, 2 * Math.PI);
        context.fill();

        if (EFFECTIVE_DISTANCE_CHECKBOX.checked) {
            context.fillStyle = node.color;
            context.globalAlpha = 0.2;
            context.ellipse(node.x, node.y, node.radius + node.effectiveRadius, node.radius + node.effectiveRadius, 0, 0, 2 * Math.PI);
            context.fill();
            context.globalAlpha = 1;
        }
    });
}

function handleCanvasClicked(clickEvent) {
    if (NodeManager.selectedType == null)
        return;

    const node = new (NodeManager.selectedType)(clickEvent.x, clickEvent.y);
    try {
        NodeManager.addNode(node);
    } catch (err) {
        if (err instanceof IntersectionError) {
            // TODO: alert user that they cant place a node there
        }
        else throw err;
    }

    redrawCanvas();
}

function main() {
    // I wanted the canvas to update its 'internal' size, when the actual canvas size changes
    window.addEventListener("resize", changeCanvasSize);
    changeCanvasSize();

    generateNodeSelectors();

    EFFECTIVE_DISTANCE_CHECKBOX.addEventListener("change", redrawCanvas);
    CANVAS.addEventListener("click", handleCanvasClicked);
}

main();
