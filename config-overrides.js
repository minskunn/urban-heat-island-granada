const { override, addWebpackModuleRule } = require("customize-cra");

module.exports = override(
  addWebpackModuleRule({
    test: /\.geojson$/,
    use: [
      {
        loader: "file-loader",
        options: {
          name: "[name].[ext]",
        },
      },
    ],
  })
);
