#!/usr/bin/env node

import { createInterface } from "readline";
import { createContext, runInNewContext } from "vm";
import { yellow, red } from "btss";

const context = {
  e: Math.E,
  pi: Math.PI,

  sq: (x) => Math.pow(x,2),
  pow: (a,b) => Math.pow(a,b), 
  sqrt: (x) => Math.sqrt(x),
  rt: (a,b) => Math.pow(a,1/b),

  ln: (x) => Math.log(x),
  log: (x) => Math.log10(x),
  log2: (x) => Math.log2(x),

  sin: (x) => Math.sin(x),
  cos: (x) => Math.cos(x),
  tan: (x) => Math.tanh(x),
  asin: (x) => Math.asin(x),
  acos: (x) => Math.acos(x),
  atan: (x) => Math.atan(x)
};
const pointer = "> ";
createContext(context);

init();
function init() {
  process.stdout.write(pointer);
  createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true,
  }).on("line", (data) => {
    console.log(compute(parse(data)));
    process.stdout.write(pointer);
  });
}

function compute(data) {
  data = data.split(";").filter(Boolean);
  if (data.length != 1) {
    for (let i = 0; i <= data.length; i++) run(data[i]);
  }
  run(`x__ = ${data[data.length - 1]}`);
  return context.x__;
}

function parse(data) {
  data = data.replaceAll("[","(").replaceAll("]",")");
  data = data.replaceAll(/\.|x/g,"*");
  data = data.replaceAll(/a/g,"+");
  return data;
}

function run(code) {
  try {
    runInNewContext(code, context);
  } catch (e) {
    console.log(red("[err] ") + e.message);
  }
}
