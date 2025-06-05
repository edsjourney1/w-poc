import envObj from './env.js';
import { windowUrlDetails } from './tools.js';

document.addEventListener('DOMContentLoaded', () => {
  const paddingEl = document.createElement('div');
  const bodyEl = document.body;
  bodyEl.insertBefore(paddingEl, bodyEl.firstChild);
  paddingEl.className = 'header-padding';
  const env =
    envObj.find((item) => item.domain.some((item2) => windowUrlDetails.origin.includes(item2))) ||
    {};
  if (env?.dynatrace) {
    const script = document.createElement('script');
    script.src = env.dynatrace;
    script.type = 'text/javascript';
    script.crossOrigin = 'anonymous';
    document.head.append(script);
  }
  if (env?.munchkin) {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.innerHTML = env.munchkin;
    document.head.append(script);
  }
  if (env?.qualtrics) {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.innerHTML = env.qualtrics;
    document.head.append(script);
  }
  if (env?.qualtricsID) {
    const div = document.createElement('div');
    div.id = env.qualtricsID;
    document.body.append(div);
  }
  if (env?.rum) {
    const script = document.createElement('script');
    script.src = env.rum;
    script.type = 'text/javascript';
    script.setAttribute('defer', 'defer');
    document.head.append(script);
  }
});
