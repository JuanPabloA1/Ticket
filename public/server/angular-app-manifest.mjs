
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "redirectTo": "/login",
    "route": "/"
  },
  {
    "renderMode": 2,
    "route": "/login"
  },
  {
    "renderMode": 2,
    "route": "/vender"
  },
  {
    "renderMode": 2,
    "route": "/historial"
  },
  {
    "renderMode": 2,
    "redirectTo": "/login",
    "route": "/**"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 5094, hash: '2016442061fa9b4b6cdde820a95de0c2fb976755d87816044300266f2337508a', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1005, hash: 'c9ec2f6ee243933586b813f673af0763098872afbc2ae8c6d70067871fa74530', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'login/index.html': {size: 15949, hash: '35f6f8846c54805b1b3e511e83dd17c229b49b53d053183cd1103d9d933cd80d', text: () => import('./assets-chunks/login_index_html.mjs').then(m => m.default)},
    'styles-63C7QGJG.css': {size: 232342, hash: 'v8ucZsHxoyY', text: () => import('./assets-chunks/styles-63C7QGJG_css.mjs').then(m => m.default)}
  },
};
