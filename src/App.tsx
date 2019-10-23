import React from "react";
import Tree from "react-tree-graph";
import "react-tree-graph/dist/style.css";
import "./App.css";

type TreeNode = {
  children: TreeNode[];
  name: any;
  pathProps?: { className: string };
};

const App: React.FC = () => {
  let data;

  function wrap(fn: Function) {
    const st: TreeNode[] = [{ children: [], name: "root" }];
    const cacheHit = () => {
      st[st.length - 1].pathProps = { className: "link red" };
    };

    return function(n: number) {
      const node = { children: [], name: n };
      st[st.length - 1].children.push(node);
      st.push(node);
      const res = fn(n, cacheHit);
      st.pop();
      if (st.length === 1) {
        data = st.pop();
      }
      return res;
    };
  }

  const cache: Record<string, any> = {};
  const fib = wrap(function(n: number, cacheHit: Function) {
    if (cache[n]) {
      cacheHit();
      return cache[n];
    }
    if (n === 1 || n === 2) {
      return 1;
    }
    cache[n] = fib(n - 1) + fib(n - 2);
    return cache[n];
  });
  fib(6);

  return <Tree data={data} nodeRadius={15} height={400} width={400} />;
};

export default App;
