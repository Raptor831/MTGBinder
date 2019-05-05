module.exports = {
  css: {
    loaderOptions: {
      sass: {
        data: `
          @import "@/sass/_variables.scss";
          @import "@/sass/_settings.scss";
          @import "~foundation-sites/scss/foundation.scss";
          @include foundation-everything;
        `
      }
    }
  }
};
