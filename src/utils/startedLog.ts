console.groupCollapsed(`Extension context for ${chrome.runtime.getManifest().name} started.`);
console.log('process.env.NODE_ENV:', process.env.NODE_ENV);
console.log('process.env.BUILD_ENV:', process.env.BUILD_ENV);
console.log('process.env.DEPLOY_MODE:', process.env.DEPLOY_MODE);
console.groupEnd();