module.exports = {
  css: {
    loaderOptions: {
      sass: {
        data: `
          @import "~foundation-sites/scss/foundation.scss";
          @import "@/sass/_variables.scss";
        `
      }
    }
  }
};
