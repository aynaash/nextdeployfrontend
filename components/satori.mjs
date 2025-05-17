
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import NextDeployLogo  from "./logo.tsx";
import React from "react";

const svg = await satori(<NextDeployLogo />, {
  width: 600,
  height: 120,
  fonts: [/* Optional fonts config */],
});

const resvg = new Resvg(svg);
const png = resvg.render().asPng(); // Buffer
fs.writeFileSync("nextdeploy.png", png);
