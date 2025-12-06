import React from 'react';

// Using simple SVG icons to avoid external dependencies issues in some environments
// Converted to React.createElement to support .ts extension (no JSX)
export const Icons = {
  Camera: (props: React.SVGProps<SVGSVGElement>) => (
    React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props },
      React.createElement("path", { d: "M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" }),
      React.createElement("circle", { cx: "12", cy: "13", r: "3" })
    )
  ),
  Upload: (props: React.SVGProps<SVGSVGElement>) => (
    React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props },
      React.createElement("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }),
      React.createElement("polyline", { points: "17 8 12 3 7 8" }),
      React.createElement("line", { x1: "12", y1: "3", x2: "12", y2: "15" })
    )
  ),
  Search: (props: React.SVGProps<SVGSVGElement>) => (
    React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props },
      React.createElement("circle", { cx: "11", cy: "11", r: "8" }),
      React.createElement("line", { x1: "21", y1: "21", x2: "16.65", y2: "16.65" })
    )
  ),
  User: (props: React.SVGProps<SVGSVGElement>) => (
    React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props },
      React.createElement("path", { d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" }),
      React.createElement("circle", { cx: "12", cy: "7", r: "4" })
    )
  ),
  ArrowLeft: (props: React.SVGProps<SVGSVGElement>) => (
    React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props },
      React.createElement("line", { x1: "19", y1: "12", x2: "5", y2: "12" }),
      React.createElement("polyline", { points: "12 19 5 12 12 5" })
    )
  ),
  Check: (props: React.SVGProps<SVGSVGElement>) => (
    React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props },
      React.createElement("polyline", { points: "20 6 9 17 4 12" })
    )
  ),
  Aperture: (props: React.SVGProps<SVGSVGElement>) => (
    React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props },
      React.createElement("circle", { cx: "12", cy: "12", r: "10" }),
      React.createElement("line", { x1: "14.31", y1: "8", x2: "20.05", y2: "17.94" }),
      React.createElement("line", { x1: "9.69", y1: "8", x2: "21.17", y2: "8" }),
      React.createElement("line", { x1: "7.38", y1: "12", x2: "13.12", y2: "2.06" }),
      React.createElement("line", { x1: "9.69", y1: "16", x2: "3.95", y2: "6.06" }),
      React.createElement("line", { x1: "14.31", y1: "16", x2: "2.83", y2: "16" }),
      React.createElement("line", { x1: "16.62", y1: "12", x2: "10.88", y2: "21.94" })
    )
  ),
  Loader: (props: React.SVGProps<SVGSVGElement>) => (
    React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props },
      React.createElement("path", { d: "M21 12a9 9 0 1 1-6.219-8.56" })
    )
  )
};