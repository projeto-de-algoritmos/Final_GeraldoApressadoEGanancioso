<template>
  <q-page class="flex flex-center">
    <KnapsackModal ref="knapsackModal" :items="knapsackItems" />

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
        <q-tooltip style="font-size: 12px; white-space: pre-line" v-if="getNodeTooltipMsg(poi)">
          {{getNodeTooltipMsg(poi)}}
        </q-tooltip>
      </div>

      <div
        v-for="road in roads"
        :key="road.id"
        class="node road"
        :style="nodeCss(road)"
        @click="handleNodeClick(road)"
      >
        <q-tooltip style="font-size: 12px; white-space: pre-line" v-if="getNodeTooltipMsg(road)">
          {{getNodeTooltipMsg(road)}}
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
import { knapsack } from '../model/knapsack';
import { populateItems } from '../model/populate';
import KnapsackModal from '../components/KnapsackModal';
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
  components: {
    KnapsackModal,
  },
  created() {
    this.saveMapData(this.fastTravel);
    populateItems();
  },
  mounted() {
    const { canvas } = this.$refs;

    canvas.width = this.canvasWidth;
    canvas.height = this.canvasHeight;

    canvas.addEventListener('mousedown', this.handleCanvasClick);

    this.drawBackgroundImage();
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
      randomItems: [],
      knapsackItems: [],
    };
  },
  watch: {
    fastTravel(newValue) {
      this.saveMapData(newValue);

      this.redraw(() => this.drawPath(this.search()));
    },
  },
  computed: mapGetters({
    nodes: 'nodes',
    fastTravel: 'fastTravel',
    disableFields: 'disableFields',
    knapsackCapacity: 'knapsackCapacity',
  }),
  methods: {
    ...mapActions({
      setDisableFields: 'setDisableFields',
      setNodes: 'setNodes',
    }),
    search() {
      return this.graph.dijkstra(this.startNode, this.destNode);
    },
    redraw(callback) {
      if (this.hasDrawing) {
        this.clearCanvas();

        this.drawBackgroundImage(callback);
      }

      this.knapsackItems = [];
    },
    saveMapData(fastTravel) {
      const {
        graph, roads, pois, edges, nodes, randomItems,
      } = loadMapData(fastTravel);

      this.graph = graph;
      this.roads = roads;
      this.edges = edges;
      this.points_of_interested = pois;
      this.randomItems = randomItems;

      this.setNodes({ ...nodes });
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

        const currentNode = nodes[path[i]].node;
        let tempBag = [];

        if (currentNode.getProperties().road && currentNode.items.length === 0) {
          const item = this.randomItems[Math.floor(Math.random() * this.randomItems.length)];

          tempBag = [...this.knapsackItems, item];
        } else {
          tempBag = [...this.knapsackItems, ...currentNode.items];
        }

        this.knapsackItems = knapsack(tempBag, this.knapsackCapacity);

        this.drawEdge(currentNode, nodes[path[i + 1]].node);
      }

      this.$refs.knapsackModal.open();
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

      this.knapsackItems = [];
      this.$refs.knapsackModal.close();

      this.clearCanvas();
      this.drawBackgroundImage(drawImgCallback);
    },
    handleNodeClick(node) {
      if (this.disableFields) return;

      if (this.startNode && this.destNode) {
        this.clearDrawnPath();
      } else if (!this.startNode) {
        this.startNode = node.id;
      } else if (this.startNode && !this.destNode) {
        this.destNode = node.id;

        this.drawPath(this.search());
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
      }
    },
    getCanvasAndContext() {
      const { canvas } = this.$refs;
      const context = canvas.getContext('2d');

      return { canvas, context };
    },
    getNodeTooltipMsg(node) {
      const isRoad = node.getProperties().road;

      if (this.disableFields) return '';

      if (!this.startNode && !this.destNode) return `Clique com o esquerdo para selecionar este nó como início${isRoad ? '' : '\n\nClique com direito para gerenciar os itens'}`;

      if (this.startNode && !this.destNode && this.startNode !== node.id) {
        return 'Clique para selecionar este nó como destino';
      }

      return '';
    },
  },
});
</script>
