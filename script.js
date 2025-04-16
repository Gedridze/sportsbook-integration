const RenderMode = {
  DEVICE_HEIGHT: 'deviceHeight',
  FULL_HEIGHT: 'fullHeight',
};

window.addEventListener("message", (event) => {
  if (!event.data.topic) return;
  console.log(event.data.topic, event.data.payload);
  switch (event.data.topic) {
    case 'redirect':
      redirectPage(event.data.payload.url);
      break;
    case 'bettingSlipBetsCount': {
      document.getElementById('bet-count-value').innerText = event.data.payload.count;
      break
    }
    case 'bettingSlipOpen': {
      if (event.data.payload.state) {
        document.getElementById('sticky-footer').style.display = 'none';
      } else {

        document.getElementById('sticky-footer').style.display = 'block';
      }
      break
    }
  }
})

function isRenderModeEnabled(urlInput, mode = RenderMode.FULL_HEIGHT) {
  const url = typeof urlInput === 'string' ? new URL(urlInput) : urlInput;
  return url.searchParams.get("renderMode") === mode;
}

function redirectPage(url) {
  window.location.href = url;
}

function updateIframeHeight(height) {
  const iframe = document.getElementById("iframe");
  iframe.style.height = `${height}px`;
}

function sendViewPortInfo() {
  const iframe = document.getElementById("iframe");
  const payload = {
    height: window.innerHeight - 100,
    scrollY: window.scrollY,
    iframeTopOffset: iframe.offsetTop,
  };

  iframe.contentWindow.postMessage({ topic: "get_viewport", payload }, "*");
}

function subscribeScroll() {
  document.addEventListener("scroll", handleScroll);
  document.addEventListener("resize", handleScroll);
}
function unsubscribeScroll() {
  document.removeEventListener("scroll", handleScroll);
  document.removeEventListener("resize", handleScroll);
}

function handleScroll() {
  sendViewPortInfo();
}

function toggleRenderMode(urlString, mode = RenderMode.DEVICE_HEIGHT) {
  const url = new URL(urlString);
  if (isRenderModeEnabled(url, mode)) {
    url.searchParams.delete("renderMode");
  } else {
    url.searchParams.set("renderMode", mode);
  }
  return url.toString();
}

function toggleRenderModeClasses(currentUrl) {
  const renderModeDeviceHeight = isRenderModeEnabled(currentUrl, RenderMode.DEVICE_HEIGHT);
  const documentNode = document.documentElement;
  const footer = document.getElementById('sticky-footer');
  if (renderModeDeviceHeight) {
    documentNode.classList.add('device-height');
  } else {
    documentNode.classList.remove('device-height');
  }

  footer.style.height = '50px';//reset back to default
}

function createIFrame() {
  const oldScript = document.getElementById('iframeResizer');
  if (oldScript) {
    oldScript.remove();
  }
  const url = document.getElementById("link-input").value;
  toggleRenderModeClasses(url);
  const clientUrl = new URL(url).origin;
  const script = document.createElement("script");
  script.src = `${clientUrl}/iframeResizer.min.js?${Date.now()}`;
  script.id = "iframeResizer";
  document.head.appendChild(script);
  script.onload = function() {
    let iFrame = document.getElementById("iframe");
    if (iFrame) {
      iFrame.src = url;
      return;
    }
    iFrame = document.createElement("iframe");
    iFrame.src = url;
    iFrame.id = "iframe";
    iFrame.style = "width: 100%; margin-top: 150px;";
    iFrame.frameBorder = 0;
    iFrame.setAttribute('allow', "web-share; clipboard-write;");
    document.getElementById("header").after(iFrame);
    window.iFrameResize(
      { log: false, checkOrigin: false, offsetTop: 67, stickyHeaderHeight: 150, stickyFooterHeight: 50, locationUrl: window.location.href },
      "#iframe"
    ); // Onload logic for IFrame init
  };
}

function sendUserMessage() {
  const iFrame = document.getElementById("iframe").contentWindow;
  console.log(
    {
      topic: "updateUserData",
    },
  )

  if (iFrame) {
    iFrame.postMessage(
      {
        topic: "updateUserData",
      },
      "*"
    );
  }
}

function sendRedirectMessage(url) {
  const iFrame = document.getElementById("iframe").contentWindow;
  if (iFrame) {
    iFrame.postMessage(
      {
        topic: "redirectTo",
        payload: {
          url,
        },
      },
      "*"
    );
  }
}

function setOdds(string) {
  const iFrame = document.getElementById("iframe").contentWindow;
  if (iFrame) {
    iFrame.postMessage(
      {
        topic: "oddsFormat",
        payload: {
          format: string,
        },
      },
      "*"
    );
  }
}

function toggleSlip(state) {
  const iFrame = document.getElementById("iframe").contentWindow;
  if (iFrame) {
    iFrame.postMessage(
      {
        topic: "toggleBettingSlip",
        payload: {
          state
        },
      },
      "*"
    );
  }
}

function toggleSearch(state) {
  const iFrame = document.getElementById("iframe").contentWindow;
  if (iFrame) {
    iFrame.postMessage(
      {
        topic: "toggleSearch",
        payload: {
          state
        },
      },
      "*"
    );
  }
}

function submitSearch() {
  const value = document.getElementById("search-input").value;
  const iFrame = document.getElementById("iframe").contentWindow;
  if (iFrame) {
    iFrame.postMessage(
      {
        topic: "toggleSearch",
        payload: {
          state: true,
          query: value
        },
      },
      "*"
    );
  }
}

function openMyBets() {
  const iFrame = document.getElementById("iframe").contentWindow;
  if (iFrame) {
    iFrame.postMessage(
      {
        topic: "openUserBets",
      },
      "*"
    );
  }
}

function updateStickyFooterHeight(height) {
  const iFrame = document.getElementById("iframe").contentWindow;
  if (iFrame) {
    iFrame.postMessage(
      {
        topic: "updateViewPortInfo",
        payload: {
          stickyFooterHeight: parseInt(height)
        }
      },
      "*"
    );
  }
}

function toggleStickyFooterHeight() {
  const footer = document.getElementById('sticky-footer')
  const height = footer.style.height.split('px')[0];
  if (height === '150') {
    footer.style.height = '50px';
    updateStickyFooterHeight(50)
    return
  }
  footer.style.height = '150px';
  updateStickyFooterHeight(150)
}

function selectLandingPage() {
  const iFrame = document.getElementById("iframe");

  if (iFrame) {
    iFrame.contentWindow.postMessage(
        {
          topic: "suspendIframe",
          payload: {
            state: true
          }
        },
        "*"
    );
    iFrame.style.display = 'none';
  }
}

function selectSportsPage() {
  const iFrame = document.getElementById("iframe");

  if (iFrame) {
    iFrame.contentWindow.postMessage(
        {
          topic: "suspendIframe",
          payload: {
            state: false
          }
        },
        "*"
    );
    iFrame.style.display = 'inline';
  }
}

document.addEventListener("DOMContentLoaded", () => {
  createIFrame();
})

function toggleRenderModeAndCreateIframe() {
  const input = document.getElementById("link-input");
  input.value = toggleRenderMode(input.value, RenderMode.DEVICE_HEIGHT);
  createIFrame();
  scrollTo(0, 0);
}
