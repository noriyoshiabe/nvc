import babel from "rollup-plugin-babel"

export default {
  input: "src/index.js",
  output: {
    file: "nvc.js",
    format: "umd",
    name: "NVC"
  },
  plugins: [babel()]
}
