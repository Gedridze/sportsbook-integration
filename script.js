window.addEventListener("message", (event) => {
  if (!event.data.topic) return;
  console.log(event.data.topic, event.data.payload);
	switch(event.data.topic) {
                case 'heightChange':
                  updateIframeHeight(event.data.payload.height);

  const iFrame = document.getElementById("iframe").contentWindow;
  if (iFrame) {
    iFrame.postMessage(
      {
        topic: "scroll",
        payload: {
          scrollDistance: -wrapper.getBoundingClientRect().top,
        },
      },
      "*"
    );
  }


                        break;
		case 'redirect': 
			redirectPage(event.data.payload.url);
			break;
    case 'bettingSlipBetsCount': 
      document.getElementById('bet-count-value').innerText = event.data.payload.count;
      break;
    
case 'routeChange': 
console.log('routeChange')
console.log('to top')
window.scrollTo({top: 0, behavior: 'instant'})
break;
	}
})

function redirectPage(url) {
  window.location.href = url;
}

const clientUrl = "https://sportsbook.adv.bet/panel-dev";
window.onload = function () {
  createIFrame();
};
document.onscroll = function () {
  const iFrame = document.getElementById("iframe").contentWindow;
  if (iFrame) {
    iFrame.postMessage(
      {
        topic: "scroll",
        payload: {
          scrollDistance: -wrapper.getBoundingClientRect().top,
        },
      },
      "*"
    );
  }
};

function updateIframeHeight(height) {
  const iframe = document.getElementById("wrapper");
  iframe.style.height = `${height}px`;
iframe.style.minHeight = '100dvh'
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
  iFrame.style = "width: 100%; height: 100dvh;";
  iFrame.frameBorder = 0;
  iFrame.setAttribute('allow', "web-share; clipboard-write;");
  document.getElementById("wrapper").appendChild(iFrame);
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

