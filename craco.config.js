module.exports = {
  style: {
    postcss: {
      plugins: [
        require("postcss-import"),
        require("tailwindcss")("./tailwind.config.js"),
        require("autoprefixer"),
        require("cssnano")({
          preset: "default",
        }),
      ],
    },
  },
};
