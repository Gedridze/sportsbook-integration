window.addEventListener("message", (event) => {
  if (!event.data.topic) return;
  console.log(event.data.topic, event.data.payload);
	switch(event.data.topic) {
		case 'redirect': 
			redirectPage(event.data.payload.url);
			break;
    case 'bettingSlipBetsCount': {
      document.getElementById('bet-count-value').innerText = event.data.payload.count;
      break
    }
	}
})

function redirectPage(url) {
  window.location.href = url;
}

const clientUrl = "https://sportsbook.adv.bet/panel-dev";
const script = document.createElement("script");
script.onload = function () {
  createIFrame();
};

script.src = `${clientUrl}/iframeResizer.min.js?${Date.now()}`;
document.head.appendChild(script);
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

function createIFrame() {
  let iFrame = document.getElementById("iframe");
  const url = document.getElementById("link-input").value;
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
    { log: false, checkOrigin: false, stickyHeaderHeight: 150 },
    "#iframe"
  ); // Onload logic for IFrame init
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

