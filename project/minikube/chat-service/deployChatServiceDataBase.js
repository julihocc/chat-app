const { exec } = require('child_process');

function execShellCommand(cmd) {
	return new Promise((resolve, reject) => {
		exec(cmd, (error, stdout, stderr) => {
			if (error) {
				console.warn(error);
				reject(error);
			}
			resolve(stdout ? stdout : stderr);
		});
	});
}

// Paths to your Kubernetes YAML files
const kubeFiles = [
	'./mongo_chat-deployment.yaml',
	'./mongo_chat-service.yaml',
	'./mongo_chat-pvc.yaml'
];

async function applyKubeConfigurations() {
	console.log("Deploying MongoDB for Chat Service...");

	for (const file of kubeFiles) {
		try {
			const output = await execShellCommand(`kubectl apply -f ${file}`);
			console.log(output);
		} catch (error) {
			console.error(`Error applying file ${file}:`, error);
		}
	}

	console.log("Deployment of Chat Service DataBase is complete.");
}

applyKubeConfigurations().then(r => console.log(r))
