import CirclesAnalysis from '@circles/analysis';

CirclesAnalysis.setConfiguration({
  endpoint: `${process.env.GRAPH_NODE_EXTERNAL}/subgraphs/name/${process.env.SUBGRAPH_NAME}`,
  safeAddress: process.env.SAFE_ADDRESS,
});

let data = {};

export function setAnalysisData(newData) {
  data = newData;
}

export function getAnalysisData() {
  return data;
}

export default CirclesAnalysis;
