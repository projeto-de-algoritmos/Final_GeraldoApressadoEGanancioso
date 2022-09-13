<template>
  <q-page class="flex flex-center">
    <div class="container q-mt-sm">
      <canvas class="canvas" ref="canvas">
        <q-tooltip
          v-if="!disableFields && (hasDrawing || startNode || destNode)"
          style="font-size: 12px"
          :delay="1500"
          anchor="top middle"
          self="center middle"
        >
          Clique em qualquer lugar do mapa para desselecionar os nós
        </q-tooltip>
      </canvas>

      <div
        v-for="poi in points_of_interested"
        :key="poi.id"
        class="node poi"
        :style="nodeCss(poi)"
        @click="handleNodeClick(poi)"
        @click.right="(event) => handleRightClick(event, poi)"
      >
        <q-tooltip style="font-size: 12px" v-if="getNodeTooltipMsg(poi.id)">
          {{getNodeTooltipMsg(poi.id)}}
        </q-tooltip>
      </div>

      <div
        v-for="road in roads"
        :key="road.id"
        class="node road"
        :style="nodeCss(road)"
        @click="handleNodeClick(road)"
      >
        <q-tooltip style="font-size: 12px" v-if="getNodeTooltipMsg(road.id)">
          {{getNodeTooltipMsg(road.id)}}
        </q-tooltip>
      </div>
    </div>
  </q-page>
</template>

<style>
.canvas {
  top: 0;
  left: 0;
  position: absolute;
}

.container {
  width: 1280px;
  height: 1024px;
  position: relative;
}

.node {
  position: absolute;
  border-radius: 100%;
}

.node:hover {
  opacity: 0.8;
  cursor: pointer;
}

.road {
  width: 12px;
  height: 12px;
  background-color: #AD1D1A;
}

.poi {
  width: 24px;
  height: 24px;
  opacity: 0.5;
  background-color: #8B969C;
}
</style>

<script>
import { mapGetters, mapActions } from 'vuex';
import { defineComponent } from 'vue';
import { loadMapData } from '../model/load';
import canvasBackground from '../assets/images/white_orchard_clean_map.png';

const POI_COLOR = '#8B969C';
const ROAD_COLOR = '#AD1D1A';
const ARROW_HEAD_LEN = 16;
const CANVAS_TEXT_COLOR = '#FFFFFF';
const LINE_WIDTH = 5;
const LINE_COLOR = '#000000';
const SIGNPOST_LINE_COLOR = 'rgba(0, 255, 106, 0.8)';

export default defineComponent({
  name: 'HomePage',
  created() {
    this.saveMapData(this.fastTravel);
  },
  mounted() {
    const { canvas } = this.$refs;

    canvas.width = this.canvasWidth;
    canvas.height = this.canvasHeight;

    canvas.addEventListener('mousedown', this.handleCanvasClick);

    this.drawBackgroundImage();
  },
  updated() {
    console.log('Nodes: ', this.nodes);
  },
  beforeUnmount() {
    this.$refs.canvas.removeEventListener('mousedown', this.handleCanvasClick);
  },
  data() {
    return {
      roads: [],
      edges: [],
      graph: null,
      destNode: null,
      startNode: null,
      hasDrawing: false,
      canvasWidth: 1280,
      canvasHeight: 1024,
      nodeCorrection: 5,
    };
  },
  watch: {
    showAllEdges(newValue) {
      this.clearDrawnPath(newValue ? this.drawAllEdges : undefined);
    },
    fastTravel(newValue) {
      this.saveMapData(newValue);

      if (this.startNode && this.startNode === this.destNode) {
        this.redraw(this.drawPrim);
      } else {
        this.redraw(() => this.drawPath(this.search()));
      }
    },
    isBfs(newValue) {
      this.redraw(() => this.drawPath(this.search(newValue)));
    },
  },
  computed: mapGetters({
    nodes: 'nodes',
    isBfs: 'isBfs',
    fastTravel: 'fastTravel',
    showAllEdges: 'showAllEdges',
    sleepTime: 'sleepTime',
    disableFields: 'disableFields',
    weightSum: 'weightSum',
  }),
  methods: {
    ...mapActions({
      setDisableFields: 'setDisableFields',
      setWeightSum: 'setWeightSum',
      setNodes: 'setNodes',
    }),
    search(isBfs = this.isBfs) {
      if (isBfs) return this.graph.bfsFromStartToDest(this.startNode, this.destNode);

      return this.graph.dijkstra(this.startNode, this.destNode);
    },
    redraw(callback) {
      if (this.hasDrawing) {
        this.setWeightSum(0);

        this.clearCanvas();

        this.drawBackgroundImage(callback);
      }
    },
    saveMapData(fastTravel) {
      const {
        graph, roads, pois, edges, nodes,
      } = loadMapData(fastTravel);

      this.graph = graph;
      this.roads = roads;
      this.edges = edges;
      this.points_of_interested = pois;

      console.log('before set nodes: ', nodes);

      this.setNodes({ ...nodes });

      console.log(this.nodes.nilfgaardian_garrison);
    },
    drawBackgroundImage(callback = () => true) {
      const { context } = this.getCanvasAndContext();

      const background = new Image();
      background.src = canvasBackground;

      background.onload = () => {
        context.drawImage(background, 0, 0);

        callback();
      };
    },
    drawPath(path) {
      this.hasDrawing = true;

      const nodes = this.graph.getAllNodes();

      for (let i = 0; i < path.length; i += 1) {
        if (!path[i + 1]) break;
        this.drawEdge(nodes[path[i]].node, nodes[path[i + 1]].node);
      }
    },
    drawCanvasText(context, coordinates, text) {
      if (text) {
        context.textAlign = 'center';
        context.fillStyle = CANVAS_TEXT_COLOR;
        context.fillText(text, coordinates.x, coordinates.y, 64);
      }
    },
    drawCanvasLine(context, srcCoord, destCoord, color) {
      context.beginPath();
      context.strokeStyle = color;
      context.lineWidth = LINE_WIDTH;
      context.moveTo(srcCoord.x, srcCoord.y);
      context.lineTo(destCoord.x, destCoord.y);
      context.stroke();
    },
    drawEdge(src, dest, text = null, arrow = false) {
      const bothSignposts = src.getProperties().signpost && dest.getProperties().signpost;

      const drawFunction = arrow ? this.drawArrow : this.drawLine;

      drawFunction(
        src.coordinates,
        dest.coordinates,
        bothSignposts ? SIGNPOST_LINE_COLOR : LINE_COLOR,
        text,
      );
    },
    getLineCenter(srcCoord, destCoord) {
      return { x: (srcCoord.x + destCoord.x) / 2, y: (srcCoord.y + destCoord.y) / 2 };
    },
    drawArrow(srcCoord, destCoord, color = LINE_COLOR, text = null) {
      const { context } = this.getCanvasAndContext();

      const dx = destCoord.x - srcCoord.x;
      const dy = destCoord.y - srcCoord.y;
      const headlen = ARROW_HEAD_LEN;
      const angle = Math.atan2(dy, dx);

      this.drawCanvasLine(context, srcCoord, destCoord, color);

      context.beginPath();
      context.moveTo(
        destCoord.x - headlen * Math.cos(angle - Math.PI / 6),
        destCoord.y - headlen * Math.sin(angle - Math.PI / 6),
      );
      context.lineTo(destCoord.x, destCoord.y);
      context.lineTo(
        destCoord.x - headlen * Math.cos(angle + Math.PI / 6),
        destCoord.y - headlen * Math.sin(angle + Math.PI / 6),
      );
      context.stroke();

      this.drawCanvasText(context, this.getLineCenter(srcCoord, destCoord), text);
    },
    drawLine(srcCoord, destCoord, color = LINE_COLOR, text = null) {
      const { context } = this.getCanvasAndContext();

      this.drawCanvasLine(context, srcCoord, destCoord, color);

      this.drawCanvasText(context, this.getLineCenter(srcCoord, destCoord), text);
    },
    drawAllEdges() {
      this.edges.forEach(({ from, to, cost }) => {
        const nodes = this.graph.getAllNodes();

        this.drawEdge(nodes[from].node, nodes[to].node, cost.toFixed(2));
      });
    },
    clearCanvas() {
      const { context } = this.getCanvasAndContext();

      context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    },
    nodeCss(node) {
      const left = node.coordinates.x - this.nodeCorrection;
      const right = node.coordinates.y - this.nodeCorrection;
      const selected = node.id === this.startNode || node.id === this.destNode;
      const color = selected ? '#027be3' : node.getProperties().road ? ROAD_COLOR : POI_COLOR;

      return `left: ${left}px; top: ${right}px; background-color: ${color}`;
    },
    clearPathNodes() {
      this.destNode = null;
      this.startNode = null;
    },
    clearDrawnPath(drawImgCallback) {
      this.clearPathNodes();
      this.hasDrawing = false;

      this.clearCanvas();
      this.drawBackgroundImage(drawImgCallback);
    },
    handleNodeClick(node) {
      if (this.disableFields || this.showAllEdges) return;

      if (this.startNode && this.destNode) {
        this.clearDrawnPath();
      } else if (!this.startNode) {
        this.startNode = node.id;
      } else if (this.startNode && !this.destNode) {
        this.destNode = node.id;

        if (this.startNode === this.destNode) {
          this.drawPrim();
        } else {
          this.drawPath(this.search());
        }
      }
    },
    handleRightClick(event, node) {
      event.preventDefault();
      event.stopPropagation();

      this.$router.push({ name: 'Node', params: { nodeId: node.id } });
    },
    handleCanvasClick() {
      if (!this.disableFields && (this.startNode || this.destNode)) {
        this.clearDrawnPath();
        this.setWeightSum(0);
      }
    },
    getCanvasAndContext() {
      const { canvas } = this.$refs;
      const context = canvas.getContext('2d');

      return { canvas, context };
    },
    getNodeTooltipMsg(nodeId) {
      if (this.disableFields || this.showAllEdges) return '';

      if (this.startNode === nodeId) return 'Clique mais uma vez para executar o algoritmo de Prim a partir deste nó';

      if (!this.startNode && !this.destNode) return 'Clique para selecionar este nó como início';

      if (this.startNode && !this.destNode && this.startNode !== nodeId) {
        return 'Clique para selecionar este nó como destino';
      }

      return '';
    },
    drawPrim() {
      const edges = this.graph.prim_algorithm(this.startNode);

      this.hasDrawing = true;
      this.setDisableFields(true);

      (async () => {
        // eslint-disable-next-line no-promise-executor-return
        const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        this.setWeightSum(0);
        let weight = 0;
        for (let i = 0; i < edges.length; i += 1) {
          const edge = edges[i];
          weight = this.weightSum + edge.cost;
          this.setWeightSum(Math.round(weight * 100) / 100);
          this.drawEdge(
            this.graph.getNode(edge.from).node,
            this.graph.getNode(edge.to).node,
            null,
            true,
          );
          // eslint-disable-next-line no-await-in-loop
          await sleep(this.sleepTime);
        }
      })()
        .then(() => { this.setDisableFields(false); });
    },
  },
});
</script>
