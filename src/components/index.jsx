import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { SVGRenderer } from "echarts/renderers";

import {
  getCustomCircleElement,
  getCustomPathElement,
  getCustomSvgDefsPattern,
} from "./svgPatternConfig.js";

export function EChart({ options }) {
  const uniqueId = useRef(Math.random());

  useEffect(() => {
    echarts.use([SVGRenderer]);

    var myChart = echarts.init(
      document.getElementById(`main${uniqueId.current}`),
      null,
      {
        renderer: "svg",
      }
    );

    // uppend the defs pattern to dom <svg> node
    const svgElement = myChart.getZr().painter.root.firstChild.firstChild;
    svgElement.appendChild(getCustomSvgDefsPattern());

    myChart.on("click", function (params) {
      alert(params.name);
      console.log("onclick", params);
    });

    myChart.on("mouseover", function (params) {
      let parentNode = params.event.event.target.parentElement;
      switch (params.componentSubType) {
        case "line": {
          // area chart
          if (parentNode.attributes["clip-path"]?.nodeName === "clip-path") {
            console.log("mouser over parantNode", parentNode);
            parentNode.appendChild(getCustomPathElement(params));
          }
          break;
        }
        case "scatter": {
          parentNode.appendChild(getCustomCircleElement(params));

          break;
        }
        default: {
          // uppend the path to <g> node
          let parentNode = params.event.event.target.parentElement;
          parentNode && parentNode.appendChild(getCustomPathElement(params));
        }
      }
    });

    myChart.on("mouseout", function (params) {
      let selectedTarget = params.event.event.target;
      let childNodes = selectedTarget.parentNode.childNodes;


      if (selectedTarget.nodeName === "svg") {
        const childNodeList = Array.from(selectedTarget.childNodes);
        childNodeList.forEach((item) => {
          if (item.nodeName === "g") {
            let childNodeList = item.childNodes;
            childNodeList.forEach((item) => {
              if (item.attributes?.id?.nodeValue === "svg-pattern") {
                item.parentNode.removeChild(item);
              }
            });
          }
        });
      } else {
        const childNodeList = Array.from(childNodes);
        childNodeList.forEach((item) => {
          if (item.attributes?.id?.nodeValue === "svg-pattern") {
            item.parentNode.removeChild(item);
          }
        });
      }
    });

    myChart.setOption(options);

    return () => {
      myChart.dispose();
    };
  }, [options]);

  return (
    <div>
      <div
        style={{ width: "900px", height: "900px" }}
        id={`main${uniqueId.current}`}
      />
    </div>
  );
}
