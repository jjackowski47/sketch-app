<template>
    <div id="canvas-div">
        <canvas class="sketch-canvas" id="canvas"></canvas>
    </div>
</template>

<script>
export default {

};
</script>

<style>
    #canvas-div {
        flex-grow: 1;
        padding: 2%;
    }

    .sketch-canvas {
        width: 80vw;
        background-color: #EDF5E1;
        border: 2px solid #05386B;
        border-radius: 5px;
    }
</style>
