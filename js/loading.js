"use strict";

(() => {
  function backgroundBackup() {
    let windowWidth = $(window).width();
    let windowHeight = $(window).height();
    let bgUrl = "url(";

    const defaultBg = {
      lowRes: {
        url: "assets/default-bg-low-res.jpg",
        width: 1250,
        height: 834
      },
      midRes: {
        url: "assets/default-bg-mid-res.jpg",
        width: 2200,
        height: 1469
      },
      highRes: {
        url: "assets/default-bg-high-res.jpg",
        width: 5120,
        height: 3418
      }
    }

    function selectBgRes() {
      switch (true) {
        case windowWidth <= defaultBg.lowRes.width || windowHeight <= defaultBg.lowRes.height:
          return defaultBg.lowRes.url;
          break;
        case windowWidth <= defaultBg.midRes.width || windowHeight <= defaultBg.midRes.height:
          return defaultBg.midRes.url;
          break;
        default:
          return defaultBg.highRes.url;
      }
    }

    bgUrl += selectBgRes();
    bgUrl += ") center center fixed / cover no-repeat";
    console.log(bgUrl);
    $(document.body).css("background", bgUrl);
  };

  backgroundBackup();
})();
