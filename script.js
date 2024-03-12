/** window.addEventListener("message", (event) => {
	if (event.origin !== 'http://localhost:5173') {
		return 
	}
	switch(event.data.topic) {
		case 'height_change': 
			updateIframeHeight(event.data.payload.height);
			break;
		case 'get_viewport':
			sendViewPortInfo();
			break;
		case 'subscribe_scroll':
			subscribeScroll();
			break;
		case 'unsubscribe_scroll':
			unsubscribeScroll();
			break;
	}
}) */

const clientUrl = 'https://sportsbook.adv.bet/panel-dev';
const script = document.createElement('script');
script.onload = function () {
	createIFrame()
}

script.src = `${clientUrl}/iframeResizer.min.js?${Date.now()}`;
document.head.appendChild(script)
function updateIframeHeight(height) {
	const iframe = document.getElementById('iframe');
	iframe.style.height = `${height}px`
}

function sendViewPortInfo() {
	const iframe = document.getElementById('iframe');
	const payload = {
		height: window.innerHeight - 100,
		scrollY: window.scrollY,
		iframeTopOffset: iframe.offsetTop
	}

	iframe.contentWindow.postMessage(
		{topic: 'get_viewport', payload}, '*'
	)
}

function subscribeScroll() {
	document.addEventListener('scroll', handleScroll);
	document.addEventListener('resize', handleScroll);
}
function unsubscribeScroll() {
	document.removeEventListener('scroll', handleScroll);
	document.removeEventListener('resize', handleScroll);
}

function handleScroll () {
	sendViewPortInfo();
}

function createIFrame() {
	let iFrame = document.getElementById('iframe');
	const url = document.getElementById('link-input').value;
	if (iFrame) {
		iFrame.src = url;
		return;
	}
	iFrame = document.createElement('iframe');
	iFrame.src = url;
	iFrame.id = 'iframe';
	iFrame.style = 'width: 100%; margin-top: 100px;'
	iFrame.frameBorder = 0;
	iFrame.allow = 'clipboard-write'
	document.getElementById('header').after(iFrame);
	window.iFrameResize({log: false, checkOrigin: false, stickyHeaderHeight: 100}, '#iframe') // Onload logic for IFrame init
}
