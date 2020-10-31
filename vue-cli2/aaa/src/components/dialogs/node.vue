<template>
    <div class="node">
        <div class="node-img" :class="[data.node_executor]"></div>
        <div class="node-content">
            <div class="node-name">{{data.node_executor=='play'?data.process_name:data.node_name}}</div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        data: {
            type: Object
        }
    }
}
</script>

<style scoped>
.node{
    width: 45px;
    height: 45px;
}
.node-img{
    width: 100%;
    height: 100%;
}
.node-content{
    width: 100%;
    height: 100%;
    position: absolute;
    left: 100%;
    top: 0;
    font-size: 12px;
    padding-left: 10px;
}
.node-name{
    white-space: nowrap;
    overflow: hidden;
}
</style>