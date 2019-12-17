import React, { useState } from "react";
import Tree from "react-tree-graph";
import "react-tree-graph/dist/style.css";
import "./App.css";

type TreeNode = {
  children: TreeNode[];
  name: any;
  id: number;
  pathProps?: { className: string };
  textProps?: { x: number; y: number };
};

const gid = (function() {
  let id = 0;
  return function() {
    return id++;
  };
})();

const App: React.FC = () => {
  const [code, setCode] = useState(
    "if (x == 1 || x == 2) {\n  return x;\n}\nreturn fib(x - 1) + fib(x - 2);\n"
  );
  const [x, setArg] = useState("");
  const [root, setRoot] = useState(
    () => ({ children: [], name: "root", id: gid() } as TreeNode)
  );
  const [frameId, setFrameId] = useState(0);

  function wrap(fn: Function) {
    const st: TreeNode[] = [{ children: [], name: "root", id: gid() }];
    const cacheHit = () => {
      st[st.length - 1].pathProps = { className: "link red" };
    };

    return function(n: number) {
      const node = {
        children: [],
        name: n,
        id: gid(),
        textProps: { x: -24, y: -24 }
      };
      st[st.length - 1].children.push(node);
      st.push(node);
      const res = fn(n, cacheHit);
      st.pop();
      if (st.length === 1) {
        setRoot(st.pop() as TreeNode);
      }
      return res;
    };
  }

  function run() {
    // @ts-ignore
    global.fib = wrap(new Function("x", "cacheHit", code));
    // @ts-ignore
    global.fib(Number(x));
  }

  return (
    <div className="app-wrapper">
      <form
        className="form"
        onSubmit={e => {
          run();
          setFrameId(frameId + 1);
          e.preventDefault();
        }}
      >
        <fieldset className="form-row">
          <textarea
            placeholder="function body"
            className="form-code"
            value={code}
            cols={100}
            rows={10}
            onChange={e => setCode(e.target.value)}
          />
        </fieldset>
        <fieldset className="form-row">
          <input
            placeholder="argument"
            className="form-arg"
            type="text"
            value={x}
            onChange={e => setArg(e.target.value)}
          />
        </fieldset>
        <button type="submit">Go!</button>
      </form>
      <div className="tree-wrapper">
        {root.children.length > 0 && (
          <Tree
            keyProp="id"
            key={frameId}
            data={root}
            nodeRadius={15}
            height={400}
            width={800}
          />
        )}
      </div>
    </div>
  );
};

export default App;
